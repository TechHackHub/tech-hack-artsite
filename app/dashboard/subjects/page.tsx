'use client';

import React, { useState } from 'react';
import TransitionPage from '@/components/TransitionPage';
import {
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from './hooks';
import { ColumnDef } from '@tanstack/react-table';
import { Subject } from './types';
import { formDateTimeToString } from '@/app/libs/utils';
import TableActionCell from '@/components/TableActionCell';
import DataTable from '@/components/ui/DataTable';
import CreateButton from '@/components/CreateButton';
import AppDialog from '@/components/AppDialog';
import NameForm from '../materials/components/NameForm';

const SubjectPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const { isLoading, data } = useSubjects();
  const subjects = data?.list ?? [];

  const { isLoading: isCreateing, mutateAsync: createSubjectAsync } =
    useCreateSubject();

  const { isLoading: isUpdating, mutateAsync: updateSubjectAsync } =
    useUpdateSubject();

  const { isLoading: isDeleting, mutateAsync: deleteSubjectAsync } =
    useDeleteSubject();

  const handleCreateSubmit = async (formData: Pick<Subject, 'name'>) => {
    const data = await createSubjectAsync({ data: formData });

    if (data) {
      setIsOpen(false);
    }
  };

  const handleEditClick = (material: Subject) => {
    setEditingSubject(material);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (formData: Pick<Subject, 'name'>) => {
    if (!editingSubject) {
      return;
    }

    const data = await updateSubjectAsync({
      data: formData,
      params: { id: editingSubject?.id },
    });

    if (data) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteSubjectAsync({ params: { id } });
      return true;
    } catch {
      return false;
    }
  };

  const columns: ColumnDef<Subject>[] = [
    { accessorKey: 'name', header: 'NAME' },
    {
      accessorKey: 'updatedAt',
      header: 'UPDATED AT',
      cell: (row) => formDateTimeToString(row?.row?.original?.updatedAt),
    },
    {
      id: 'action',
      cell: (row) => {
        return (
          <TableActionCell
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            onEdit={() => handleEditClick(row.row.original)}
            onDelete={async () => handleDeleteClick(row.row.original.id)}
          />
        );
      },
    },
  ];

  return (
    <TransitionPage>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={subjects}
        toolbars={[
          <CreateButton key="create-btn" onClick={() => setIsOpen(true)} />,
        ]}
      />

      {/* create dialog */}
      <AppDialog
        title="Create Subject"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <NameForm<Pick<Subject, 'name'>>
          loading={isCreateing}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </AppDialog>

      {/* edit dialog */}
      <AppDialog
        title="Edit Material"
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <NameForm<Pick<Subject, 'name'>>
          loading={isUpdating}
          initialValues={editingSubject}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </AppDialog>
    </TransitionPage>
  );
};

export default SubjectPage;
