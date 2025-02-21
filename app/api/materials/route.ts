import { NextResponse } from "next/server";

import prisma from "@/app/libs/prisma";
import { handleApiError } from "@/app/libs/utils";
import { validateSubjectBodyAsync } from "../subjects/validations";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ list: materials });
  } catch (e) {
    console.error("get materials error", e);
    return handleApiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await validateSubjectBodyAsync(body);

    const { name } = body;

    const material = await prisma.material.create({
      data: { name },
    });

    return NextResponse.json({ data: material });
  } catch (e) {
    console.error("create material error", e);
    return handleApiError(e);
  }
}