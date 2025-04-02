import express from 'express';
import {
  createApplication,
  getDeviceApplications,
  getActiveApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicationsByCategory,
  deleteApplication
} from '../controllers/application.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new application entry
router.post('/', createApplication);

// Get all applications for a device
router.get('/device/:deviceId', getDeviceApplications);

// Get active applications for a device
router.get('/device/:deviceId/active', getActiveApplications);

// Update application status
router.patch('/:id/status', updateApplicationStatus);

// Get application usage statistics
router.get('/device/:deviceId/stats', getApplicationStats);

// Get applications by category
router.get('/device/:deviceId/category/:category', getApplicationsByCategory);

// Delete application entry
router.delete('/:id', deleteApplication);

export default router; 