import { PrimaryButton } from "@commons/components/buttons/primary-button";


interface FormSubmitButtomProps {
  text: string;
}

export function FormSubmitButton({ text }: FormSubmitButtomProps) {
  return <PrimaryButton className="mt-6" fullWidth type="submit">
  {text}
</PrimaryButton>
}