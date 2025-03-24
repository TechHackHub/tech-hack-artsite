import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { RouteParams } from '@/app/api/types';
import { validateIdParamExistsAsync } from '@/app/libs/validations';
import { handleApiError, verifyEntityExists } from '@/app/libs/utils';
import { validateArtworkBodyAsync } from '../validations';

export const GET = async (req: Request, { params }: RouteParams) => {
  try {
    const routeParams = await params;
    await validateIdParamExistsAsync(routeParams);

    const { id } = routeParams;
    await verifyEntityExists('artwork', id);

    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, name: true } },
        materials: { select: { id: true, name: true } },
        images: true,
      },
    });

    return NextResponse.json(artwork);
  } catch (e) {
    console.error('delete error', e);
    return handleApiError(e);
  }
};

export const PUT = async (req: Request, { params }: RouteParams) => {
  try {
    const routeParams = await params;
    await validateIdParamExistsAsync(routeParams);

    const body = await req.json();
    await validateArtworkBodyAsync(body);

    const { id } = routeParams;
    await verifyEntityExists('artwork', id);

    const { subjectId, materialIds, images, ...rest } = body;

    let createData = {
      materials: {
        connect: materialIds.map((id: string) => ({ id })),
      },
      images: {
        create: images,
      },
      ...rest,
    };

    if (subjectId) {
      createData = {
        ...createData,
        subject: {
          connect: { id: subjectId },
        },
      };
    }

    const artworkd = await prisma.artwork.update({
      where: { id },
      data: createData,
    });

    return NextResponse.json({ data: artworkd });
  } catch (e) {
    console.error('update error', e);
    return handleApiError(e);
  }
};

export const DELETE = async (req: Request, { params }: RouteParams) => {
  try {
    const routeParams = await params;
    await validateIdParamExistsAsync(routeParams);

    const { id } = routeParams;

    await verifyEntityExists('artwork', id);

    await prisma.artwork.delete({ where: { id } });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    console.error('delete error', e);
    return handleApiError(e);
  }
};
