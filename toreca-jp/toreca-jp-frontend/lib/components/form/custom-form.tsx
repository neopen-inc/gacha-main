'use client';

import { FormEventHandler } from "react";
import { FormSubmitButton } from "./form-button";
import { FormLineItem, FormLineItemProps } from "./form-line-item";

interface CustomFormProps {
  formItems: FormLineItemProps[];
  formSubmitButtonText: string;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
}
export function CustomForm({ formItems, formSubmitButtonText, onSubmit }: CustomFormProps) {
  return (<form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 " onSubmit={(event) => {
    event.preventDefault();
    onSubmit && onSubmit(event);
  }}>
    {formItems.map((formItem, index) => <FormLineItem key={index} {...formItem} />)}
    <FormSubmitButton text={formSubmitButtonText} />
  </form>)
}
