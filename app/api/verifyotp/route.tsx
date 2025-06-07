import { Otp } from "@/model/otp";
import { User } from "@/model/user";
import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { email, otp } = await request.json();
  console.log('verifyotp',email,otp)

  await dbConnect();

  try {
    // Find the OTP document associated with the user's email
    const otpDocument = await Otp.findOne({ email });
    console.log('otpdocument',otpDocument)

    if (!otpDocument) {
      return new NextResponse("OTP not found", { status: 404 });
    }

    // Check if OTP matches and is still valid
    if (otpDocument.otp !== Number(otp)) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }

    if (Date.now() > otpDocument.expiresAt) {
        // await Otp.deleteOne({ email });
      return new NextResponse("OTP has expired", { status: 400 });
    }

    // OTP is valid, proceed with user verification or activation logic
    // For example, you can mark the user as verified here
    const user = await User.findOne({ email });
    if (user) {
    //   user.isVerified = true;
      await user.save();
    }

    // Remove OTP after successful verification
    await Otp.deleteOne({ email });

    return new NextResponse("OTP verified successfully", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Error during OTP verification", { status: 500 });
  }
};
