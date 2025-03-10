"use client";

import { toast } from "sonner";
import useAppQuery from "@/app/libs/hooks/useAppQuery";
import useAppMutation from "@/app/libs/hooks/useAppMutation";
import { Subject } from "./types";
import { Option } from "../types";

const QUERY_KEY = "subjects";

export const useSubjects = () => {
  return useAppQuery<{ list: Subject[] }>({
    queryKey: [QUERY_KEY],
    url: "/api/subjects/",
  });
};

export const useSubjectOptions = () => {
  const { isLoading, data } = useSubjects();

  const options: Option[] =
    data?.list.map((subject) => ({
      label: subject.name,
      value: subject.id,
    })) || [];

  return { isLoading, options };
};

export const useCreateSubject = () => {
  return useAppMutation<Subject, Pick<Subject, "name">>({
    method: "POST",
    url: "/api/subjects/",
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Subject created");
    },
  });
};

export const useUpdateSubject = () => {
  return useAppMutation<Subject, Pick<Subject, "name">, { id: string }>({
    method: "PUT",
    url: ({ id }) => `/api/subjects/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Subject updated");
    },
  });
};

export const useDeleteSubject = () => {
  return useAppMutation<void, void, { id: string }>({
    method: "DELETE",
    url: ({ id }) => `/api/subjects/${id}`,
    invalidateQueries: [QUERY_KEY],
    onSuccess: () => {
      toast.error("Subject deleted");
    },
  });
};
