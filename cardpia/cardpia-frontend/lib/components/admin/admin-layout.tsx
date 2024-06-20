import React from "react";
import { AdminFooter } from "./admin-footer";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@cardpia-app/store/hooks";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);

  React.useEffect(() => {
    if (!userProfile) {
      return;
    }
    if (userProfile?.type !== 'admin') {
      router.push('/');
    }
  }, [userProfile])
  return userProfile && <div className="flex min-h-screen">
    <AdminSidebar />

    <div className="flex flex-col flex-grow bg-gray-200">
      <AdminHeader userProfile={userProfile} />

      <div className="mb-auto">
        {children}
      </div>
      <AdminFooter />
    </div>
  </div>
}