import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Otp } from "@/model/otp";
import { generateOtp } from "@/utils/otp";
import { sendOtpEmail } from "@/utils/sendMail";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { email } = await request.json();
    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await dbConnect();

    // Delete existing OTP (optional)
    await Otp.deleteOne({ email });

    const newOtp = generateOtp();
    const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minute expiry

    await Otp.create({ email, otp: newOtp, expiresAt });

    await sendOtpEmail(email, newOtp);

    return new NextResponse("OTP resent successfully", { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Failed to resend OTP", { status: 500 });
  }
};
