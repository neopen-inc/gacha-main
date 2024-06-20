'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { NormalLink } from "@loopgacha-app/components/common/normal-link";
import { PageTitle } from "@loopgacha-app/components/common/page-title";
import { useAppDispatch } from "@loopgacha-app/store/hooks";
import { PostUserDto, registerUser } from "@loopgacha-app/domain/user";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { InputErrorMessage } from '@loopgacha-app/components/common/input-error-message';
import { Typography, TextField } from '@mui/material';
import React from 'react';
import { PrimaryButton } from '@commons/components/buttons/primary-button';
import { notification } from '@commons';

type RegisterForm = PostUserDto;
export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const defaultRegisterValues: RegisterForm = {
    name: '',
    email: '',
    password: '',
  };
  const loginFormValidator = z.object({
    name: z
      .string()
      .min(4, { message: '4文字以上に設定してください' }),
    password: z
      .string()
      .min(8, { message: '8文字以上に設定してください' }),
    email: z.string().email({ message: 'メールアドレスを入力してください' }),
  });

  const registerForm = useForm<RegisterForm>({
    defaultValues: defaultRegisterValues,
    resolver: zodResolver(loginFormValidator),
  });

  const onRegister: SubmitHandler<PostUserDto> = (data) => {
    dispatch(registerUser(data)).unwrap().then((result) => {
      router.push(`/${result.id}/verify-email`);
    }).catch((err) => {
      if (err.message === 'User already exists') {
        dispatch(notification.showNotification({
          message: `既に登録されているメールアドレスです`,
          severity: 'error',
        }));
      } else {
        dispatch(notification.showNotification({
          message: `エラーが発生しました。`,
          severity: 'error',
        }));
      }
    });
  }


  return <div>
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen min-w-[300px] w-[80%] md:w-[360px]  lg:py-0">
      <PageTitle title='ループガチャ新規登録' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 w-full" onSubmit={registerForm.handleSubmit(onRegister)}>
        <Controller name="name" rules={{ required: true, minLength: 4 }} control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <>
            <TextField variant="outlined" {...field} label="ユーザー名" InputLabelProps={{ shrink: true }} />
            {
              error && registerForm.formState.errors.name &&
              <InputErrorMessage message={registerForm.formState.errors.name.message || ''} />
            }
          </>
        )} />
        <br />

        <Controller name="email" control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <>
            <TextField variant="outlined" {...field} label="メールアドレス" InputLabelProps={{ shrink: true }} />
            {
              error && registerForm.formState.errors.email &&
              <InputErrorMessage message={registerForm.formState.errors.email.message || ''} />
            }
          </>
        )} />
        <br />
        <Controller name="password" control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <>
            <TextField variant="outlined" {...field} type="password" label="パスワード" InputLabelProps={{ shrink: true }} />
            {
              error && registerForm.formState.errors.password &&
              <InputErrorMessage message={registerForm.formState.errors.password.message || ''} />
            }
          </>
        )} />
        <br />
        <PrimaryButton type="submit" className="shadow-none hover:shadow-none">新規登録</PrimaryButton>
      </form>
      <Typography className="mt-4 text-center font-normal text-[#666]">
        既にアカウントを持っている方<br />
        <Link
          href="/login"
          className="font-medium text-primary transition-colors"
        >
          ログインはこちら
        </Link>
      </Typography>
      <div className="text-center font-normal text-[#666] ">
        本サービスの会員登録を行うと<br />
        <NormalLink href="/term" label="利用規約" /> および <br /><NormalLink href="/privacy" label="プライバシーポリシー" />に同意したものとみなします
      </div>
    </div>
  </div>
}
