import { NextResponse } from "next/server";

import prisma from "@/app/libs/prisma";

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
    return NextResponse.json({ message: "Get materials failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const material = await prisma.material.create({
      data: { name },
    });

    return NextResponse.json({ data: material });
  } catch (e) {
    console.error("create material error", e);
    return NextResponse.json({ message: "Create material failed" }, { status: 500 });
  }
}