import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export interface SimpleConfirmDialogProps {
  open: boolean;
  onConfirm?: () => void;
  title: string;
  okText?: string;
  children: React.ReactNode;
}

export function SimpleConfirmDialog({ open, onConfirm, title, okText, children }: SimpleConfirmDialogProps) {
  return <Dialog open={open} onClose={onConfirm} sx={{
    '& .MuiDialog-paper': {
      borderRadius: '10%',
    }
  }}  >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="overflow-scroll max-h-[80vh] ">
        <div className="p-5">
          {children}
        </div>
        <div className="flex flex-row gap-10">
          <PrimaryButton onClick={onConfirm} className="bg-primary">
            {okText || '作成'}
          </PrimaryButton>
        </div>
      </DialogContent>
  </Dialog>
}