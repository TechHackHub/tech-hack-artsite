import { useMutation } from "@tanstack/react-query";
import { UploadResult } from "@/app/api/types";

const useFileUpload = () => {
  const uploadFile = async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });

    return response.json();
  };

  return useMutation({
    mutationFn: uploadFile,
  });
};

export default useFileUpload;
