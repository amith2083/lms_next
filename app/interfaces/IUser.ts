import { Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  password?: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  doc?: string;
  bio?: string;
  phone?: number;
  website?: Record<string, any>;
  profilePicture?: string;
  designation?: string;
  isGoogleUser: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}