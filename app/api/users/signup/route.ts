import { NextRequest, NextResponse } from 'next/server';

import { UserService } from '@/service/UserService';
import { UserRepository } from '@/app/respositories/UserRepository';


const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      userRole: formData.get('userRole') as string,
    };
    const verificationDoc = formData.get('verificationDocs') as File | null;
    // const validatedData = signupSchema.parse(body);
    const user = await userService.createUser(
      {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.userRole,
      },
      verificationDoc
    );
    return NextResponse.json({ message: 'User has been created. OTP sent to email for instructors.', user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create user' }, { status: error.message.includes('already registered') ? 409 : 500 });
  }
}