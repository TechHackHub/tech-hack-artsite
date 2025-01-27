"use client";

import React from "react";
import { toast } from "sonner";
import ArtistForm from "@/app/ui/dashboard/ArtistForm";
import PasswordChangeForm, {
  PasswordChangeFormType,
} from "@/app/ui/dashboard/PasswordChangeForm";
import type { Artist } from "@prisma/client";
import Loader from "@/app/ui/dashboard/Loader";
import { useArtist, useUpdateArtist } from "./hooks";
import { isActionError } from "@/app/libs/errors";
import TransitionPage from "@/components/TransitionPage";

const ArtistPage = () => {
  const { isLoading, artist } = useArtist();
  const { isLoading: isUpdating, update, updatePassword } = useUpdateArtist();

  const handleUpdateSubmit = async (
    formData: Omit<Artist, "id" | "password" | "createdAt" | "updatedAt">
  ) => {
    if (!artist?.id) return;

    const updated = await update(artist.id, formData);

    if (isActionError(updated)) {
      toast.error(updated.error);
    } else {
      toast.success("Artist updated");
    }
  };

  const handlePasswordChangeSubmit = async (
    formData: PasswordChangeFormType
  ): Promise<boolean> => {
    if (!artist?.id) return false;

    const updated = await updatePassword(
      artist.id,
      formData.oldpassword,
      formData.newpassword
    );

    if (updated && isActionError(updated)) {
      toast.error(updated.error);
      return false;
    } else {
      toast.success("Password updated");
      return updated?.data ?? false;
    }
  };

  return (
    <TransitionPage>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <ArtistForm
              isLoading={isUpdating}
              artist={artist}
              onSubmit={handleUpdateSubmit}
            />
          </div>

          <div className="w-full lg:w-1/3">
            <PasswordChangeForm
              isLoading={isUpdating}
              onSubmit={handlePasswordChangeSubmit}
            />
          </div>
        </div>
      )}
    </TransitionPage>
  );
};

export default ArtistPage;
