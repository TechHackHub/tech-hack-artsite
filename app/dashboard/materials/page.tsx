"use client";

import React, { useState } from "react";
import TransitionPage from "@/components/TransitionPage";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableActionCell from "@/components/TableActionCell";
import {
  useCreateMaterial,
  useDeleteMaterial,
  useMaterials,
  useUpdateMaterial,
} from "./hooks";
import { formDateTimeToString } from "@/app/libs/utils";
import CreateButton from "@/components/CreateButton";
import AppDialog from "@/components/AppDialog";
import MaterialForm from "@/components/materials/MaterialForm";
import { Material } from "@/app/api/materials/route";

const MaterialPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const { isLoading, data } = useMaterials();
  const materials = data?.list ?? [];

  const { isLoading: isCreateing, mutateAsync: createMaterialAsync } =
    useCreateMaterial();

  const { isLoading: isUpdating, mutateAsync: updateMaterialAsync } =
    useUpdateMaterial();

  const { isLoading: isDeleting, mutateAsync: deleteMaterialAsync } =
    useDeleteMaterial();

  const handleCreateSubmit = async (formData: Pick<Material, "name">) => {
    const data = await createMaterialAsync({ data: formData });

    if (data) {
      setIsOpen(false);
    }
  };

  const handleEditClick = (material: Material) => {
    setEditingMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (formData: Pick<Material, "name">) => {
    if (!editingMaterial) {
      return;
    }

    const data = await updateMaterialAsync({
      data: formData,
      params: { id: editingMaterial?.id },
    });

    if (data) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteMaterialAsync({ params: { id } });
      return true;
    } catch {
      return false;
    }
  };

  const columns: ColumnDef<Material>[] = [
    { accessorKey: "name", header: "NAME" },
    {
      accessorKey: "updatedAt",
      header: "UPDATED AT",
      cell: (row) => formDateTimeToString(row?.row?.original?.updatedAt),
    },
    {
      id: "action",
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
        data={materials}
        toolbars={[
          <CreateButton key="create-btn" onClick={() => setIsOpen(true)} />,
        ]}
      />

      {/* create dialog */}
      <AppDialog
        title="Create Material"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <MaterialForm
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
        <MaterialForm
          loading={isUpdating}
          initialValues={editingMaterial}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </AppDialog>
    </TransitionPage>
  );
};

export default MaterialPage;
