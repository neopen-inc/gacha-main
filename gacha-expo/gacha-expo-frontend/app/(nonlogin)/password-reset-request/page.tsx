'use client'
import { NormalLink } from "@gacha-expo-app/components/common/normal-link";
import { PageTitle } from "@gacha-expo-app/components/common/page-title";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks";
import { PostLoginDto, clearOperationStatus, fetchUserProfile, loginUser } from "@gacha-expo-app/domain/user";
import { isOperationFailed, isOperationSucceeded } from "@gacha-expo-app/util/common";
import { Button, Input, TextField } from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type LoginForm = PostLoginDto;
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const loginOperation = useAppSelector(state => state.user.operations.login);
  const router = useRouter();

  const defaultLoginValues: LoginForm = {
    email: '',
    password: '',
  };
  const loginForm = useForm<LoginForm>({
    defaultValues: defaultLoginValues,
  });

  const onLogin: SubmitHandler<PostLoginDto> = (data) => {
    dispatch(loginUser(data)).unwrap().then((loginInfo) => {
      localStorage.setItem('access_token', loginInfo.token);
      localStorage.setItem('user_id', loginInfo.id);
      dispatch(clearOperationStatus('login'));
      dispatch(fetchUserProfile(loginInfo.id)).unwrap().then((res) => {
        if (res?.type === 'admin') {
          router.push('/admin/category');
        } else {
          router.push('/');
        }
      });
    })
  }

  return <div className="min-h-screen min-w-screen items-center justify-center flex flex-col">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <PageTitle title='ログイン' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 " onSubmit={loginForm.handleSubmit(onLogin)}>
        <Controller name="email" control={loginForm.control} render={({ field }) => (
          <>"メールアドレス": <TextField {...field} /></>)} />
        <Controller name="password" control={loginForm.control} render={({ field }) => (
          <>"パスワード" <TextField {...field} type="password" /></>)} />
        <Button type="submit" className="bg-primary">ログイン</Button>
      </form>
      <NormalLink href="/register" label="新規登録はこちら" />
    </div>
    
  </div>
}