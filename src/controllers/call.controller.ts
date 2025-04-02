import { Request, Response } from 'express';
import Call, { ICall } from '../models/call.model';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';

// Create new call record
export const createCall = async (req: Request, res: Response) => {
  try {
    const callData = req.body;
    const call = new Call(callData);
    const savedCall = await call.save();
    res.status(201).json(savedCall);
  } catch (error) {
    res.status(500).json({ message: 'Error creating call record', error });
  }
};

// Get call records for a device with role-based access
export const getDeviceCalls = async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(deviceId)) {
      return res.status(403).json({ message: 'Access denied to this device\'s calls' });
    }

    const { 
      startDate, 
      endDate, 
      type, 
      status,
      isBlocked,
      page = 1,
      limit = 50 
    } = req.query;

    const query: any = { deviceId };

    // Apply filters
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    if (type) query.type = type;
    if (status) query.status = status;
    if (isBlocked !== undefined) query.isBlocked = isBlocked;

    const skip = (Number(page) - 1) * Number(limit);
    const callRecords = await Call.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Call.countDocuments(query);

    res.status(200).json({
      callRecords,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call records', error });
  }
};

// Get call statistics for a device
export const getCallStats = async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(deviceId)) {
      return res.status(403).json({ message: 'Access denied to this device\'s call stats' });
    }

    const stats = await Call.aggregate([
      { $match: { deviceId } },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          incomingCalls: {
            $sum: { $cond: [{ $eq: ['$type', 'incoming'] }, 1, 0] }
          },
          outgoingCalls: {
            $sum: { $cond: [{ $eq: ['$type', 'outgoing'] }, 1, 0] }
          },
          missedCalls: {
            $sum: { $cond: [{ $eq: ['$type', 'missed'] }, 1, 0] }
          },
          blockedCalls: {
            $sum: { $cond: ['$isBlocked', 1, 0] }
          },
          spamCalls: {
            $sum: { $cond: ['$metadata.isSpam', 1, 0] }
          },
          totalDuration: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);

    res.status(200).json(stats[0] || {
      totalCalls: 0,
      incomingCalls: 0,
      outgoingCalls: 0,
      missedCalls: 0,
      blockedCalls: 0,
      spamCalls: 0,
      totalDuration: 0,
      averageDuration: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call statistics', error });
  }
};

// Update call record (e.g., mark as blocked, update duration)
export const updateCall = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const call = await Call.findById(id);
    if (!call) {
      return res.status(404).json({ message: 'Call record not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(call.deviceId)) {
      return res.status(403).json({ message: 'Access denied to update this call' });
    }

    const updatedCall = await Call.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCall);
  } catch (error) {
    res.status(500).json({ message: 'Error updating call record', error });
  }
};

// Delete call record
export const deleteCall = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const call = await Call.findById(id);
    if (!call) {
      return res.status(404).json({ message: 'Call record not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(call.deviceId)) {
      return res.status(403).json({ message: 'Access denied to delete this call' });
    }

    await Call.findByIdAndDelete(id);
    res.status(200).json({ message: 'Call record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting call record', error });
  }
}; 