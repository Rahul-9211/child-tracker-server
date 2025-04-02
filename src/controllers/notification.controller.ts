import { Request, Response } from 'express';
import Notification, { INotification } from '../models/notification.model';

// Create new notification entry
export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Error creating notification entry', error });
  }
};

// Get unread notifications for a device
export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const notifications = await Notification.find({ 
      deviceId,
      isRead: false,
      isCleared: false
    }).sort({ timestamp: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread notifications', error });
  }
};

// Get notification history for a device
export const getNotificationHistory = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification history', error });
  }
};

// Get notifications by app
export const getNotificationsByApp = async (req: Request, res: Response) => {
  try {
    const { deviceId, appPackageName } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { 
      deviceId,
      appPackageName 
    };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications by app', error });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const stats = await Notification.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$appPackageName',
          totalNotifications: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          clearedCount: {
            $sum: { $cond: [{ $eq: ['$isCleared', true] }, 1, 0] }
          },
          lastNotification: { $max: '$timestamp' }
        }
      },
      { $sort: { totalNotifications: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification statistics', error });
  }
};

// Update notification status (read/cleared)
export const updateNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead, isCleared } = req.body;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (isRead !== undefined) notification.isRead = isRead;
    if (isCleared !== undefined) notification.isCleared = isCleared;

    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification status', error });
  }
};

// Get notifications by category
export const getNotificationsByCategory = async (req: Request, res: Response) => {
  try {
    const { deviceId, category } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { 
      deviceId,
      category 
    };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications by category', error });
  }
};

// Delete notifications
export const deleteNotifications = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { deviceId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const result = await Notification.deleteMany(query);
    res.json({ 
      message: 'Notifications deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications', error });
  }
}; 