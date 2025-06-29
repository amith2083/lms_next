import { DocumentWithId } from '@/lib/convertData';
import { IUser } from './IUser';

export interface IUserService {
  getUsers(): Promise<DocumentWithId[]>;
  getUserById(userId: string): Promise<DocumentWithId | null>;
  getUserByEmail(email: string): Promise<DocumentWithId | null>;
  getLoggedInUser(): Promise<DocumentWithId | null>;
  // createUser(data: Partial<IUser>): Promise<DocumentWithId>;
  createUser(data: Partial<IUser>, verificationDoc?: File): Promise<DocumentWithId>;
  updateUser(userId: string, data: Partial<IUser>): Promise<DocumentWithId | null>;
  deleteUser(userId: string): Promise<void>;
  verifyOtp(email: string, otp: number): Promise<boolean>;
  resendOtp(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(email: string, otp: number, newPassword: string): Promise<void>;
}