import { PageTitle } from "../common/page-title";
import { CustomForm } from "../form/custom-form";
import { FormLineItemProps } from "../form/form-line-item";

const adminLoginItems: FormLineItemProps[] = [{
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
export function AdminLogin() {
  return   <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <PageTitle title='管理者ログイン' />
    <CustomForm formItems={adminLoginItems} formSubmitButtonText='ログイン' />
</div>
}