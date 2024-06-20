'use client'
import { notification } from "@commons"
import { AdminFooter } from "@gacha-land-app/components/admin/admin-footer"
import { AdminHeader } from "@gacha-land-app/components/admin/admin-header"
import { AdminSidebar } from "@gacha-land-app/components/admin/admin-sidebar"
import { useAppDispatch, useAppSelector } from "@gacha-land-app/store/hooks"
import { adminTheme } from "@gacha-land-app/theme"
import { Alert, Snackbar, ThemeProvider } from "@mui/material"
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
