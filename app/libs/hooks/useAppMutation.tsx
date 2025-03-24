import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props<TData, TParams = void> = {
  method?: 'POST' | 'PUT' | 'DELETE';
  url: string | ((params: TParams) => string);
  invalidateQueries?: string[];
  showErrorToast?: boolean;
  onSuccess?: (data: TData) => Promise<unknown> | unknown;
  onError?: (error: AxiosError) => Promise<unknown>;
};

const useAppMutation = <TData, TVariables, TParams = void>({
  method = 'POST',
  url,
  invalidateQueries,
  showErrorToast = true,
  onSuccess,
  onError,
}: Props<TData, TParams>) => {
  const queryClient = useQueryClient();

  const defaultRequest = async ({
    data,
    params,
  }: {
    data?: TVariables;
    params?: TParams;
  }) => {
    const finalUrl = typeof url === 'function' ? url(params!) : url;

    const response = await axios<TData>(finalUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    });

    return response.data;
  };

  return useMutation<
    TData,
    AxiosError<{ message?: string }>,
    { data?: TVariables; params?: TParams }
  >({
    mutationFn: defaultRequest,
    onSuccess: (data) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries(invalidateQueries);
      }

      onSuccess?.(data);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.log(error);

      const message = error?.response?.data?.message ?? error?.message;

      if (showErrorToast) {
        toast.error(message);
      }

      onError?.(error);
    },
  });
};

export default useAppMutation;
