import prisma from '@/app/libs/prisma';
import { builder } from '../builder';
import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const uploadStream = (buffer: Buffer) => {
  return new Promise<UploadApiResponse | UploadApiErrorResponse | undefined>(
    (resolve, reject) => {
      const theTransformStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'tech-hack-artsite',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const str = Readable.from(buffer);
      str.pipe(theTransformStream);
    },
  );
};

// const uploadFile = async (file: string) => {
//   cloudinary.v2.config({
//     cloud_name: process.env.FILE_STORAGE_NAME,
//     api_key: process.env.FILE_STORAGE_API_KEY,
//     api_secret: process.env.FILE_STORAGE_API_SECRET,
//   });

//   try {
//     const result = await cloudinary.v2.uploader.upload(file);

//     return {
//       filename: result.original_filename,
//       type: result.type,
//       url: result.url
//     }
//   } catch (e) {
//     console.log(e);
//     throw new Error('File upload failed')
//   }
// }

builder.queryField('getYears', (t) =>
  t.field({
    type: ['Int'],
    args: {
      type: t.arg.string({ required: true }),
    },
    resolve: async (_, args: { type: string }) => {
      if (args.type === 'artwork') {
        const years = await prisma.artwork
          .findMany({
            select: { completedAt: true },
            orderBy: { updatedAt: 'desc' },
          })
          .then((years) => [
            ...new Set(
              years.map((year) => new Date(year.completedAt).getFullYear()),
            ),
          ]);

        return years;
      } else if (args.type === 'achievement') {
        const years = await prisma.achievement.findMany({
          distinct: ['year'],
          select: { year: true },
          orderBy: { updatedAt: 'desc' },
        });
        return years.map((year) => new Date(year.year).getFullYear());
      } else {
        throw new Error('Invalid type. Please use "artwork" or "achievement".');
      }
    },
  }),
);

interface File {
  filename: string;
  type: string;
  url: string;
}

const FileRef = builder.objectRef<File>('File');

FileRef.implement({
  description: 'File upload response',
  fields: (t) => ({
    filename: t.exposeString('filename'),
    type: t.exposeString('type'),
    url: t.exposeString('url'),
  }),
});

builder.mutationField('uploadFile', (t) =>
  t.field({
    type: FileRef,
    authScopes: { isLogin: true },
    args: {
      file: t.arg({ type: 'Upload', required: true }),
    },
    resolve: async (_, { file }) => {
      const { createReadStream } = await file;
      const stream = createReadStream();
      const buffer = await streamToBuffer(stream);

      // Upload to Cloudinary
      // const result = await new Promise((resolve, reject) => {
      //   const uploadStream = cloudinary.v2.uploader.upload_stream(
      //     {
      //       folder: 'tech-hack-artsite',
      //       resource_type: 'auto',
      //     },
      //     (error, result) => {
      //       if (error) reject(error);
      //       else resolve(result);
      //     }
      //   );

      //   uploadStream.end(buffer);
      // });

      const result = await uploadStream(buffer);

      return {
        filename: result?.original_filename,
        type: result?.type,
        url: result?.url,
      };
    },
  }),
);
