"use client";

import { toast } from "sonner";
import { Material } from "@/app/api/materials/route";
import useAppQuery from "@/app/libs/hooks/useAppQuery";
import useAppMutation from "@/app/libs/hooks/useAppMutation";

const QUERY_KEY = "materials";

export const useMaterials = () => {
  return useAppQuery<{ list: Material[] }>({
    queryKey: [QUERY_KEY],
    url: "/api/materials/",
  });
};

export const useCreateMaterial = () => {
  return useAppMutation<Material, Pick<Material, "name">>({
    method: "POST",
    url: "/api/materials/",
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Material created");
    },
  });
};

export const useUpdateMaterial = () => {
  return useAppMutation<Material, Pick<Material, "name">, { id: string }>({
    method: "PUT",
    url: ({ id }) => `/api/materials/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Material updated");
    },
  });
};

export const useDeleteMaterial = () => {
  return useAppMutation<void, void, { id: string }>({
    method: "DELETE",
    url: ({ id }) => `/api/materials/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Material deleted");
    },
  });
};
