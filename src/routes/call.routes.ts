import express from 'express';
import * as CallController from '../controllers/call.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Public route for creating call records (used by the mobile app)
router.post('/', CallController.createCall);

// Protected routes (require authentication)
router.get('/device/:deviceId', auth, CallController.getDeviceCalls);
router.get('/device/:deviceId/stats', auth, CallController.getCallStats);
router.put('/:id', auth, CallController.updateCall);
router.delete('/:id', auth, CallController.deleteCall);

export default router; 