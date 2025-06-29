import { NextRequest, NextResponse } from 'next/server';

import { UserService } from '@/service/UserService';
import { UserRepository } from '@/app/respositories/UserRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    console.log('email & otp', email,otp)
    const isVerified = await userService.verifyOtp(email, otp);
    return NextResponse.json({ message: 'OTP verified successfully', isVerified }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to verify OTP' }, { status: 400 });
  }
}