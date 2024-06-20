'use client'
import { NormalLink } from "@toreca-jp-app/components/common/normal-link";
import { PageTitle } from "@toreca-jp-app/components/common/page-title";
import { fetchUserProfile, loginUser, PostLoginDto } from "@toreca-jp-app/domain/user";
import { useAppDispatch } from "@toreca-jp-app/store/hooks";
import { showMessage } from "@toreca-jp-app/store/page";
import { Button, TextField } from "@mui/material";

import _ from "lodash";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type LoginForm = PostLoginDto;
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  

  const defaultLoginValues: LoginForm = {
    email: '',
    password: '',
  };
  const loginForm = useForm<LoginForm>({
    defaultValues: defaultLoginValues,
  });

  const onLogin: SubmitHandler<LoginForm> = (data) => {
    dispatch(loginUser(data)).unwrap().then((loginInfo) => {
      dispatch(showMessage({ message: 'ログインしました', show: true, severity: 'info' }))
      localStorage.setItem('access_token', loginInfo.token);
      localStorage.setItem('user_id', loginInfo.id);
      //dispatch(clearOperationStatus('login'));
      
      dispatch(fetchUserProfile(loginInfo.id)).unwrap().then((res) => {
        if (res?.type === 'admin') {
          router.push('/admin/category');
        } else {
          router.push('/');
        }
      });
    }).catch((err) => {
      dispatch(showMessage({ message: `ログイン失敗しました`, show: true, severity: 'error' }))
    });
  }

  //const isLoginOperationSucceeded = _.partial(isOperationSucceeded, [loginOperation]);
  //const isLoginOperationFailed = _.partial(isOperationFailed, [loginOperation]);


  return <div className="min-h-screen min-w-screen items-center justify-center flex flex-col">
    
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <img className="h-16 md:h-16 mb-10" src="/logo.png" />
      <PageTitle title='ログイン' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 " onSubmit={loginForm.handleSubmit(onLogin)}>
        <Controller name="email" control={loginForm.control} render={({ field }) => (
          <TextField {...field} label="メールアドレス" />)} />
        <Controller name="password" control={loginForm.control} render={({ field }) => (
          <TextField {...field} label="パスワード" type="password" />)} />
        <PrimaryButton type="submit">ログイン</PrimaryButton>
      </form>
      <br />
      <NormalLink href="/register" label="新規登録はこちら" />
    </div>
    
    
  </div>
}
