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
import { toast } from "sonner";

export const OtpForm=()=> {
  const[error,setError] =useState('')
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpExpired, setIsOtpExpired] = useState(false); // State to track OTP expiration
    const [timer, setTimer] = useState(60);

  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
   
    if (storedEmail) {
      setEmail(storedEmail);
    }
     const expiryTime = localStorage.getItem("otpExpiryTime");
    if (expiryTime) {
      const remaining = Math.floor((+expiryTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setIsOtpExpired(false);
      } else {
        setTimer(0);
        setIsOtpExpired(true);
      }
    }
  }, []);

   useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsOtpExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

   const startOtpTimer = (durationSeconds: number) => {
    const expiry = Date.now() + durationSeconds * 1000;
    localStorage.setItem("otpExpiryTime", expiry.toString());
    setTimer(durationSeconds);
    setIsOtpExpired(false);
  };
  const handleVerify = async () => {
    setError('')
    setIsOtpExpired(false); // Reset expired state before new attempt

    const response = await fetch("/api/users/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp:Number(otp) }),
    });
console.log('otpres',response)
    if (response.status === 200) {
       localStorage.removeItem("otpExpiryTime");
   
       toast.success("Account created successfully!")
          router.push("/login");
    } else {
      const res = await response.json();
      console.log('res,',res)
      
      setError(res.message||'otp verfication failed')
      // setIsOtpExpired(error.toLowerCase().includes('expired'));
  };
  //  // Check if the error message contains 'OTP has expired'
   if (error.toLowerCase().includes('expired')) {
    setIsOtpExpired(true); // Set the flag if OTP has expired
     setTimer(0); // Force timer to 0
      localStorage.removeItem("otpExpiryTime");
  }

  
}
  //Resend otp------------------------------------------------------------------------------------------------------------------------------------------
  const handleResendOtp = async () => {
    setError('');
    setIsOtpExpired(false);
       setTimer(60); // Restart the time
  
    const response = await fetch("/api/users/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    if (response.status === 200) {
      // setError("OTP resent successfully. Please check your email.");
       toast.success("OTP resent successfully. Please check your email.");
    } else {
      const res = await response.json();
      setError(res.message || "Failed to resend OTP.");
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
              id="email"
              type="number"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
        
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!isOtpExpired ? (
            <p className="text-sm text-gray-600 text-center">
              Resend OTP in {timer} second{timer !== 1 && 's'}
            </p>
          ) : (
            <Button className="w-full mt-4 bg-red-500" onClick={handleResendOtp}>
              Resend OTP
            </Button>
          )}
          <Button  onClick={handleVerify} type="submit" className="w-full " variant='black'>
            submit
          </Button>
        </div>
        
       
      </CardContent>
    </Card>
  );
}









// 'use client'

// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// // import CredentialLogin from "@/app/actions";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from '@/lib/store/authStore';


// export const OtpForm=()=> {
//   const { otpEmail, setError, error, setLoading, isLoading,setOtpEmail } = useAuthStore();
//   // const[error,setError] =useState('')

//   const [otp, setOtp] = useState("");
//   // const [email, setEmail] = useState("");
//   const [isOtpExpired, setIsOtpExpired] = useState(false); // State to track OTP expiration

//   const router = useRouter()

//   // useEffect(() => {
//   //   const storedEmail = localStorage.getItem("otpEmail");
   
//   //   if (storedEmail) {
//   //     setEmail(storedEmail);
//   //   }
//   // }, []);
//   // if (!otpEmail) {
//   //   router.push('/register/student'); // Adjust based on role if needed
//   //   return null;
//   // }
//   const handleVerify = async () => {
//     setError('')
//     setIsOtpExpired(false);
//      // Reset expired state before new attempt
// setLoading(true);
// try {

//   const response = await fetch("/api/users/verify-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       // body: JSON.stringify({ email, otp }),
//       body: JSON.stringify({ email: otpEmail, otp })
//     });

//     if (response.status === 200) {
      
//       router.push("/login");
//     } else {
//       const error = await response.text();
      
//       setError(error||'otp verfication failed')
//       setIsOtpExpired(error.toLowerCase().includes('expired'));
// }
// } catch (error) {
//   console.error('Error:', error);
//       setError('An unexpected error occurred');
// }finally {
//       setLoading(false);
//     }
    
//   };
 

  

//   //Resend otp------------------------------------------------------------------------------------------------------------------------------------------
//   const handleResendOtp = async () => {
//     setError('');
//     setIsOtpExpired(false);
//     try {
      
//        const response = await fetch("/api/resendotp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email:otpEmail }),
//     });
  
//     if (response.status === 200) {
//       setError("OTP resent successfully. Please check your email.");
//     } else {
//       const msg = await response.text();
//       setError(msg || "Failed to resend OTP.");
//     }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('An unexpected error occurred');
      
//     }finally {
//       setLoading(false);
//     }
  
   
//   };
//   return (
//     <Card className="mx-auto max-w-sm w-full">
//       <CardHeader>
//         <CardTitle className="text-2xl">
//         <p className="mt-5 text-3xl text-center font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
//               <span className="relative inline-flex sm:inline">
//                 <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
//                 <span className="relative">Otp verification</span>
//               </span>
//             </p></CardTitle>
//         <CardDescription className="text-center">
//           Enter your Otp
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
       
//         <div className="grid gap-4">
//           <div className="grid gap-2">
            
//             <Input
//               id="otp"
             
//               name="otp"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
        
//               required
//             />
//           </div>
//           {error && <p className="text-sm text-red-500">{error}</p>}
//           {isOtpExpired && (
//             <Button
              
//               className="w-full mt-4 bg-red-500" onClick={ handleResendOtp}
//             >
//               Resend OTP
//             </Button>
//           )}
//           <Button  onClick={handleVerify} type="submit" className="w-full " variant='black' disabled={isLoading}>
//           {isLoading ? 'Verifying...' : 'Submit'}
//           </Button>
//         </div>
        
       
//       </CardContent>
//     </Card>
//   );
// }
