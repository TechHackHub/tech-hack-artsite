import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";
import { handleApiError } from "@/app/libs/utils";
import { validateSubjectBodyAsync } from "./validations";


export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ list: subjects });
  } catch (e) {
    console.log("get subjects error", e);
    return handleApiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await validateSubjectBodyAsync(body);

    const { name } = body;

    // TODO: check duplicate name;

    const subject = await prisma.subject.create({
      data: { name }
    });

    return NextResponse.json({ data: subject });
  } catch (e) {
    console.error("create subject error", e);
    return handleApiError(e);
  }
}