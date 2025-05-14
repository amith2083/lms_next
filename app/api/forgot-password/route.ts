import { User } from '@/model/user'
import { dbConnect } from '@/service/mongo'
import { generateOtp } from '@/utils/otp'
import { sendOtpEmail } from '@/utils/sendMail'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  await dbConnect()
  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const otp = generateOtp()
  console.log('otp',otp)
  console.log(typeof otp)
  user.resetOtp = otp
  user.resetOtpExpiry = Date.now() + 2 * 60 * 1000 // 2 mins
  await user.save()

  await sendOtpEmail(email, otp)

  return NextResponse.json({ message: 'OTP sent successfully' })
}
