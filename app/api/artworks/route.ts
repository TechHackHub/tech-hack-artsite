import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { handleApiError } from '@/app/libs/utils';
import { validateArtworkBodyAsync } from './validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const showOnCarousel = searchParams.get('showOnCarousel');
    const publish = searchParams.get('publish');

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
    let where: any = {};

    if (year) {
      where.completedAt = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${parseInt(year) + 1}-01-01`),
      };
    }

    if (showOnCarousel !== null) {
      where.showOnCarousel = showOnCarousel === 'true';
    }

    if (publish !== null) {
      where.publish = publish === 'true';
    }

    const artworks = await prisma.artwork.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true } },
        materials: { select: { id: true, name: true } },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ list: artworks });
  } catch (e) {
    console.error('get artworks error', e);
    return handleApiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await validateArtworkBodyAsync(body);

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

    const artwork = await prisma.artwork.create({
      data: createData,
    });

    return NextResponse.json({ data: artwork });
  } catch (e) {
    console.error('create artwork error', e);
    return handleApiError(e);
  }
}
