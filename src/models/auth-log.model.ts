import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'SIGNUP' | 'SIGNIN';
  deviceInfo: {
    ip: string;
    userAgent: string;
    deviceType?: string;
  };
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
  timestamp: Date;
}

const AuthLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['SIGNUP', 'SIGNIN'],
    required: true
  },
  deviceInfo: {
    ip: String,
    userAgent: String,
    deviceType: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  failureReason: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IAuthLog>('AuthLog', AuthLogSchema); 