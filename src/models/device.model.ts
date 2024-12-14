import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  osVersion: string;
  manufacturer: string;
  lastConnected: Date;
  status: 'active' | 'inactive';
  childId: String;
  batteryLevel: number;
  installedApps: {
    appName: string;
    packageName: string;
    isRestricted: boolean;
  }[];
  settings: {
    screenTimeLimit: number;
    geofenceRadius: number;
    allowedApps: string[];
    blockedWebsites: string[];
  };
}


const DeviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    required: true
  },
  osVersion: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  lastConnected: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  childId: {
    type: String,
    ref: 'Child'
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  installedApps: [{
    appName: String,
    packageName: String,
    isRestricted: { type: Boolean, default: false }
  }],
  settings: {
    screenTimeLimit: { type: Number, default: 120 }, // in minutes
    geofenceRadius: { type: Number, default: 100 }, // in meters
    allowedApps: [String],
    blockedWebsites: [String]
  }
}, {
  timestamps: true
});

export default mongoose.model<IDevice>('Device', DeviceSchema); 