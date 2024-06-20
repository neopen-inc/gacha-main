'use client'
import { AdminFooter } from "@toreca-jp-app/components/admin/admin-footer"
import { AdminHeader } from "@toreca-jp-app/components/admin/admin-header"
import { AdminSidebar } from "@toreca-jp-app/components/admin/admin-sidebar"
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks"
import { adminTheme } from "@toreca-jp-app/theme"
import { ThemeProvider } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const notificationDisplay = useAppSelector(state => state.notification.notification);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!userProfile) {
      return;
    }
    if (userProfile?.type !== 'admin') {
      router.push('/');
    }
  }, [userProfile])
  return userProfile?.type === 'admin' && 
  <ThemeProvider theme={adminTheme}>
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow bg-gray-200">
        <AdminHeader userProfile={userProfile} />
          <div className="mb-auto">
            {children}
          </div>
        <AdminFooter />
      </div>
    </div>
    
  </ThemeProvider> 
}
