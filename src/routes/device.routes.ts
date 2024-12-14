import express from 'express';
import * as DeviceController from '../controllers/device.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/public', DeviceController.getAllDevices);

// Protected routes with role-based access
router.get('/', auth, DeviceController.getAllDevices);
router.get('/:id', auth, DeviceController.getDeviceById);
router.post('/', DeviceController.createDevice);
router.put('/:id', auth, DeviceController.updateDevice);
router.delete('/:id', auth, DeviceController.deleteDevice);

// Super admin only route
router.post('/assign', auth, DeviceController.assignDeviceToAdmin);

export default router; 