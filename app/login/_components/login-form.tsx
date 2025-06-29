"use client";
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
import { useRouter, useSearchParams } from "next/navigation";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
// import { useAuthStore } from "@/lib/store/authStore";

interface LoginResponse {
  error?: string;
  data?: any;
}

export function LoginForm() {
  const[error,setError] =useState('')
  // const { setError, error, setUser, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("blocked") === "true") {
      toast.error("Your account is blocked. Please contact admin.");
    }
  }, [searchParams]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
   
    // setError('')
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      console.log("res", result);

      if (result?.error) {
        if (result.error === "AccessDenied") {
          toast.error("Your instructor account is pending admin approval"); // Show custom error
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        router.push("/"); // Redirect on success
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    } 
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">Login</span>
            </span>
          </p>
        </CardTitle>
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
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button
              type="submit"
              className="w-1/2 mx-auto cursor-pointer"
              variant="black"
             
            >
          Login
            </Button>
          </div>
        </form>
        {/* {error && (
        <p className="text-red-500 text-center">
          {error}
        </p>
      )} */}

      
        <div className="text-center mt-2"> Or</div>

        <Button
          onClick={() => {
            
            signIn("google", { callbackUrl: "/select-role" });
          }}
          className="w-full cursor-pointer"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register/instructor" className="underline">
            Instructor
          </Link>
          <span> or </span>
          <Link href="/register/student" className="underline">
            Student
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
