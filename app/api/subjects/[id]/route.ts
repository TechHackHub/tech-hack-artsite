import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { RouteParams } from '@/app/api/types';


export const PUT = async (req: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 });
    }

    const isSubjectExist = await prisma.subject.findUnique({ where: { id } });

    if (!isSubjectExist) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }

    const { name } = await req.json();

    const subject = await prisma.subject.update({ where: { id }, data: { name } });

    return NextResponse.json({ data: subject });
  } catch (e) {
    console.error("update error", e);
    return NextResponse.json({ message: 'Subject update failed' }, { status: 500 });
  }
}


export const DELETE = async (req: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 });
    }

    const isSubjectExist = await prisma.subject.findUnique({ where: { id } });

    if (!isSubjectExist) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }

    await prisma.subject.delete({ where: { id } });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    console.error("delete error", e);
    return NextResponse.json({ message: 'Subject delete failed' }, { status: 500 });
  }
}