import mongoose, { Document, Schema } from 'mongoose';

export interface ISMS extends Document {
  deviceId: string;
  messageId: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'failed' | 'read';
  isBlocked: boolean;
  metadata: {
    contactName?: string;
    isSpam?: boolean;
    category?: string;
  };
}

const SMSSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'read'],
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  metadata: {
    contactName: String,
    isSpam: Boolean,
    category: String
  }
}, {
  timestamps: true
});

// Index for faster queries
SMSSchema.index({ deviceId: 1, timestamp: -1 });
SMSSchema.index({ sender: 1 });
SMSSchema.index({ receiver: 1 });

export default mongoose.model<ISMS>('SMS', SMSSchema); 