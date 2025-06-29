import { NextRequest, NextResponse } from 'next/server';

import { UserService } from '@/service/UserService';
import { UserRepository } from '@/app/respositories/UserRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();
    await userService.resetPassword(email, otp, password);
    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to reset password' }, { status: 400 });
  }
}