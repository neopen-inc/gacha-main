'use client'
import _ from "lodash";
import { NormalLink } from "@gacha-colle-app/components/common/normal-link";
import { PageTitle } from "@gacha-colle-app/components/common/page-title";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { PostLoginDto, clearOperationStatus, fetchUserProfile, loginUser } from "@gacha-colle-app/domain/user";
import { Button, TextField } from "@mui/material";
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
  return <div className="min-w-[300px] w-[80%] md:w-[500px] flex flex-col items-center justify-center p-5 md:p-20 rounded-lg mx-auto bg-white">
      <PageTitle title='ログイン' />
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 w-full" onSubmit={loginForm.handleSubmit(onLogin)}>
        <Controller name="email" control={loginForm.control} render={({ field }) => (
          <div className="flex justify-start flex-col">
            <label className="font-bold">メールアドレス</label>
            <TextField {...field}  type="email" InputLabelProps={{ shrink: true }} />
          </div>
          )} />
        <Controller name="password" control={loginForm.control} render={({ field }) => (
          <div className="flex justify-start flex-col">
            <label className="font-bold">パスワード</label>
            <TextField {...field} type="password" InputLabelProps={{ shrink: true }} />
          </div>
        )} />  
        <PrimaryButton type="submit"  size="medium" style={{
          borderRadius: '40px',
          padding: '20px 20px',
          fontWeight: 'bold',
        }}>ログイン</PrimaryButton>
        <Button onClick={() => router.push("/register")} size="medium" style={{
          borderRadius: '40px',
          padding: '20px 20px',
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: '#000',
        }}>新規登録</Button>
      </form>
      <div className="mt-6 text-center">
        <NormalLink href="/reset-password" label="パスワードを忘れた場合" />
      </div>
    </div>
}
