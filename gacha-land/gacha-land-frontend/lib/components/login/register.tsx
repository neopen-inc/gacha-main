'use client';

import { Typography } from "@mui/material";
import { NormalLink } from "../common/normal-link";
import { PageTitle } from "../common/page-title";
import { CustomForm } from "../form/custom-form";
import { FormLineItemProps } from "../form/form-line-item";
import Link from "next/link";

const RegisterItems: FormLineItemProps[] = [{
  name: 'name',
  type: 'text',
  label: 'ユーザー名',
  required: true
}, {
  name: 'email',
  type: 'email',
  label: 'メールアドレス',
  required: true
}, {
  name: 'password',
  type: 'password',
  label: 'パスワード',
  required: true
}]

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
}
export function Register({ onRegister }: RegisterProps) {
  return <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <PageTitle title='新規登録' />
    <CustomForm formItems={RegisterItems} formSubmitButtonText='新規登録（無料）' onSubmit={(event) => {
      onRegister((event.target as any).name.value, (event.target as any).email.value, (event.target as any).password.value)
    }} />

    <Typography color="gray" className="mt-4 text-center font-normal">
      既にアカウントを持っている方{" "}
      <Link
        href="/login"
        className="font-medium text-blue-500 transition-colors hover:text-blue-700"
      >
        ログインはこちら
      </Link>
    </Typography>
    <div>
      本サービスの会員登録を行うと、
      <NormalLink href="#" label="利用規約" /> および <NormalLink href="#" label="プライバシーポリシー" />に同意したものとみなします
    </div>
  </div>
}