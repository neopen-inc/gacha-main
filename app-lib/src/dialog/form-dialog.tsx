import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

export interface FormDialogProps {
  open: boolean;
  handler?: () => void;
  cancel: () => void;
  title: string;
  okText?: string;
  cancelText?: string;
  children: React.ReactNode;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function FormDialog({ open, submit, title, okText, cancelText, children, cancel }: FormDialogProps) {
  return <Dialog open={open} onClose={cancel}>
    <form onSubmit={submit}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="overflow-scroll max-h-[80vh] ">
        
        <div className="p-5">
          {children}
        </div>
        <div className="flex flex-row gap-10">
          <Button
            variant="outlined"
            onClick={cancel}
            className="mr-1"
            color="primary"
          >
            {cancelText || 'キャンセル'}
          </Button>
          <PrimaryButton type="submit" className="bg-primary">
            {okText || '作成'}
          </PrimaryButton>
        </div>
      </DialogContent>
    </form>
  </Dialog>
}