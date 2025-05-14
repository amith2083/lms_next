import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'
import { dbConnect } from '@/service/mongo'
import { User } from '@/model/user'

export const  POST =async (req: Request)=> {
  const { email, otp, password } = await req.json()
  await dbConnect()

  const user = await User.findOne({ email })
 

  if (!user || user.resetOtp !== Number(otp) || Date.now() > user.resetOtpExpiry) {
    return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 })
  }

  user.password = await bcrypt.hash(password, 10)
  user.resetOtp = null
  user.resetOtpExpiry = null
  await user.save()

  return NextResponse.json({ message: 'Password reset successful' })
}
