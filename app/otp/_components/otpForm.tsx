'use client'

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import CredentialLogin from "@/app/actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/lib/store/authStore';


export const OtpForm=()=> {
  const { otpEmail, setError, error, setLoading, isLoading,setOtpEmail } = useAuthStore();
  // const[error,setError] =useState('')

  const [otp, setOtp] = useState("");
  // const [email, setEmail] = useState("");
  const [isOtpExpired, setIsOtpExpired] = useState(false); // State to track OTP expiration

  const router = useRouter()

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("otpEmail");
   
  //   if (storedEmail) {
  //     setEmail(storedEmail);
  //   }
  // }, []);
  // if (!otpEmail) {
  //   router.push('/register/student'); // Adjust based on role if needed
  //   return null;
  // }
  const handleVerify = async () => {
    setError('')
    setIsOtpExpired(false);
     // Reset expired state before new attempt
setLoading(true);
try {

  const response = await fetch("/api/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ email, otp }),
      body: JSON.stringify({ email: otpEmail, otp })
    });

    if (response.status === 200) {
      
      router.push("/login");
    } else {
      const error = await response.text();
      
      setError(error||'otp verfication failed')
      setIsOtpExpired(error.toLowerCase().includes('expired'));
}
} catch (error) {
  console.error('Error:', error);
      setError('An unexpected error occurred');
}finally {
      setLoading(false);
    }
    
  };
 

  

  //Resend otp------------------------------------------------------------------------------------------------------------------------------------------
  const handleResendOtp = async () => {
    setError('');
    setIsOtpExpired(false);
    try {
      
       const response = await fetch("/api/resendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email:otpEmail }),
    });
  
    if (response.status === 200) {
      setError("OTP resent successfully. Please check your email.");
    } else {
      const msg = await response.text();
      setError(msg || "Failed to resend OTP.");
    }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
      
    }finally {
      setLoading(false);
    }
  
   
  };
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
        <p className="mt-5 text-3xl text-center font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative">Otp verification</span>
              </span>
            </p></CardTitle>
        <CardDescription className="text-center">
          Enter your Otp
        </CardDescription>
      </CardHeader>
      <CardContent>
       
        <div className="grid gap-4">
          <div className="grid gap-2">
            
            <Input
              id="otp"
             
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
        
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {isOtpExpired && (
            <Button
              
              className="w-full mt-4 bg-red-500" onClick={ handleResendOtp}
            >
              Resend OTP
            </Button>
          )}
          <Button  onClick={handleVerify} type="submit" className="w-full " variant='black' disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Submit'}
          </Button>
        </div>
        
       
      </CardContent>
    </Card>
  );
}
