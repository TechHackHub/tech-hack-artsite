import { UploadFile } from '@/app/api/types';

export type Artwork = {
  id: string;
  title: string;
  materials: { id: string; name: string }[];
  subject: { id: string; name: string } | null;
  images: UploadFile[];
  width: number | null;
  height: number | null;
  depth: number | null;
  description: string;
  completedAt: Date;
  publish: boolean;
  showOnCarousel: boolean;
  createdAt: Date;
  updatedAt: Date;
};
