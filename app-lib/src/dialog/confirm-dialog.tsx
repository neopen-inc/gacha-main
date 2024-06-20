import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export interface ConfirmDialogProps {
  shouldOpen: boolean;
  cancel: () => void;
  confirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  return <Dialog open={props.shouldOpen} onClose={props.cancel}>
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
    <DialogActions>
      <Button
        variant="text"
        onClick={props.cancel}
        className="mr-1"
      >
        <span>{props.cancelText ?? 'キャンセル'}</span>
      </Button>
      <Button onClick={props.confirm}>
        <span>{props.confirmText ?? '確認'}</span>
      </Button>
    </DialogActions>
  </Dialog>
}