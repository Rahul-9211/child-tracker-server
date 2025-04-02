import express from 'express';
import deviceRoutes from './device.routes';
import authRoutes from './auth.routes';
import smsRoutes from './sms.routes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Device routes
router.use('/devices', deviceRoutes);

// SMS routes
router.use('/sms', smsRoutes);

export default router; 