"use client";

import React from "react";
import { useLoggedInUser } from "@/app/hooks/useUser";
import SkeletonBox from "./skeleton";
import Image from "next/image";
import Menu from "./account-menu";

const AccountSidebar = () => {
  const { data: loggedInUser, isLoading: isLoadingUser } = useLoggedInUser();

  return (
    <div className="lg:w-1/4 w-full md:px-3">
      <div className="rounded-xl shadow-md bg-gradient-to-br from-white via-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-6">
        {isLoadingUser ? (
          <div className="space-y-4 text-center">
            <SkeletonBox className="h-28 w-28 mx-auto rounded-full" />
            <SkeletonBox className="h-5 w-1/2 mx-auto" />
            <SkeletonBox className="h-4 w-1/3 mx-auto" />
            <SkeletonBox className="h-10 w-full mt-4" />
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="relative w-28 h-28 mx-auto">
                <Image
                  src={loggedInUser?.profilePicture || "/default-avatar.png"}
                  alt={loggedInUser?.name}
                  width={112}
                  height={112}
                  className="rounded-full border-4 border-white shadow-md dark:border-slate-800"
                />
              </div>
              <div className="mt-4">
                <h5 className="text-xl font-bold text-gray-800 dark:text-white">
                  {loggedInUser?.name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loggedInUser?.email}
                </p>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  Role: {loggedInUser?.role}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Menu />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSidebar;
