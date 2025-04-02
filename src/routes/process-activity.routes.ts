import express from 'express';
import {
  createProcessActivity,
  getActiveProcesses,
  getProcessHistory,
  getProcessStats,
  updateProcessStatus,
  getHighResourceProcesses,
  getProcessesByPackage,
  deleteProcessActivities
} from '../controllers/process-activity.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new process activity entry
router.post('/', createProcessActivity);

// Get active processes for a device
router.get('/device/:deviceId/active', getActiveProcesses);

// Get process history for a device
router.get('/device/:deviceId/history', getProcessHistory);

// Get process statistics for a device
router.get('/device/:deviceId/stats', getProcessStats);

// Update process status
router.patch('/:id/status', updateProcessStatus);

// Get high resource usage processes
router.get('/device/:deviceId/high-resource', getHighResourceProcesses);

// Get processes by package name
router.get('/device/:deviceId/package/:packageName', getProcessesByPackage);

// Delete process entries
router.delete('/device/:deviceId', deleteProcessActivities);

export default router; 