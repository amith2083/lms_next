'use client';

import { useLoggedInUser } from "@/app/hooks/useUser";
import { useEnrollmentsForUser } from "@/app/hooks/useEnrollment";
import SkeletonBox from "../../component/skeleton";
import EnrolledCourseCard from "../../component/enrolled-coursecard";

function EnrolledCourses() {
  const { data: loggedInUser, isLoading: isLoadingUser } = useLoggedInUser();
  const { data: enrollments, isLoading: isLoadingEnrollments } = useEnrollmentsForUser(loggedInUser?.id);

  if (isLoadingUser || isLoadingEnrollments) {
    return (
      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-4 bg-white dark:bg-slate-900 shadow">
            <SkeletonBox className="w-full aspect-video" />
            <SkeletonBox className="h-5 w-3/4" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {enrollments && enrollments.length > 0 ? (
        enrollments.map((enrollment) => (
          <EnrolledCourseCard key={enrollment?.id} enrollment={enrollment} />
        ))
      ) : (
        <p className="text-center font-semibold text-red-500 col-span-2">
          No enrollments found!
        </p>
      )}
    </div>
  );
}

export default EnrolledCourses;
