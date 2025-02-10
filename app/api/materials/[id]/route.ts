import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>
};


export const PUT = async (req: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 });
    }

    const isMaterialExist = await prisma.material.findUnique({ where: { id } });

    if (!isMaterialExist) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }

    const { name } = await req.json();

    const material = await prisma.material.update({ where: { id }, data: { name } });

    return NextResponse.json({ data: material });
  } catch (e) {
    console.error("update error", e);
    return NextResponse.json({ message: 'Material update failed' }, { status: 500 });
  }
}


export const DELETE = async (req: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 });
    }

    const isMaterialExist = await prisma.material.findUnique({ where: { id } });

    if (!isMaterialExist) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }

    await prisma.material.delete({ where: { id } });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    console.error("delete error", e);
    return NextResponse.json({ message: 'Material delete failed' }, { status: 500 });
  }
}