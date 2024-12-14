import express from 'express';
import deviceRoutes from './device.routes';
import authRoutes from './auth.routes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Device routes
router.use('/devices', deviceRoutes);

export default router; 