
import { DocumentWithId } from '@/lib/convertData';
import { IUser } from './IUser';

export interface IUserRepository {
  getUsers(): Promise<DocumentWithId[]>;
  getUserById(userId: string): Promise<DocumentWithId | null>;
  getUserByEmail(email: string): Promise<DocumentWithId | null>;
//   createUser(data: Partial<IUser>): Promise<DocumentWithId>;
 createUser(data: Partial<IUser>, verificationDoc?: { buffer: Buffer; fileName: string }): Promise<DocumentWithId>;
  updateUser(userId: string, data: Partial<IUser>): Promise<DocumentWithId | null>;
  deleteUser(userId: string): Promise<void>;
  verifyOtp(email: string, otp: number): Promise<boolean>;
//   generateOtpForEmail(email: string, purpose: 'verification' | 'password-reset'): Promise<number>;
  resetPassword(email: string, otp: number, newPassword: string): Promise<void>;
}