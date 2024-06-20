import { NotificationDisplayConfig } from "./type";
import { Alert, Snackbar } from "@mui/material";


interface NotificationProps extends NotificationDisplayConfig {
  onClose: () => void;
}

export function Notification(props: NotificationProps) {
  return <Snackbar open={props.shouldShow} autoHideDuration={props.displayMilliseconds}  onClose={props.onClose}>
    <Alert severity={props.severity} >
      {props.message}
    </Alert>
  </Snackbar>
}