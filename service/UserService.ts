import { DocumentWithId } from "@/lib/convertData";
import { auth } from "@/auth";
import { sendOtpEmail } from "@/utils/sendMail";
import bcrypt from "bcryptjs";
import { IUserService } from "@/app/interfaces/IUserService";
import { IUserRepository } from "@/app/interfaces/IUserRepository";
import { IUser } from "@/app/interfaces/IUser";
import { generateOtpForEmail } from "@/lib/generateOtp";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUsers(): Promise<DocumentWithId[]> {
    return this.userRepository.getUsers();
  }

  async getUserById(userId: string): Promise<DocumentWithId | null> {
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<DocumentWithId | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async getLoggedInUser(): Promise<DocumentWithId | null> {
    const session = await auth();
    console.log('session',session)
    if (!session?.user?.email) return null;
    return this.userRepository.getUserByEmail(session.user.email);
  }
 async createUser(data: Partial<IUser>, verificationDoc?: File): Promise<DocumentWithId> {
    const existing = await this.userRepository.getUserByEmail(data.email!);
    if (existing) throw new Error('This email is already registered. Please login or use a different email.');
    const userData: Partial<IUser> = {
      ...data,
      isVerified: data.role === 'instructor' ? false : true,
    };
    let docData: { buffer: Buffer; fileName: string } | undefined;
    if (verificationDoc && data.role === 'instructor') {
      const buffer = Buffer.from(await verificationDoc.arrayBuffer());
      docData = { buffer, fileName: verificationDoc.name };
    }
    const user = await this.userRepository.createUser(userData, docData);
    
    //   const otp = await this.userRepository.generateOtpForEmail(data.email!, 'verification');
    const otp = await generateOtpForEmail(data.email!)
      await sendOtpEmail(data.email!, otp);
    
    return user;
  }

//   async createUser(data: Partial<IUser>): Promise<DocumentWithId> {
//     const existing = await this.userRepository.getUserByEmail(data.email!);
//     if (existing) throw new Error("User with this email already exists");
//     if (data.password && !data.isGoogleUser) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }
//     return this.userRepository.createUser(data);
//   }

  async updateUser(
    userId: string,
    data: Partial<IUser>
  ): Promise<DocumentWithId | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userRepository.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    return this.userRepository.verifyOtp(email, otp);
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("User not found");
    // const otp = await this.userRepository.generateOtpForEmail(
    //   email,
    //   "verification"
    // );
    const otp = await generateOtpForEmail(email)
    await sendOtpEmail(email, otp);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("User not found");
    // const otp = await this.userRepository.generateOtpForEmail(
    //   email,
    //   "password-reset"
    // );
    const otp = await generateOtpForEmail(email)
    await sendOtpEmail(email, otp);
  }

  async resetPassword(
    email: string,
    otp: number,
    newPassword: string
  ): Promise<void> {
    return this.userRepository.resetPassword(email, otp, newPassword);
  }
}
