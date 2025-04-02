import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  deviceId: string;
  appPackageName: string;
  appName: string;
  title: string;
  text: string;
  timestamp: Date;
  category?: string;
  priority?: string;
  isRead: boolean;
  isCleared: boolean;
  actions?: string[];
  extras?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  appPackageName: { type: String, required: true },
  appName: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  category: { type: String },
  priority: { type: String },
  isRead: { type: Boolean, default: false },
  isCleared: { type: Boolean, default: false },
  actions: [{ type: String }],
  extras: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient querying
notificationSchema.index({ deviceId: 1, timestamp: -1 });

// Update the updatedAt timestamp before saving
notificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<INotification>('Notification', notificationSchema); 