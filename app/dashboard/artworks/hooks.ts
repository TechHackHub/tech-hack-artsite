"use client";

import useAppQuery from "@/app/libs/hooks/useAppQuery";
import useAppMutation from "@/app/libs/hooks/useAppMutation";
import { Artwork } from "./types";
import { toast } from "sonner";
import { ArtworkFormType } from "@/app/api/artworks/validations";

const QUERY_KEY = "artworks";

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
