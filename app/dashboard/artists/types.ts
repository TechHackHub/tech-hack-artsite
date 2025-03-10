import { type Artist as PrismaArtist } from "@prisma/client";


export type Artist = PrismaArtist;

export type UpdateArtist = Partial<
  Omit<Artist, "id" | "createdAt" | "updatedAt">
> & {
  oldPassword?: string;
  newPassword?: string;
};