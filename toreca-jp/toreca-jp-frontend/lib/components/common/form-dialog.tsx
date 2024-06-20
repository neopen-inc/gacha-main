import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export interface FormDialogProps {
  open: boolean;
  handler?: () => void;
  close: () => void;
  title: string;
  okText?: string;
  cancelText?: string;
  children: React.ReactNode;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function FormDialog({ open, submit, title, okText, cancelText, children, close }: FormDialogProps) {
  return <Dialog open={open} onClose={close}>
    <form onSubmit={submit}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="overflow-scroll max-h-[80vh]">
        {children}
        <div className="py-5"></div>
        <div className="flex flex-row">
          <Button
            variant="text"
            onClick={close}
            className="mr-1"
          >
            {cancelText || 'キャンセル'}
          </Button>
          <PrimaryButton type="submit">
            {okText || '作成'}
          </PrimaryButton>
        </div>

      </DialogContent>
    </form>
  </Dialog>
}