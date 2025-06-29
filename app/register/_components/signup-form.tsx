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
import { toast } from "sonner";
import { refinedSignupSchema } from "../validations/signupValidation";
import { sub } from "date-fns";
// import { useAuthStore } from '@/lib/store/authStore';

interface SignupFormProps {
  role: string;
}
export const SignupForm= ({ role }: SignupFormProps)=> {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [passwordScore, setPasswordScore] = useState(0);
  const [password, setPassword] = useState("");



  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const { setError, setOtpEmail, error, isLoading, setLoading } = useAuthStore();

  const router = useRouter()

 const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score; // score is 0–5
};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

   
  // setErrorMessage(null);

  const form = e.currentTarget;
  const formData = new FormData(form);
 // Build a plain object from FormData
  const formValues = {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    confirmPassword: formData.get("confirmPassword")?.toString() || "",
    userRole: role === "student" || role === "instructor" ? role : "student",
    verificationDocs: formData.get("verificationDocs") || undefined,
  };

  // Validate using Zod
  const result = refinedSignupSchema.safeParse(formValues);

  // if (!result.success) {
  //   // Display validation errors
  //   result.error.errors.forEach((err) => {
  //     toast.error(`${err.path[0]}: ${err.message}`);
  //   });
  //   return;
  // }
  if (!result.success) {
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    errors[field] = err.message;
  });
  setFormErrors(errors);
  return;
}
setFormErrors({});

  // If validation passes, continue to submit
  const validData = result.data;
  // const password = formData.get("password")?.toString();
  // const confirmPassword = formData.get("confirmPassword")?.toString();

  // if (password !== confirmPassword) {
  //   // setErrorMessage("Passwords do not match.");
  //   toast.error('Passwords do not match.');
      
  //   return;
  // }

  // formData.set("userRole", role === "student" || role === "instructor" ? role : "student");
  // Prepare FormData again for sending to backend (if files involved)
  const submitFormData = new FormData();
  Object.entries(validData).forEach(([key, value]) => {
    if (value !== undefined) {
      submitFormData.append(key, value);
    }
  });

  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      body: submitFormData, // use FormData, not JSON
    });

     const data = await response.json();
       if (!response.ok) {
    toast.error(data.message || "Something went wrong.");
    return;
  }

   

    if (response.status === 201) {
      localStorage.setItem("otpEmail", formData.get("email") as string);
      const email = formData.get('email') as string;
        // setOtpEmail(email); // Set otpEmail in Zustand store
      router.push("/otp");
    }
  } catch (error) {
    console.log("err", error);
    toast.error('An unexpected error occurred');
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
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
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
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required    onChange={(e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordScore(checkPasswordStrength(val));}}/>
   {password.length > 0 && (
  <>
    <div className="h-2 w-full rounded-full bg-gray-200 mt-1">
      <div
        className={`h-full rounded-full transition-all duration-300 ${
          passwordScore <= 2
            ? "bg-red-500 w-1/3"
            : passwordScore <= 4
            ? "bg-yellow-500 w-2/3"
            : "bg-green-500 w-full"
        }`}
      ></div>
    </div>
    <p
      className={`text-xs mt-1 ${
        passwordScore <= 2
          ? "text-red-500"
          : passwordScore <= 4
          ? "text-yellow-600"
          : "text-green-600"
      }`}
    >
      {passwordScore <= 2
        ? "Weak"
        : passwordScore <= 4
        ? "Medium"
        : "Strong"}
    </p>
  </>
)}


              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword" required
              />
              {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
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
    {formErrors.verificationDocs && <p className="text-red-500 text-sm">{formErrors.verificationDocs}</p>}
  </div>
)}
            {/* {errorMessage && (
  <p className="text-red-500 text-sm text-center mt-2">
    {errorMessage}
  </p>
)} */}

            <Button type="submit" className="w-full cursor-pointer" variant='black' >
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
