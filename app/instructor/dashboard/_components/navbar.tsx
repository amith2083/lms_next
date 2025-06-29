"use client";

import { Logo } from "@/components/logo";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {

  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter()

  useEffect(() => {  
      async function fetchMe() {
          try {
              const response = await fetch("/api/me");
              const data = await response.json();
             // console.log(data);
              setLoggedInUser(data);
          } catch (error) {
              console.log(error)
          }
      }
      fetchMe();
  },[]);
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
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {/* <MobileSidebar /> */}
      <div className="flex items-center justify-end  w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={loggedInUser?.profilePicture}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4">
             
            <DropdownMenuItem className="cursor-pointer">
              <Link href="#" onClick={handleLogout} >Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};