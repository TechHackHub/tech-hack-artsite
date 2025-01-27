import { useEffect, useState } from "react";
import { getArtist, updateArtist, updateArtistPassword } from "./actions";
import type { Artist } from "@prisma/client";

export const useArtist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState<Artist | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const result = await getArtist();
        setArtist(result);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, artist };
};

export const useUpdateArtist = () => {
  const [isLoading, setIsLoading] = useState(false);

  const update = async (
    id: string,
    data: Omit<Artist, "id" | "password" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsLoading(true);
      return await updateArtist(id, data);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      setIsLoading(true);
      return await updateArtistPassword(id, oldPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, update, updatePassword };
};
