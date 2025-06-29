'use client'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { X } from "lucide-react";
import { Menu } from "lucide-react";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar,AvatarFallback,AvatarImage } from "./ui/avatar";
import blank from '@/public/assets/Blank-profile.png'
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const navLinks = [
  // {
  //   title: "Features",
  //   href: "/features",
  // },
  {
    title: "Courses",
    href: "/courses",
  },
  {
    title: "About",
    href: "/about",
  },
];

const Navbar = () => {
  const{data:session,status}= useSession();
  const router = useRouter();
  const[loginSession,setLoginSession]= useState<Session | null>(null);
  useEffect(()=>{
    setLoginSession(session)
  },[session])
 
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut({ redirect: false }); // Prevent default redirect
      router.push("/login"); // Manual redirect
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div className="flex items-center gap-6">
        <Link href="/">
          <Logo />
        </Link>
        {navLinks?.length ? (
          <nav className="lg:flex gap-6 hidden">
            {navLinks?.map((items, index) => (
              <Link
                className={cn(
                  "flex items-center font-medium text-md transition-colors hover:text-foreground-80 sm-text-sm"
                )}
                key={index}
                href={items?.href}
              >
                {items?.title}{" "}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
     
        
        
      <nav className="flex items-center gap-3">
  {status === "loading" ? (
    // Show nothing or a skeleton while checking session
    <div className="h-9 w-24 bg-gray-300 rounded-md animate-pulse hidden lg:block" />
  ) : status === "unauthenticated" ? (
    // Show Login + Register only when clearly not logged in
    <div className="lg:flex items-center gap-3 hidden">
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "black", size: "sm" }), "px-4")}
      >
        Login
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Register
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-5" align="end">
          <DropdownMenuItem asChild>
            <Link href="/register/student">Student</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/register/instructor">Instructor</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    // Authenticated: show avatar and dropdown
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar>
            <AvatarImage
              src="https://sharethelife.org/wp-content/uploads/2021/01/Blank-profile-circle.png"
              alt="User"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-5">
        <DropdownMenuItem asChild>
          <Link href="/account">Profile</Link>
        </DropdownMenuItem>
        {session?.user?.role === "instructor" && (
          <DropdownMenuItem asChild>
            <Link href="/instructor/dashboard">
              <strong>Instructor Dashboard</strong>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account/enrolled-courses">My Courses</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#">Testimonials & Certificates</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="" onClick={handleLogout}>
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )}
</nav>

    </>
  );
};

export default Navbar;
