import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'user';
  allowedDevices?: string[]; // Array of device IDs for admin
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'user'],
    default: 'user'
  },
  allowedDevices: [{
    type: String, // Store device IDs that admin can access
    ref: 'Device'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 