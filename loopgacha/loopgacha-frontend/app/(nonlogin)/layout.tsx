
'use client'

import { useAppDispatch, useAppSelector } from "@loopgacha-app/store/hooks";
import React from "react"
import { Alert, Snackbar } from "@mui/material";
import { notification } from "@commons";

export default function NonloginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const notificationDisplay = useAppSelector(state => state.notification.notification);

  return <>
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
  </>
}