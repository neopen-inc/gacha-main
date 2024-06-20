'use client'

import { useAppDispatch } from "@gacha-colle-app/store/hooks";
import { useRouter } from "next/navigation";
import { resetPassword, sendResetPasswordEmail } from "@gacha-colle-app/domain/user";
import React from "react";
import { Button, Input, TextField } from "@mui/material";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

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
  
  return searchParams.token ? <div className="min-w-[300px] w-[80%] md:w-[500px] flex flex-col items-center justify-center p-5 md:p-20 rounded-lg mx-auto bg-white">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white lg:max-w-3xl rounded-3xl lg:p-12">
      <h5 className="text-2xl mb-5">パスワードを入力してください</h5>
      <Input type="password" name="password" onChange={(event) => setPassword(event.target.value)} />
      <div className="mt-4">
        <PrimaryButton style={{
          borderRadius: '40px',
          padding: '20px 20px',
          fontWeight: 'bold',
        }}
        onClick={() => dispatch(resetPassword({ password, token: searchParams.token || '' })).unwrap().then(() => {
          router.push('/login');
        }).catch((error) => {
          setShowError({
            show: true,
            message: 'パスワードリセットに失敗しました。'
          })
        })}>パスワードリセット</PrimaryButton>
      </div>
    </div>
  </div > : <div className="min-w-[300px] w-[80%] md:w-[500px] flex flex-col items-center justify-center p-5 md:p-20 rounded-lg mx-auto bg-white">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white lg:max-w-3xl rounded-3xl lg:p-12">
      <div className="font-bold mb-5">メールアドレスを入力してください</div>
      <TextField type="text" value={email} onChange={onInputEmail} />
      <div className="mt-4">
        <PrimaryButton style={{
          borderRadius: '40px',
          padding: '20px',
          fontWeight: 'bold',
        }} 
        onClick={() => dispatch(sendResetPasswordEmail(email)).unwrap().then(() => {
          router.push('/reset-password-sent')
        }).catch((err) => {
          if (err.message === 'User not found') {
            setShowError({
              show: true,
              message: 'メールアドレスが存在しません。'
            })
          }
        })}>メールを送信</PrimaryButton>
        <p className="mt-4 text-sm">メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
      </div>
    </div>
  </div>

}