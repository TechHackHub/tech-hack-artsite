"use client";

import { toast } from "sonner";
import useAppQuery from "@/app/libs/hooks/useAppQuery";
import useAppMutation from "@/app/libs/hooks/useAppMutation";
import { Subject } from "./types";

const QUERY_KEY = "subjects";

export const useSubjects = () => {
  return useAppQuery<{ list: Subject[] }>({
    queryKey: [QUERY_KEY],
    url: "/api/subjects/",
  });
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
