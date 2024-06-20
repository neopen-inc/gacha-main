'use client'
import { NormalLink } from "@gacha-nango-app/components/common/normal-link";
import { PageTitle } from "@gacha-nango-app/components/common/page-title";
import { useAppDispatch, useAppSelector } from "@gacha-nango-app/store/hooks";
import { PostLoginDto, clearOperationStatus, fetchUserProfile, loginUser } from "@gacha-nango-app/domain/user";
import { isOperationFailed, isOperationSucceeded } from "@gacha-nango-app/util/common";
import { Button, Input } from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type LoginForm = PostLoginDto;
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const loginOperation = useAppSelector(state => state.user.operations.login);
  const router = useRouter();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);

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

  const isLoginOperationSucceeded = _.partial(isOperationSucceeded, [loginOperation]);
  const isLoginOperationFailed = _.partial(isOperationFailed, [loginOperation]);


  return <div className="min-h-screen min-w-screen items-center justify-center flex flex-col">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <PageTitle title='ログイン' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 " onSubmit={loginForm.handleSubmit(onLogin)}>
        <Controller name="email" control={loginForm.control} render={({ field }) => (
          <>"メールアドレス": <Input {...field} /></>)} />
        <Controller name="password" control={loginForm.control} render={({ field }) => (
          <>"パスワード" <Input {...field} type="password" /></>)} />
        <Button type="submit" className="bg-primary">ログイン</Button>
      </form>
      <NormalLink href="/register" label="新規登録はこちら" />
    </div>
    
  </div>
}