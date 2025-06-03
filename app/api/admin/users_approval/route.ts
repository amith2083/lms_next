import { NextResponse } from 'next/server';
import { dbConnect } from '@/service/mongo';
import { User } from '@/model/user';

export const PUT = async (req: Request) => {
  const { userId } = await req.json();

  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json({ message: 'User is already verified' }, { status: 400 });
  }

  user.isVerified = true;
  await user.save();

  return NextResponse.json({ message: 'User approved successfully' });
};