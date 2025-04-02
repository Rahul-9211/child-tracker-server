import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  altitude?: number; // in meters
  speed?: number; // in meters per second
  heading?: number; // in degrees (0-360)
  timestamp: Date;
  address?: string;
  isMoving: boolean;
  batteryLevel?: number;
  networkType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  altitude: { type: Number },
  speed: { type: Number },
  heading: { type: Number },
  timestamp: { type: Date, required: true },
  address: { type: String },
  isMoving: { type: Boolean, default: false },
  batteryLevel: { type: Number },
  networkType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient querying
locationSchema.index({ deviceId: 1, timestamp: -1 });

// Update the updatedAt timestamp before saving
locationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ILocation>('Location', locationSchema); 