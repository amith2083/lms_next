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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from '@/lib/store/authStore';

interface SignupFormProps {
  role: string;
}
export const SignupForm= ({ role }: SignupFormProps)=> {
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setError, setOtpEmail, error, isLoading, setLoading } = useAuthStore();
useEffect(() => {
  console.log("Error state:", error);

  console.log("Loading state:", isLoading);
}, [error, isLoading]);
  const router = useRouter()

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);
    setLoading(true);
  // setErrorMessage(null);

  const form = e.currentTarget;
  const formData = new FormData(form);

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (password !== confirmPassword) {
    // setErrorMessage("Passwords do not match.");
    setError('Passwords do not match.');
      setLoading(false);
    return;
  }

  formData.set("userRole", role === "student" || role === "instructor" ? role : "student");

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData, // use FormData, not JSON
    });

    if (response.status === 409) {
      const error = await response.json();
      // setErrorMessage(error.message);
      setError(error.message)
    }

    if (response.status === 201) {
      // localStorage.setItem("otpEmail", formData.get("email") as string);
      const email = formData.get('email') as string;
        setOtpEmail(email); // Set otpEmail in Zustand store
      router.push("/otp");
    }else {
  const error = await response.json();
  console.error("Unexpected response:", error);
  // setErrorMessage(error.message || "Registration failed");
  setError(error.message || 'Registration failed');
}
  } catch (error) {
    console.log("err", error);
    setError('An unexpected error occurred');
  }finally {
      setLoading(false);
    }
};

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">Sign Up as {role}</span>
            </span>
          </p>
        </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid gap-4">
            <div className="grid ">
              <div className="grid gap-2">
                <Label htmlFor="first-name"> Name</Label>
                <Input id="first-name" name="name" placeholder="Max" required />
              </div>
              {/* <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required />
            </div> */}
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword" required
              />
            </div>
            {role === "instructor" && (
  <div className="grid gap-2">
    <Label htmlFor="verificationDocs">Verification Documents</Label>
    <Input
      id="verificationDocs"
      name="verificationDocs"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      required
    />
  </div>
)}
            {error && (
  <p className="text-red-500 text-sm text-center mt-2">
    {error}
  </p>
)}

            <Button type="submit" className="w-full cursor-pointer" variant='black'disabled ={isLoading} >
             {isLoading ? 'Creating account...' : 'Create an account'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
