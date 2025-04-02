import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessActivity extends Document {
  deviceId: string;
  processName: string;
  packageName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  cpuUsage?: number; // percentage
  memoryUsage?: number; // in MB
  isActive: boolean;
  priority?: string;
  userId?: number;
  processId?: number;
  parentProcessId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const processActivitySchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  processName: { type: String, required: true },
  packageName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  cpuUsage: { type: Number },
  memoryUsage: { type: Number },
  isActive: { type: Boolean, default: true },
  priority: { type: String },
  userId: { type: Number },
  processId: { type: Number },
  parentProcessId: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient querying
processActivitySchema.index({ deviceId: 1, startTime: -1 });

// Update the updatedAt timestamp before saving
processActivitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProcessActivity>('ProcessActivity', processActivitySchema); 