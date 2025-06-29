import { NextRequest, NextResponse } from 'next/server';

import { UserService } from '@/service/UserService';
import { UserRepository } from '@/app/respositories/UserRepository';
import { dbConnect } from '@/service/mongo';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const user = await userService.getLoggedInUser();
    console.log('user',user)
    if (!user) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch user' }, { status: 500 });
  }
}