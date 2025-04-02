import express from 'express';
import * as SMSController from '../controllers/sms.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Public route for creating SMS records (used by the mobile app)
router.post('/', SMSController.createSMS);

// Protected routes (require authentication)
router.get('/device/:deviceId', auth, SMSController.getDeviceSMS);
router.get('/device/:deviceId/stats', auth, SMSController.getSMSStats);
router.put('/:id', auth, SMSController.updateSMS);
router.delete('/:id', auth, SMSController.deleteSMS);

export default router; 