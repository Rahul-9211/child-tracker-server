import { Request, Response } from 'express';
import ProcessActivity, { IProcessActivity } from '../models/process-activity.model';

// Create new process activity entry
export const createProcessActivity = async (req: Request, res: Response) => {
  try {
    const processActivity = new ProcessActivity(req.body);
    await processActivity.save();
    res.status(201).json(processActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating process activity entry', error });
  }
};

// Get active processes for a device
export const getActiveProcesses = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const processes = await ProcessActivity.find({ 
      deviceId,
      isActive: true 
    }).sort({ startTime: -1 });
    
    res.json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active processes', error });
  }
};

// Get process history for a device
export const getProcessHistory = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const processes = await ProcessActivity.find(query)
      .sort({ startTime: -1 })
      .limit(Number(limit));

    res.json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching process history', error });
  }
};

// Get process statistics for a device
export const getProcessStats = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const stats = await ProcessActivity.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$packageName',
          totalDuration: { $sum: '$duration' },
          averageCpuUsage: { $avg: '$cpuUsage' },
          averageMemoryUsage: { $avg: '$memoryUsage' },
          maxCpuUsage: { $max: '$cpuUsage' },
          maxMemoryUsage: { $max: '$memoryUsage' },
          processCount: { $sum: 1 },
          lastActive: { $max: '$startTime' }
        }
      },
      { $sort: { totalDuration: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching process statistics', error });
  }
};

// Update process status (end time and duration)
export const updateProcessStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { endTime, cpuUsage, memoryUsage } = req.body;

    const process = await ProcessActivity.findById(id);
    if (!process) {
      return res.status(404).json({ message: 'Process activity not found' });
    }

    process.endTime = endTime;
    process.duration = Math.floor((endTime.getTime() - process.startTime.getTime()) / 1000);
    process.isActive = false;
    
    if (cpuUsage !== undefined) process.cpuUsage = cpuUsage;
    if (memoryUsage !== undefined) process.memoryUsage = memoryUsage;

    await process.save();
    res.json(process);
  } catch (error) {
    res.status(500).json({ message: 'Error updating process status', error });
  }
};

// Get high resource usage processes
export const getHighResourceProcesses = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { cpuThreshold = 80, memoryThreshold = 500 } = req.query;

    const processes = await ProcessActivity.find({
      deviceId,
      $or: [
        { cpuUsage: { $gte: Number(cpuThreshold) } },
        { memoryUsage: { $gte: Number(memoryThreshold) } }
      ]
    }).sort({ startTime: -1 });

    res.json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching high resource processes', error });
  }
};

// Get processes by package name
export const getProcessesByPackage = async (req: Request, res: Response) => {
  try {
    const { deviceId, packageName } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { 
      deviceId,
      packageName 
    };
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const processes = await ProcessActivity.find(query)
      .sort({ startTime: -1 });

    res.json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching processes by package', error });
  }
};

// Delete process entries
export const deleteProcessActivities = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const result = await ProcessActivity.deleteMany(query);
    res.json({ 
      message: 'Process activities deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting process activities', error });
  }
}; 