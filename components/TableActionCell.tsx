import React from 'react';
import { Button } from './ui/button';
import { Edit2, Trash } from 'lucide-react';
import DeleteConfirmButton from './DeleteConfirmButton';

type TableActionCellProps = {
  isUpdating?: boolean;
  isDeleting?: boolean;
  onEdit?: () => void;
  onDelete?: () => Promise<boolean>;
};

const TableActionCell: React.FC<TableActionCellProps> = ({
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex gap-1 justify-end">
      <Button
        variant="outline"
        size="icon"
        onClick={onEdit}
        loading={isUpdating}
      >
        <Edit2 />
      </Button>

      {onDelete && (
        <DeleteConfirmButton
          loading={isDeleting}
          trigger={
            <Button variant="destructive" size="icon">
              <Trash />
            </Button>
          }
          onConfirm={onDelete}
        />
      )}
    </div>
  );
};

export default TableActionCell;
