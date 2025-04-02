import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
  deviceId: string;
  callId: string;
  caller: string;
  receiver: string;
  timestamp: Date;
  duration: number; // in seconds
  type: 'incoming' | 'outgoing' | 'missed' | 'rejected';
  status: 'completed' | 'missed' | 'rejected' | 'blocked';
  isBlocked: boolean;
  metadata: {
    contactName?: string;
    isSpam?: boolean;
    category?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    recordingUrl?: string;
  };
}

const CallSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  callId: {
    type: String,
    required: true,
    unique: true
  },
  caller: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing', 'missed', 'rejected'],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'rejected', 'blocked'],
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  metadata: {
    contactName: String,
    isSpam: Boolean,
    category: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    recordingUrl: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
CallSchema.index({ deviceId: 1, timestamp: -1 });
CallSchema.index({ caller: 1 });
CallSchema.index({ receiver: 1 });
CallSchema.index({ type: 1 });
CallSchema.index({ status: 1 });

export default mongoose.model<ICall>('Call', CallSchema); 