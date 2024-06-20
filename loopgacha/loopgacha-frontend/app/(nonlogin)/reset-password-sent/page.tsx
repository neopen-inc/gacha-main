'use client'

import { useAppDispatch } from "@loopgacha-app/store/hooks";
import { useRouter } from "next/navigation";
import React from "react";

export default function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showError, setShowError] = React.useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [password, setPassword] = React.useState<string>('');
  const [email, setEmail] = React.useState('');
  
  const onInputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }
  
  return <div className="flex flex-col gap-5 items-center justify-center min-h-screen p-5 bg-white min-w-screen">
    <img src="/logo.png" className="w-64" />
    メールボックスを確認し、検証メールを従って、<br />パスワードを再設定してください。</div>
}