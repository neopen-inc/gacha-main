'use client'

import { useAppDispatch } from "@toreca-jp-app/store/hooks";
import { useRouter } from "next/navigation";
import { clearOperationStatus, sendVerificationEmail, verifyEmail } from "@toreca-jp-app/domain/user";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!router) return;
    if (!searchParams.token) return;
    if (searchParams.token) {
      dispatch(verifyEmail({ id: params.id, token: searchParams.token })).then(() => {
        router.push('/');
      });
    }
  }, []);
  return <div className="flex items-center justify-center min-h-screen p-5 bg-white min-w-screen">
    <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
      <h3 className="text-2xl">ご登録ありがとうございます。</h3>
      <p>メールボックスを確認し、検証メールを従って、メールを検証しましょう</p>
      <div className="mt-4">
        <PrimaryButton onClick={() => dispatch(clearOperationStatus('sendResetPasswordEmail')).then(() => dispatch(sendVerificationEmail(params.id)))}>検証メール再送信</PrimaryButton>
        <p className="mt-4 text-sm">メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
      </div>
    </div>
  </div>

}