import { Button, ButtonProps } from "@mui/material";
import React from "react";

export const PrimaryButton = React.forwardRef((props: ButtonProps & { className?: string; admin?: boolean }) => {
  const { className, admin, ...rest } = props;
  return <Button {...rest} className={`${className || ''} ${admin ? 'bg-primary-admin' : 'bg-primary'}`} color="primary" variant="contained">{props.children}</Button>;
});
