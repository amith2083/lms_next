// lib/validations/signupSchema.ts
import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/\d/, "Must include a number")
    .regex(/[@$!%*?&]/, "Must include a special character"),

  confirmPassword: z.string().min(1, "Please confirm your password"),

  userRole: z.enum(["student", "instructor"]),

  verificationDocs: z
    .any()
    .optional() // You’ll validate file manually in backend if needed
});

// Ensure password & confirmPassword match
export const refinedSignupSchema = signupSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);
