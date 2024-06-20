'use client'

import { useAppDispatch } from "@nanashinooripa-app/store/hooks";
import { useRouter } from "next/navigation";
import { LoginResponse, clearOperationStatus, fetchUserProfile, sendVerificationEmail, verifyEmail } from "@nanashinooripa-app/domain/user";
import React from "react";
import { Button } from "@mui/material";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVerified, setIsVerified] = React.useState(false);
  React.useEffect(() => {
    if (!router) return;
    if (!searchParams.token) return;
    if (searchParams.token) {
      dispatch(verifyEmail({ id: params.id, token: searchParams.token })).unwrap().then((verifyInfo: LoginResponse) => {
        localStorage.setItem('access_token', verifyInfo.token);
        localStorage.setItem('user_id', verifyInfo.id);
        dispatch(fetchUserProfile(verifyInfo.id)).unwrap().then((res) => {
          setIsVerified(true);
        });
      });
    }
  }, []);
  return isVerified ? 
    (<div className="flex items-center justify-center min-h-screen p-5 bg-white min-w-screen">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white  lg:max-w-3xl rounded-3xl lg:p-12">
      <h3 className="text-2xl">メールの検証完了しました</h3>
      <div>ホームボタンをクリックし、ホームページに戻りましょう。</div>
      <div className="mt-4">
      <PrimaryButton onClick={() => router.push("/")}>ホームページに戻る</PrimaryButton>
      </div>
    </div>
  </div>) : (<div className="flex items-center justify-center min-h-screen p-5 bg-white min-w-screen">
  <div className="max-w-xl p-8 text-center text-gray-800 bg-white lg:max-w-3xl rounded-3xl lg:p-12">
    <h3 className="text-2xl">ご登録ありがとうございます。</h3>
    <div>メールボックスを確認し、検証メールを従って、<br />メールを検証しましょう</div>
    <div className="mt-4">
      <PrimaryButton className="bg-primary shadow-none hover:shadow-none text-white" 
        onClick={() => dispatch(clearOperationStatus('sendResetPasswordEmail')).then(() => dispatch(sendVerificationEmail(params.id)))}>検証メール再送信</PrimaryButton>
      <div className="mt-4 text-sm">メールが届かない場合は、迷惑メールフォルダをご確認ください。</div>
    </div>
  </div>
</div>)
}
