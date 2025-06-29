'use client';

import { useLoggedInUser } from '@/app/hooks/useUser';
import SkeletonBox from '../component/skeleton';
import PersonalDetails from '../component/personal-details';
import ContactInfo from '../component/contact-info';
import ChangePassword from '../component/change-password';

export default function Profile() {
  const { data: loggedInUser, isLoading: isLoadingUser } = useLoggedInUser();

  if (isLoadingUser) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SkeletonBox className="h-10 w-1/2" />
        <SkeletonBox className="h-6 w-1/3" />
        <div className="grid lg:grid-cols-2 gap-5">
          <SkeletonBox className="h-40 w-full" />
          <SkeletonBox className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b pb-3">
        Profile Settings
      </h2>
      <PersonalDetails userInfo={loggedInUser} />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <ContactInfo userInfo={loggedInUser} />
        <ChangePassword userId={loggedInUser?.id} />
      </div>
    </div>
  );
}
