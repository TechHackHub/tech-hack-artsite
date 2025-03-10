"use client";

import useAppQuery from "@/app/libs/hooks/useAppQuery";
import useAppMutation from "@/app/libs/hooks/useAppMutation";
import { Artwork } from "./types";
import { toast } from "sonner";
import { ArtworkFormType } from "@/app/api/artworks/validations";

const QUERY_KEY = "artworks";

export const useArtwork = (id: string) => {
  return useAppQuery<Artwork>({
    queryKey: [QUERY_KEY, id],
    url: `/api/artworks/${id}`,
  });
}


export const useArtworks = () => {
  return useAppQuery<{ list: Artwork[] }>({
    queryKey: [QUERY_KEY],
    url: "/api/artworks/",
  });
};

export const useCreateArtwork = () => {
  return useAppMutation<Artwork, ArtworkFormType>({
    method: "POST",
    url: "/api/artworks/",
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Artwork created");
    },
  });
};

export const useUpdateArtwork = () => {
  return useAppMutation<Artwork, ArtworkFormType, { id: string }>({
    method: "PUT",
    url: ({ id }) => `/api/artworks/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Artwork updated");
    },
  });
}

export const useDeleteArtwork = () => {
  return useAppMutation<Artwork, void, { id: string }>({
    method: "DELETE",
    url: ({ id }) => `/api/artworks/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Artwork deleted");
    },
  });
}