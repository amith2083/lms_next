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
import CredentialLogin from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

interface LoginResponse {
  error?: string;
  data?: any;
}


export function LoginForm() {
  const[error,setError] =useState('')
  const router = useRouter()
  const handleSubmit =async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
       const response = await CredentialLogin(formData) as LoginResponse
       if(!!response.error){
        console.log(response.error)
        setError(response.error)
       }else{
        router.push('/')
       }

    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
        <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative">Login</span>
              </span>
            </p></CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button type="submit" className="w-1/2 mx-auto cursor-pointer" variant='black'>
            Login
          </Button>
        </div>
        </form>
        <div className="text-center mt-2" > Or</div>
       
        <Button onClick={() => {console.log("Google Signin Clicked"); signIn('google', { callbackUrl: '/select-role' })}} className="w-full cursor-pointer">
        <FcGoogle className="h-5 w-5" />
  Continue with Google
</Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register/student" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
