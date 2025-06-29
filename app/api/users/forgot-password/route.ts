import { NextRequest, NextResponse } from 'next/server';

import { UserService } from '@/service/UserService';
import { UserRepository } from '@/app/respositories/UserRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await userService.forgotPassword(email);
    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to send OTP' }, { status: 400 });
  }
}