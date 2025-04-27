import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.post('/add-device', auth, AuthController.addDeviceToUser);
router.get('/logs', auth, AuthController.getAuthLogs);

// Add this route
// router.post('/super-admin-signup', AuthController.superAdminSignup);

export default router; 