import React from 'react';
import { UploadResult } from '@/app/api/types';
import { Input } from '../ui/input';
import useFileUpload from '@/app/libs/hooks/useFileUpload';

type FileUploadFieldProps = {
  label: string;
  name: string;
  accept?: string;
  onUploadSuccess?: (file: UploadResult) => void;
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept,
  onUploadSuccess,
}) => {
  const { isLoading: uploading, mutateAsync: updateFileAsync } =
    useFileUpload();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await updateFileAsync(file);

    onUploadSuccess?.(result);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Input
        type="file"
        accept={accept}
        name={name}
        multiple
        onChange={handleFileUpload}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUploadField;
