import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  queryKey: string[];
  url: string;
};

const useAppQuery = <TData,>({ queryKey, url }: Props) => {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const response = await axios<TData>(url);
      return response.data;
    },
  });
};

export default useAppQuery;
