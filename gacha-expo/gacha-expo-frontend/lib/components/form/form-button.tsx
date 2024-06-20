import { Button } from "@mui/material";

interface FormSubmitButtomProps {
  text: string;
}

export function FormSubmitButton({ text }: FormSubmitButtomProps) {
  return <Button className="mt-6" fullWidth type="submit">
  {text}
</Button>
}