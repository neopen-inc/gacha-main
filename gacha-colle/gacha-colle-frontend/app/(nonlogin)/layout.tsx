
'use client'

import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import React from "react"
import { Alert, AppBar, Link, Snackbar } from "@mui/material";
import { notification } from "@commons";

export default function NonloginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const notificationDisplay = useAppSelector(state => state.notification.notification);

  return <div className="w-full bg-slate-100 relative pb-40" style={{
    background: 'url(/loginbg.jpeg)',
  }}>
    <AppBar color="transparent" elevation={0} className="bg-white top-0 shadow-none inset-0 z-10 h-max max-w-full px-2 py-0 rounded-none md:py-2 md:px-4 lg:px-8 lg:py-4 mb-5 lg:mb-10" position="static">
      <div className="flex items-center justify-between text-gray-900">
        <Link href="/">
          <img className="h-12 md:h-20 my-2" src="/logo.png" />
        </Link>
      </div>
    </AppBar>
    {children}
    <Snackbar
      open={notificationDisplay.shouldShow}
      autoHideDuration={notificationDisplay.displayMilliseconds || 3000}
      onClose={() => {
        dispatch(notification.hideNotification());
      }}
    >
      <Alert severity={notificationDisplay.severity} className="w-[80%] mx-auto" >
        {notificationDisplay.message}
      </Alert>
    </Snackbar>
  </div>
}