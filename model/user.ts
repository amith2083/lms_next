import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { required: true, type: String },
  password: { type: String },
  email: { required: true, type: String },
  role: { type: String },
  bio: { type: String },
  phone: { type: Number },
  socialMedia: { type: Object },
  profilePicture: { type: String },
  designation: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });

export const User: any = models.User || model('User', userSchema);
