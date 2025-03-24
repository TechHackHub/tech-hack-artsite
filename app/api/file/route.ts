import { NextResponse } from 'next/server';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { UploadResult } from '../types';

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

const uploadToCloud = async (file: File) => {
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
};

const deleteFromCloud = async (id: string) => {
  const result = await cloudinary.uploader.destroy(id);
  return result;
};

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 },
      );
    }

    const result = await uploadToCloud(file);

    const uploadedFile: UploadResult = {
      url: result?.secure_url,
      publicId: result?.public_id,
      originalFilename: result?.original_filename,
      format: result?.format,
      width: result?.width,
      height: result?.height,
    };

    return NextResponse.json(uploadedFile, { status: 201 });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json(
      { message: 'File upload failed' },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ status: 404 });
    }

    const result = await deleteFromCloud(id);

    if (result.result === 'ok') {
      return NextResponse.json({ status: 204 });
    }

    return NextResponse.json(
      { message: 'File delete failed' },
      { status: 400 },
    );
  } catch (e) {
    console.error('delete error', e);
    return NextResponse.json(
      { message: 'File delete failed' },
      { status: 500 },
    );
  }
};
