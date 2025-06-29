import { User } from '@/model/user';
import { Otp } from '@/model/otp';

import { DocumentWithId, replaceMongoIdInArray, replaceMongoIdInObject } from '@/lib/convertData';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../interfaces/IUser';
import path from 'path';
import fs from 'fs'

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<DocumentWithId[]> {
    const users = await User.find({ role: { $ne: 'admin' } }).lean();
    return replaceMongoIdInArray(users);
  }

  async getUserById(userId: string): Promise<DocumentWithId | null> {
    const user = await User.findById(userId).lean();
    return user ? replaceMongoIdInObject(user) : null;
  }

  async getUserByEmail(email: string): Promise<DocumentWithId | null> {
    const user = await User.findOne({ email }).lean();
    return user ? replaceMongoIdInObject(user) : null;
  }

//   async createUser(data: Partial<IUser>): Promise<DocumentWithId> {
//     const user = await User.create(data);
//     return replaceMongoIdInObject(user.toObject());
//   }
  async createUser(data: Partial<IUser>, verificationDoc?: { buffer: Buffer; fileName: string }): Promise<DocumentWithId> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 5);
    }
    if (verificationDoc) {
      const filePath = path.join('public/uploads/verifications', verificationDoc.fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, verificationDoc.buffer);
      data.doc = verificationDoc.fileName;
    }
    const user = await User.create(data);
    return replaceMongoIdInObject(user.toObject());
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<DocumentWithId | null> {

      // If password update is requested
  if (data.oldPassword) {
      const user = await User.findById(userId);
  if (!user) throw new Error('User not found')
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) throw new Error('Old password is incorrect');

    user.password = await bcrypt.hash(data.newPassword, 10);
   return  await user.save();
  }else{
   const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true }).lean();
    return updatedUser ? replaceMongoIdInObject(updatedUser) : null;
  }

  
  
}
 
  

  async deleteUser(userId: string): Promise<void> {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw new Error('User not found');
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    const otpDocument = await Otp.findOne({ email });
    console.log(typeof otp ,typeof otpDocument.otp)
    if (!otpDocument) throw new Error('OTP not found');
    if (otpDocument.otp !== otp) throw new Error('Invalid OTP');
    if (Date.now() > otpDocument.expiresAt) throw new Error('OTP has expired');
    await Otp.deleteOne({ email });
    const user = await User.findOne({ email });
    if (user) {
    //   user.isVerified = true;
      await user.save();
    }
    return true;
  }

  

  async resetPassword(email: string, otp: number, newPassword: string): Promise<void> {
    const otpDocument = await Otp.findOne({ email });
    if (!otpDocument) throw new Error('OTP not found');
    if (otpDocument.otp !== otp) throw new Error('Invalid OTP');
    if (Date.now() > otpDocument.expiresAt) throw new Error('OTP has expired');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Otp.deleteOne({ email });
  }
}