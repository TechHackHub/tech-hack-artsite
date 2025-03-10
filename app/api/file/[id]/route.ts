import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const config = {
  cloud_name: process.env.FILE_STORAGE_NAME,
  api_key: process.env.FILE_STORAGE_API_KEY,
  api_secret: process.env.FILE_STORAGE_API_SECRET,
}

cloudinary.config(config);


const deleteFromCloud = async (id: string) => {
  const result = await cloudinary.uploader.destroy(id);
  return result;
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ status: 404 });
    }

    const result = await deleteFromCloud(id)

    console.log('delete result', result);

    if (result.result === 'ok') {
      return NextResponse.json({ status: 204 });
    }

    return NextResponse.json({ message: 'File delete failed' }, { status: 400 });
  } catch (e) {
    console.error("delete error", e);
    return NextResponse.json({ message: 'File delete failed' }, { status: 500 });
  }
}