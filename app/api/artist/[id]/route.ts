import Bcrypt from '@/app/libs/bcrypt';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { RouteParams } from '@/app/api/types';
import { handleApiError, verifyEntityExists } from '@/app/libs/utils';
import { validateIdParamExistsAsync } from '@/app/libs/validations';
import { validateSubjectBodyAsync } from '../../subjects/validations';
import { BadRequestError } from '@/app/libs/errors';

const handlePasswordUpdate = async (
  oldPassword: string,
  newPassword: string,
  currentPassword: string
): Promise<{ password: string } | null> => {
  const isPasswordValid = await Bcrypt.comparePassword(oldPassword, currentPassword);

  if (!isPasswordValid) {
    throw new BadRequestError('Old password is incorrect');
  }

  const newHashedPassword = await Bcrypt.hashPassword(newPassword);
  return { password: newHashedPassword };
}


export const PUT = async (req: Request, { params }: RouteParams) => {
  try {
    const routeParams = await params;
    await validateIdParamExistsAsync(routeParams);

    const body = await req.json();
    await validateSubjectBodyAsync(body);

    const { id } = routeParams;
    await verifyEntityExists("artist", id);

    const artist = await prisma.artist.findUniqueOrThrow({ where: { id } });

    const { oldPassword, newPassword, ...rest } = body;
    let data = rest;

    if (oldPassword && newPassword) {
      data = await handlePasswordUpdate(oldPassword, newPassword, artist.password);
    }

    const updatedArtist = await prisma.artist.update({
      where: { id },
      data
    });

    return NextResponse.json({ data: updatedArtist });
  } catch (e) {
    console.error("update error", e);
    return handleApiError(e);
  }
}