'use client'

import { useAppDispatch } from "@gacha-colle-app/store/hooks";
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
  
  return <div className="min-w-[300px] w-[80%] md:w-[500px] flex flex-col items-center justify-center p-5 md:p-20 rounded-lg mx-auto bg-white">
    メールボックスを確認し、検証メールを従って、<br />パスワードを再設定してください。</div>
}