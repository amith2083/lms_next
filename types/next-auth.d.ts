// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      isVerified?: boolean;
    };
  }

  interface User {
    _id: string;
    role?: string;
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    isVerified?: boolean;
  }
}
