'use server';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

const config = {
  cloud_name: process.env.FILE_STORAGE_NAME,
  api_key: process.env.FILE_STORAGE_API_KEY,
  api_secret: process.env.FILE_STORAGE_API_SECRET,
};

const options: UploadApiOptions = {
  folder: 'tech-hack-artsite',
  resource_type: 'auto', // Automatically detect file type
};

cloudinary.config(config);

export const uploadFile = async (file: File) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<
      UploadApiResponse | UploadApiErrorResponse | undefined
    >((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            ...options,
            filename_override: file.name.split('.')[0],
            format: file.name.split('.').pop(),
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    return result;
  } catch (e) {
    console.error('upload error:', e);
    throw new Error('Failed to upload file');
  }
};

export const deleteFile = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
