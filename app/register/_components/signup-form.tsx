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
import { useState } from "react";

interface SignupFormProps {
  role: string;
}
export const SignupForm= ({ role }: SignupFormProps)=> {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter()
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log('e',e)
  //   console.log(e.currentTarget)
  //   setErrorMessage(null); // clear any old errors
  //   try {
  //     const formData = new FormData(e.currentTarget as HTMLFormElement);
  //     console.log('formdata',formData)
  //     const userData = {
  //       name: formData.get("name"),
  //       email: formData.get("email"),
  //       password: formData.get("password"),
  //       confirmPassword: formData.get("confirmPassword"),
  //       userRole: role === "student" || role === "instructor" ? role : "student",
  //     };
  //     if (userData.password !== userData.confirmPassword) {
  //       setErrorMessage("Passwords do not match.");
  //       return;
  //     }
  
    

  //     const response = await fetch("/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(
  //       userData
  //       ),
  //     });
  //     console.log('res',response)
  //     if (response.status === 409) {
  //       const error = await response.json();
  //       console.error(error.message);
  //       setErrorMessage(error.message);
  //     }
      
      
  //   if (response.status === 201) {
  //     localStorage.setItem("otpEmail", userData.email as string);
  //     router.push("/otp");
  //   } 
  //   // else {
  //   //   // handle error, e.g. email already exists
  //   //   const error = await response.json();
  //   //   console.error(error.message);
    
  //   // }
  //     // response.status===201 && router.push('/otp')
  //   } catch (error) {
  //     console.log('err',error)
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMessage(null);

  const form = e.currentTarget;
  const formData = new FormData(form);

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (password !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
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
      setErrorMessage(error.message);
    }

    if (response.status === 201) {
      localStorage.setItem("otpEmail", formData.get("email") as string);
      router.push("/otp");
    }
  } catch (error) {
    console.log("err", error);
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
            {errorMessage && (
  <p className="text-red-500 text-sm text-center mt-2">
    {errorMessage}
  </p>
)}

            <Button type="submit" className="w-full cursor-pointer" variant='black'>
              Create an account
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
