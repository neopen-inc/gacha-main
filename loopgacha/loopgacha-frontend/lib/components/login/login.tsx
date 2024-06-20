import { NormalLink } from "../common/normal-link";
import { PageTitle } from "../common/page-title";
import { CustomForm } from "../form/custom-form";
import { FormLineItemProps } from "../form/form-line-item";

const LoginItems: FormLineItemProps[] = [{
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

interface LoginProps {
  onLogin(email: string, password: string): void;
}

export function Login({ onLogin }: LoginProps) {
  return <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
    <PageTitle title='ログイン' />
    <CustomForm formItems={LoginItems} formSubmitButtonText='ログイン' onSubmit={(event) =>
      onLogin((event.target as any).email.value, (event.target as any).password.value)
    } />
    <NormalLink href="/register" label="新規登録はこちら" />
  </div>
}