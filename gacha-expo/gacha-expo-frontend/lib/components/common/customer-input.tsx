import { ComponentPropsWithoutRef, forwardRef } from "react";

export type CustomerInputProps  = ComponentPropsWithoutRef<'input'> & {
  label: string;
  className?: string;
}

export const CustomerInput = forwardRef<HTMLInputElement, CustomerInputProps>(function WrappedCustomerInput({ label, ...rest}, ref) {
  const { className, ...inputRest } = rest;
  return <div className={className ? className : ''}>
  <label >{label}</label>
  <input {...inputRest} placeholder={label} className="border border-gray-300 rounded p-2 " ref={ref}/>
</div>
});