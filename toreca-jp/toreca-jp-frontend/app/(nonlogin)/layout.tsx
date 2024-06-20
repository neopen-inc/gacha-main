'use client'

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";

import React from "react"
import { showMessage } from "@toreca-jp-app/store/page";
import { Alert, Snackbar } from "@mui/material";


export default function AuthLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const isShowMessage = useAppSelector(state => state.page.showMessage);
  return <>
    {children}
    <Snackbar autoHideDuration={3000} 
        open={isShowMessage.show}
        onClose={() => {
        dispatch(showMessage({ message: '', show: false, severity: undefined }))
      }}>
        <Alert severity={isShowMessage.severity}  sx={{ width: '100%' }}>
          {
            isShowMessage.message
          }
        </Alert>
      </Snackbar>
  </>
}