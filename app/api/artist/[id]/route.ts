import Bcrypt from '@/app/libs/bcrypt';
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

    const artist = await prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    const { oldPassword, newPassword, ...rest } = await req.json();
    let data = rest;

    if (oldPassword && newPassword) {
      const isPasswordValid = await Bcrypt.comparePassword(oldPassword, artist.password);

      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Old password is incorrect' }, { status: 400 });
      }

      const newHashedPassword = await Bcrypt.hashPassword(newPassword);

      data = { password: newHashedPassword }
    }

    const updatedArtist = await prisma.artist.update({
      where: { id },
      data
    });

    return NextResponse.json({ data: updatedArtist });
  } catch (e) {
    console.error("update error", e);
    return NextResponse.json({ message: 'Artist update failed' }, { status: 500 });
  }
}