'use client'

import { useAppDispatch } from "@toreca-jp-app/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { resetPassword, sendResetPasswordEmail } from "@toreca-jp-app/domain/user";
import { Button, Input } from "@mui/material";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default async function ({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const handleInputEmail = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);
  return searchParams['token'] ? <div className="flex items-center justify-center min-h-screen p-5 bg-white min-w-screen">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
      <h5 className="text-2xl mb-5">パスワードを入力してください</h5>
      <Input name="password" onChange={(event) => setPassword(event.target.value)} />
      <div className="mt-4">
        <PrimaryButton onClick={() => dispatch(resetPassword({ password, token: searchParams['token'] || '' }))}>パスワードリセット</PrimaryButton>
      </div>
    </div>
  </div > : <div className="flex items-center justify-center min-h-screen p-5 bg-white min-w-screen">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
      <h5 className="text-2xl mb-5">メールアドレスを入力してください</h5>
      <Input name="email" onChange={handleInputEmail} />
      <div className="mt-4">
        <PrimaryButton onClick={() => dispatch(sendResetPasswordEmail(email))}>メールを送信</PrimaryButton>
        <p className="mt-4 text-sm">メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
      </div>
    </div>
  </div>
}