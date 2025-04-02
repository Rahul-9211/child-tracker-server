import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  deviceId: string;
  packageName: string;
  appName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  isActive: boolean;
  lastUsed: Date;
  usageCount: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  packageName: { type: String, required: true },
  appName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date, required: true },
  usageCount: { type: Number, default: 1 },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IApplication>('Application', applicationSchema); 