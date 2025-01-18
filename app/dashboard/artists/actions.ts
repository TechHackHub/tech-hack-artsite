"use server"
import prisma from "@/app/libs/prisma";

export const getArtist = async () => {
  try {
    return await prisma.artist.findFirst();
  } catch (e) {
    console.log(e);
    return null;
  }
}