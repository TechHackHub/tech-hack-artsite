"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TransitionPage from "@/components/TransitionPage";
import CreateButton from "@/components/CreateButton";
import { useArtworks } from "./hooks";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Artwork } from "./types";
import { formDateTimeToString } from "@/app/libs/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const ArtworkPage = () => {
  const router = useRouter();

  const { isLoading, data } = useArtworks();
  const artworks = data?.list ?? [];

  const columns: ColumnDef<Artwork>[] = [
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "images",
      header: "Images",
      cell: (row) => {
        const img = row?.row?.original?.images?.[0]?.url ?? "/file.svg";

        return (
          <Image
            src={img}
            alt={row?.row?.original?.title}
            width="32"
            height="32"
          />
        );
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: (row) => row?.row?.original?.subject?.name,
    },
    {
      accessorKey: "materials",
      header: "Materials",
      cell: (row) => {
        return (
          <div className="flex flex-no-wrap gap-1">
            {row?.row?.original?.materials.map((m) => (
              <Badge key={m.id}>{m.name}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "completedAt",
      header: "Completed Year",
      cell: (row) =>
        formDateTimeToString(row?.row?.original?.completedAt, {
          format: "YYYY",
        }),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated at",
      cell: (row) => formDateTimeToString(row?.row?.original?.updatedAt),
    },
    // {
    //   id: "action",
    //   cell: (row) => {
    //     return (
    //       <TableActionCell
    //         isUpdating={isUpdating}
    //         isDeleting={isDeleting}
    //         onEdit={() => handleEditClick(row.row.original)}
    //         onDelete={async () => handleDeleteClick(row.row.original.id)}
    //       />
    //     );
    //   },
    // },
  ];

  return (
    <TransitionPage>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={artworks}
        toolbars={[
          <CreateButton
            key="create-btn"
            onClick={() => router.push("/dashboard/artworks/create")}
          />,
        ]}
      />
    </TransitionPage>
  );
};

export default ArtworkPage;
