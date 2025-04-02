import { Request, Response } from 'express';
import SMS, { ISMS } from '../models/sms.model';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';

// Create new SMS record
export const createSMS = async (req: Request, res: Response) => {
  try {
    const smsData = req.body;
    const sms = new SMS(smsData);
    const savedSMS = await sms.save();
    res.status(201).json(savedSMS);
  } catch (error) {
    res.status(500).json({ message: 'Error creating SMS record', error });
  }
};

// Get SMS records for a device with role-based access
export const getDeviceSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(deviceId)) {
      return res.status(403).json({ message: 'Access denied to this device\'s SMS' });
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
    const smsRecords = await SMS.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await SMS.countDocuments(query);

    res.status(200).json({
      smsRecords,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SMS records', error });
  }
};

// Get SMS statistics for a device
export const getSMSStats = async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(deviceId)) {
      return res.status(403).json({ message: 'Access denied to this device\'s SMS stats' });
    }

    const stats = await SMS.aggregate([
      { $match: { deviceId } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          incomingMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'incoming'] }, 1, 0] }
          },
          outgoingMessages: {
            $sum: { $cond: [{ $eq: ['$type', 'outgoing'] }, 1, 0] }
          },
          blockedMessages: {
            $sum: { $cond: ['$isBlocked', 1, 0] }
          },
          spamMessages: {
            $sum: { $cond: ['$metadata.isSpam', 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json(stats[0] || {
      totalMessages: 0,
      incomingMessages: 0,
      outgoingMessages: 0,
      blockedMessages: 0,
      spamMessages: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SMS statistics', error });
  }
};

// Update SMS record (e.g., mark as read, block)
export const updateSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sms = await SMS.findById(id);
    if (!sms) {
      return res.status(404).json({ message: 'SMS record not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(sms.deviceId)) {
      return res.status(403).json({ message: 'Access denied to update this SMS' });
    }

    const updatedSMS = await SMS.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedSMS);
  } catch (error) {
    res.status(500).json({ message: 'Error updating SMS record', error });
  }
};

// Delete SMS record
export const deleteSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sms = await SMS.findById(id);
    if (!sms) {
      return res.status(404).json({ message: 'SMS record not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(sms.deviceId)) {
      return res.status(403).json({ message: 'Access denied to delete this SMS' });
    }

    await SMS.findByIdAndDelete(id);
    res.status(200).json({ message: 'SMS record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting SMS record', error });
  }
}; 