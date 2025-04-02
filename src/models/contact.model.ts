import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  deviceId: string;
  name: string;
  phoneNumbers: string[];
  emailAddresses?: string[];
  contactId: string; // Android contact ID
  lastUpdated: Date;
  isDeleted: boolean;
  isFavorite: boolean;
  hasPhoto: boolean;
  photoUri?: string;
  notes?: string;
  groups?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phoneNumbers: [{ type: String, required: true }],
  emailAddresses: [{ type: String }],
  contactId: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  hasPhoto: { type: Boolean, default: false },
  photoUri: { type: String },
  notes: { type: String },
  groups: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for efficient querying
contactSchema.index({ deviceId: 1, contactId: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IContact>('Contact', contactSchema); 