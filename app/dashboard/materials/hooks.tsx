'use client';

import { toast } from 'sonner';
import useAppQuery from '@/app/libs/hooks/useAppQuery';
import useAppMutation from '@/app/libs/hooks/useAppMutation';
import { Material } from './types';
import { Option } from '../types';

const QUERY_KEY = 'materials';

export const useMaterials = () => {
  return useAppQuery<{ list: Material[] }>({
    queryKey: [QUERY_KEY],
    url: '/api/materials/',
  });
};

export const useMaterialOptions = () => {
  const { isLoading, data } = useMaterials();

  const options: Option[] =
    data?.list.map((material) => ({
      label: material.name,
      value: material.id,
    })) || [];

  return { isLoading, options };
};

export const useCreateMaterial = () => {
  return useAppMutation<Material, Pick<Material, 'name'>>({
    method: 'POST',
    url: '/api/materials/',
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error('Material created');
    },
  });
};

export const useUpdateMaterial = () => {
  return useAppMutation<Material, Pick<Material, 'name'>, { id: string }>({
    method: 'PUT',
    url: ({ id }) => `/api/materials/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error('Material updated');
    },
  });
};

export const useDeleteMaterial = () => {
  return useAppMutation<void, void, { id: string }>({
    method: 'DELETE',
    url: ({ id }) => `/api/materials/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error('Material deleted');
    },
  });
};
