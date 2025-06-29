import mongoose, { Schema, model, models } from 'mongoose';
import { IUser } from '@/app/interfaces/IUser';

const userSchema = new Schema({
  name: { required: true, type: String },
  password: { type: String },
  email: { required: true, type: String },
  role: { type: String,
     enum: ['admin', 'instructor', 'student'],
   },
    doc: { type: String },
  bio: { type: String },
  phone: { type: Number },
  website: { type: String },
  profilePicture: { type: String },
  designation: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  resetOtp:{
    type:Number,
 
  },
  resetOtpExpiry:{
    type:Date,
   
  }
}, { timestamps: true });

// export const User: any = models.User || model('User',userSchema);
// export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const User = mongoose.models.User || model<IUser>('User', userSchema);
