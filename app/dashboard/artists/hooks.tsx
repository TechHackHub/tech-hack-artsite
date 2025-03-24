import useAppQuery from '@/app/libs/hooks/useAppQuery';
import { Artist, UpdateArtist } from './types';
import useAppMutation from '@/app/libs/hooks/useAppMutation';
import { toast } from 'sonner';

const QUERY_KEY = 'artist';

export const useArtist = () => {
  return useAppQuery<Artist | null>({
    queryKey: [QUERY_KEY],
    url: '/api/artist/',
  });
};

export const useUpdateArtist = () => {
  const { isLoading, mutateAsync } = useAppMutation<
    Artist,
    UpdateArtist,
    { id: string }
  >({
    method: 'PUT',
    url: ({ id }) => `/api/artist/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error('Artist updated');
    },
  });

  const update = async (id: string, data: UpdateArtist) => {
    return await mutateAsync({ data, params: { id } });
  };

  const updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    return await mutateAsync({
      data: { oldPassword, newPassword },
      params: { id },
    });
  };

  return { isLoading, update, updatePassword };
};
