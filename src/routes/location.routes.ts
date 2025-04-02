import express from 'express';
import {
  createLocation,
  getLatestLocation,
  getLocationHistory,
  getLocationStats,
  getLocationsInBoundary,
  getMovementStatus,
  deleteLocations
} from '../controllers/location.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create new location entry
router.post('/', createLocation);

// Get latest location for a device
router.get('/device/:deviceId/latest', getLatestLocation);

// Get location history for a device
router.get('/device/:deviceId/history', getLocationHistory);

// Get location statistics for a device
router.get('/device/:deviceId/stats', getLocationStats);

// Get locations within a geographic boundary
router.get('/device/:deviceId/boundary', getLocationsInBoundary);

// Get movement status for a device
router.get('/device/:deviceId/movement', getMovementStatus);

// Delete location entries
router.delete('/device/:deviceId', deleteLocations);

export default router; 