import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import AuthLog from '../models/auth-log.model';
import mongoose from 'mongoose';
import Device from '../models/device.model';
import { AuthRequest } from '../middleware/auth.middleware';
import dotenv from 'dotenv';
import { SignupRequestBody } from '../utils/interface/ISignUp';
dotenv.config();

// Helper function to log auth activities
const logAuthActivity = async (
  userId: mongoose.Types.ObjectId | string,
  action: 'SIGNUP' | 'SIGNIN',
  status: 'SUCCESS' | 'FAILED',
  req: Request,
  failureReason?: string
) => {
  try {
    await AuthLog.create({
      userId: userId.toString(),
      action,
      status,
      failureReason,
      deviceInfo: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        deviceType: req.headers['device-type']
      }
    });
  } catch (error) {
    console.error('Error logging auth activity:', error);
  }
};

// Sign up
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, deviceId, superAdminKey }: SignupRequestBody = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logAuthActivity(
        String(existingUser._id),
        'SIGNUP',
        'FAILED',
        req,
        'Email already exists'
      );
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Handle super_admin creation with key validation
    if (role === 'super_admin') {
      if (superAdminKey !== process.env.SUPER_ADMIN_ACCESS_CODE) {
        return res.status(403).json({ message: 'Invalid super admin key or not allowed through regular signup' });
      }
      
      // Check if super admin already exists
      const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
      if (existingSuperAdmin) {
        return res.status(403).json({ message: 'Super admin already exists' });
      }
    }

    // Validate deviceId if role is admin or user
    if ((role === 'admin' || role === 'user') && !deviceId) {
      return res.status(400).json({ message: 'Device ID is required for admin/user signup' });
    }

    // Check if device exists
    if (deviceId) {
      const device = await Device.findOne({ deviceId });
      if (!device) {
        return res.status(404).json({ message: 'Invalid Device ID' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with device assignment
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'user',
      allowedDevices: deviceId ? [deviceId] : []
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful signup
    await logAuthActivity(String(user._id), 'SIGNUP', 'SUCCESS', req);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error in signup', error });
  }
};

// Sign in
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      await logAuthActivity(
        new mongoose.Types.ObjectId(),
        'SIGNIN',
        'FAILED',
        req,
        'Invalid email'
      );
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await logAuthActivity(
        String(user._id),
        'SIGNIN',
        'FAILED',
        req,
        'Invalid password'
      );
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful signin
    await logAuthActivity(String(user._id), 'SIGNIN', 'SUCCESS', req);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error in signin', error });
  }
};

// Get auth logs (optional - for admin purposes)
export const getAuthLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AuthLog.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auth logs', error });
  }
};

// New API to add device to user after signin
export const addDeviceToUser = async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if device exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Invalid Device ID' });
    }

    // Check if device is already assigned
    if (user.allowedDevices?.includes(deviceId)) {
      return res.status(400).json({ message: 'Device already assigned to user' });
    }

    // Add device to user's allowed devices
    user.allowedDevices = [...(user.allowedDevices || []), deviceId];
    await user.save();

    res.status(200).json({ 
      message: 'Device added successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding device', error });
  }
};
 