import express from 'express';
import deviceRoutes from './device.routes';
import authRoutes from './auth.routes';
import smsRoutes from './sms.routes';
import contactRoutes from './contact.routes';

import locationRoutes from './location.routes';

import callRoutes from './call.routes';
import applicationRoutes from './application.routes';
import notificationRoutes from './notification.routes';



const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Device routes
router.use('/devices', deviceRoutes);

// SMS routes
router.use('/sms', smsRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

// Location routes
router.use('/locations', locationRoutes);

// Call routes
router.use('/calls', callRoutes);

// Application routes
router.use('/applications', applicationRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);



export default router; 