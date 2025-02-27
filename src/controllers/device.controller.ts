import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Device, { IDevice } from '../models/device.model';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';
import { CreateDeviceInput } from '../utils/types/IDeviceInfo';

// Get devices based on user role
export const getAllDevices = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let devices;
    
    switch (user.role) {
      case 'super_admin':
        // Super admin can see all devices
        devices = await Device.find();
        break;
      
      case 'admin':
        // Admin can only see allowed devices
        if (!user.allowedDevices?.length) {
          return res.status(403).json({ message: 'No devices assigned to admin' });
        }
        devices = await Device.find({
          deviceId: { $in: user.allowedDevices }
        });
        break;
      
      default:
        return res.status(403).json({ message: 'Insufficient permissions' });
    }

    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error });
  }
};
// Get device by ID with role check
export const getDeviceById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const device = await Device.findOne({ deviceId: req.params.id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check permissions
    if (user.role === 'admin' && !user.allowedDevices?.includes(device.deviceId)) {
      return res.status(403).json({ message: 'Access denied to this device' });
    }

    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device', error });
  }
};

// Add device to admin's allowed devices
export const assignDeviceToAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { adminId, deviceId } = req.body;
    
    // Only super_admin can assign devices
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser?.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admin can assign devices' });
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Add device to admin's allowed devices if not already present
    if (!admin.allowedDevices?.includes(deviceId)) {
      admin.allowedDevices = [...(admin.allowedDevices || []), deviceId];
      await admin.save();
    }

    res.status(200).json({ message: 'Device assigned successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning device', error });
  }
};

// Create new device
export const createDevice = async (req: Request, res: Response) => {
  try {
    const deviceInput: CreateDeviceInput = {
      deviceId: req.body.deviceId,
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
      osVersion: req.body.osVersion,
      manufacturer: req.body.manufacturer,
      lastConnected: req.body.lastConnected || new Date(),
      status: req.body.status || 'inactive',
      childId: req.body.childId,
      batteryLevel: req.body.batteryLevel,
      installedApps: req.body.installedApps || [],
      settings: {
        screenTimeLimit: req.body.settings?.screenTimeLimit || 120,
        geofenceRadius: req.body.settings?.geofenceRadius || 100,
        allowedApps: req.body.settings?.allowedApps || [],
        blockedWebsites: req.body.settings?.blockedWebsites || []
      }
    };

    const device = new Device(deviceInput);
    const savedDevice = await device.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating device', error });
  }
};

// Update device
export const updateDevice = async (req: Request, res: Response) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error });
  }
};

// Delete device
export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error });
  }
}; 
