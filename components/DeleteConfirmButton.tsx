import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from './ui/alert-dialog';
import { Button } from './ui/button';

type DeleteConfirmButtonProps = {
  loading?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => boolean | Promise<boolean>;
};

const DeleteConfirmButton: React.FC<DeleteConfirmButtonProps> = ({
  loading,
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result) {
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || 'Are you sure to delete?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              'This action cannot be undone. This will permanently delete the item.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button loading={loading} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmButton;
