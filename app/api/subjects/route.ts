import { NextResponse } from "next/server";

import prisma from "@/app/libs/prisma";

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
    return NextResponse.json({ message: "Get subjuects failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const subject = await prisma.subject.create({
      data: { name },
    });

    return NextResponse.json({ data: subject });
  } catch (e) {
    console.error("create subject error", e);
    return NextResponse.json({ message: "Create subject failed" }, { status: 500 });
  }
}