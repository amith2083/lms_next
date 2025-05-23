import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/model/user";
import { generateOtp } from "@/utils/otp";
import { Otp } from "@/model/otp";
import { sendOtpEmail } from "@/utils/sendMail";


interface SignupRequestBody {
    name: string;
  
    email: string;
    password: string;
    userRole: string;
  }


  export const POST = async (request: NextRequest): Promise<NextResponse> => {
    const body: SignupRequestBody = await request.json();
    console.log(body)
    const { name, email, password, userRole } = body;
    console.log(name,email,password,userRole)
  
    await dbConnect();
  
  
    try {
        const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered. Please login or use a different email." },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 5);
  
    const newUser:any = {
      name,
      email,
      password: hashedPassword,
      role: userRole,
    };
    if (userRole === 'instructor') {
      newUser.isVerified = false;
    }
  
      const createdUser = await User.create(newUser);
  
      // Generate OTP
      const otp = generateOtp();
      console.log('otp',otp)
      const otpExpiresAt = Date.now() + 2 * 60 * 1000;  // OTP expires in 2 minutes
  
      // Save OTP in MongoDB
      await Otp.create({ email, otp, expiresAt: otpExpiresAt });
  
      // Send OTP email
      await sendOtpEmail(email, otp);
  
      return  NextResponse.json({message:"User has been created. OTP sent to email."}, {
        status: 201,
      });
    } catch (error: any) {
      console.log(error);
      return new NextResponse(error.message, {
        status: 500,
      });
    }
  };

