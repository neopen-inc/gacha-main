import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@mui/material";

interface InputErrorMessageProps {
  message: string;
}

export function InputErrorMessage({ message }: InputErrorMessageProps) {
  return <Typography variant="body2" color="red" className="flex items-center gap-1 font-normal mt-2">
    <InformationCircleIcon className="w-4 h-4 -mt-px" />
    {message}
  </Typography>
}
