import { NextResponse } from "next/server";

import prisma from "@/app/libs/prisma";
import { Artist } from "@/app/dashboard/artists/types";
import { handleApiError } from "@/app/libs/utils";

export async function GET() {
  try {
    const artist = await prisma.artist.findFirst();

    return NextResponse.json<Artist | null>(artist);
  } catch (e) {
    console.error("get artist error", e);
    return handleApiError(e);
  }
}