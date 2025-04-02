import express from 'express';
import {
  createNotification,
  getUnreadNotifications,
  getNotificationHistory,
  getNotificationsByApp,
  getNotificationStats,
  updateNotificationStatus,
  getNotificationsByCategory,
  deleteNotifications
} from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new notification entry
router.post('/', createNotification);

// Get unread notifications for a device
router.get('/device/:deviceId/unread', getUnreadNotifications);

// Get notification history for a device
router.get('/device/:deviceId/history', getNotificationHistory);

// Get notifications by app
router.get('/device/:deviceId/app/:appPackageName', getNotificationsByApp);

// Get notification statistics
router.get('/device/:deviceId/stats', getNotificationStats);

// Update notification status
router.patch('/:id/status', updateNotificationStatus);

// Get notifications by category
router.get('/device/:deviceId/category/:category', getNotificationsByCategory);

// Delete notifications
router.delete('/device/:deviceId', deleteNotifications);

export default router; 