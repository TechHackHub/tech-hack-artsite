'use client';

import React from 'react';
import ArtistForm from './components/ArtistForm';
import PasswordChangeForm, {
  PasswordChangeFormType,
} from './components/PasswordChangeForm';
import Loader from '@/components/Loader';
import { useArtist, useUpdateArtist } from './hooks';
import TransitionPage from '@/components/TransitionPage';
import { UpdateArtist } from './types';

const ArtistPage = () => {
  const { isLoading, data: artist } = useArtist();
  const { isLoading: isUpdating, update, updatePassword } = useUpdateArtist();

  const handleUpdateSubmit = async (
    formData: Omit<UpdateArtist, 'oldPassword' | 'newPassword'>,
  ) => {
    if (!artist?.id) return;

    await update(artist.id, formData);
  };

  const handlePasswordChangeSubmit = async (
    formData: PasswordChangeFormType,
  ): Promise<boolean> => {
    try {
      if (!artist?.id) return false;

      await updatePassword(
        artist.id,
        formData.oldpassword,
        formData.newpassword,
      );

      return true;
    } catch {
      return false;
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
