'use client'
import _ from "lodash";
import { NormalLink } from "@cardpia-app/components/common/normal-link";
import { PageTitle } from "@cardpia-app/components/common/page-title";
import { useAppDispatch, useAppSelector } from "@cardpia-app/store/hooks";
import { PostLoginDto, clearOperationStatus, fetchUserProfile, loginUser } from "@cardpia-app/domain/user";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { notification } from "@commons";

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
        if (res.status === 'inactive') {
          router.push(`/${loginInfo.id}/verify-email`);
          return;
        }
        if (res?.type === 'admin') {
          router.push('/admin/category');
        } else {
          router.push('/');
        }
      }).catch((err) => {
        dispatch(notification.showNotification({
          message: `ログイン失敗しました, ${err.message}`,
          severity: 'error',
        }));
      });
    }).catch((err) => {
      dispatch(notification.showNotification({
        message: `ログイン失敗しました`,
        severity: 'error',
      }));
    });
  }
  return <div className="min-h-screen min-w-screen items-center justify-center flex flex-col">
    <div className="min-w-[300px] w-[80%] md:w-[360px] flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <PageTitle title='ログイン' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 w-full" onSubmit={loginForm.handleSubmit(onLogin)}>
        <Controller name="email" control={loginForm.control} render={({ field }) => (
          <TextField {...field} label="メールアドレス" type="email" InputLabelProps={{ shrink: true }} />)} />
        <Controller name="password" control={loginForm.control} render={({ field }) => (
          <TextField {...field} label="パスワード" type="password" InputLabelProps={{ shrink: true }} />)} />
        <PrimaryButton type="submit"  size="medium" >ログイン</PrimaryButton>
      </form>
      <div className="mt-6 text-center">
        <NormalLink href="/register" label="新規登録はこちら" /><br />
        <NormalLink href="/reset-password" label="パスワードを忘れた場合" />
      </div>
    </div>
  </div>
}