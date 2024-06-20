'use client'

import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { setAuthInfo, fetchUserProfile } from "@gacha-colle-app/domain/user";
import React, { useEffect } from "react"
import store from '@gacha-colle-app/store';
import { Alert, Snackbar } from "@mui/material";
import { notification } from "@commons";

export default function AuthLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const notificationDisplay = useAppSelector(state => state.notification.notification);

  useEffect(() => {
    if (store.getState().user.authInfo === undefined) {
      const localAccessToken = localStorage.getItem('access_token');
      const localUserId = localStorage.getItem('user_id');
      if (localAccessToken && localUserId) {
        dispatch(setAuthInfo({ token: localAccessToken, id: localUserId })).unwrap().then((data) => {
          dispatch(fetchUserProfile(data.id)).unwrap().then((data) => {
            
          });
        });
      }
    }
  }, []);
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