"use server"
import Bcrypt from "@/app/libs/bcrypt";
import { ServerActionResponse } from "@/app/libs/errors";
import prisma from "@/app/libs/prisma";
import type { Artist } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getArtist = async () => {
  try {
    return await prisma.artist.findFirst();
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const updateArtist = async (id: string, data: Omit<Artist, "id" | "password" | "createdAt" | "updatedAt">): Promise<ServerActionResponse<Omit<Artist, "password">>> => {
  try {
    const updated = await prisma.artist.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/artists");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updated;

    return rest;
  } catch (e) {
    console.log("update artist failed,", e);
    return { error: `Error updating artist, ${JSON.stringify(e)}` };
  }
}

export const updateArtistPassword = async (id: string, oldPassword: string, newPassword: string): Promise<ServerActionResponse<boolean>> => {
  try {
    const artist = await prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return false;
    }

    const isPasswordValid = await Bcrypt.comparePassword(oldPassword, artist.password);

    if (!isPasswordValid) {
      return { error: "Old password is incorrect" };
    }

    const newHashedPassword = await Bcrypt.hashPassword(newPassword);

    await prisma.artist.update({
      where: { id },
      data: { password: newHashedPassword }
    });

    return true;
  } catch (e) {
    console.log("update password failed,", e);
    return { error: `Error updating password, ${JSON.stringify(e)}` };
  }
}