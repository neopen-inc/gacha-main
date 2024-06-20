'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { NormalLink } from "@gacha-colle-app/components/common/normal-link";
import { PageTitle } from "@gacha-colle-app/components/common/page-title";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { PostUserDto, registerUser } from "@gacha-colle-app/domain/user";
import { isOperationFailed, isOperationSucceeded } from "@gacha-colle-app/util/common";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { InputErrorMessage } from '@gacha-colle-app/components/common/input-error-message';
import { Input, FormControlLabel, Button, Typography, TextField } from '@mui/material';
import React from 'react';
import { PrimaryButton } from '@commons/components/buttons/primary-button';

type RegisterForm = PostUserDto;
export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const registerOperation = useAppSelector(state => state.user.operations.register);
  const router = useRouter();
  const defaultRegisterValues: RegisterForm = {
    name: '',
    email: '',
    password: '',
  };
  const [showError, setShowError] = React.useState({ isShow: false, message: '' });
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
        setShowError({ isShow: true, message: '既に登録されているメールアドレスです' })
      } else {
        setShowError({ isShow: true, message: 'エラーが発生しました。' })
      }
    });
  }

  return <div className="min-w-[300px] w-[80%] md:w-[500px] flex flex-col items-center justify-center p-5 md:p-20 rounded-lg mx-auto bg-white">
      <PageTitle title='新規登録' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 " onSubmit={registerForm.handleSubmit(onRegister)}>
        <Controller name="name" rules={{ required: true, minLength: 4 }} control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <div className="flex justify-start flex-col">
            <label className="font-bold">ユーザー名</label>
            <TextField variant="outlined" {...field} />
            {
              error && registerForm.formState.errors.name &&
              <InputErrorMessage message={registerForm.formState.errors.name.message || ''} />
            }
          </div>
        )} />

        <Controller name="email" control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <div className="flex justify-start flex-col">
            <label className="font-bold">メールアドレス</label>
            <TextField variant="outlined" {...field} InputLabelProps={{ shrink: true }} />
            {
              error && registerForm.formState.errors.email &&
              <InputErrorMessage message={registerForm.formState.errors.email.message || ''} />
            }
          </div>
        )} />
        <Controller name="password" control={registerForm.control} render={({ field, fieldState: { error } }) => (
          <div className="flex justify-start flex-col">
            <label className="font-bold">パスワード</label>
            <TextField variant="outlined" {...field} type="password" InputLabelProps={{ shrink: true }}/>
            {
              error && registerForm.formState.errors.password &&
              <InputErrorMessage message={registerForm.formState.errors.password.message || ''} />
            }
          </div>
        )} />
        <div className="text-center">
          本サービスの会員登録を行うと<br />
          <NormalLink href="/term" label="利用規約" /> および <br /><NormalLink href="/privacy" label="プライバシーポリシー" />に同意したものとみなします
        </div>
        <PrimaryButton type="submit" size="medium" style={{
          borderRadius: '40px',
          padding: '20px 20px',
          fontWeight: 'bold',
        }}>新規登録</PrimaryButton>
        <Button onClick={() => router.push("/login")} size="medium" style={{
          borderRadius: '40px',
          padding: '20px 20px',
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: '#000',
        }}>ログイン</Button>
      </form>
    </div>
}
