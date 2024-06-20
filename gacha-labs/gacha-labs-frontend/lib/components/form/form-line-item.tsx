import { FormInput } from "./form-input";
import { FormLabel } from "./form-label";
import { MenuItem, Select } from "@mui/material";

export interface FormLineItemProps {
  name: string;
  type: string;
  label: string;
  required: boolean;
  items?: { value: string, label: string }[];
}

export function FormLineItem({ name, type, label, required, items }: FormLineItemProps) {
  const renderSelect = (name: string, label: string) => <>
    <Select size="small" label={label} name={name}>
      {items?.map((item, index) => <MenuItem key={index} value={item.value}>{item.label}</MenuItem>)}
    </Select>
  </>

  const renderOtherInput = (name: string, label: string) => <><FormLabel htmlFor={name} label={label} />
  <FormInput name={name} type={type} required={required} /></>
  return <div className="col-span-full">
    {type === 'select' ? renderSelect(name, label) : renderOtherInput(name, label)}
  </div>
}
