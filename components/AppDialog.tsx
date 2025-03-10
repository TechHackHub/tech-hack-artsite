import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

type AppDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

const AppDialog: React.FC<AppDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
