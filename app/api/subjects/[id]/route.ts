import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { RouteParams } from '@/app/api/types';
import { handleApiError, verifyEntityExists } from '@/app/libs/utils';
import { validateIdParamExistsAsync } from '@/app/libs/validations';
import { validateSubjectBodyAsync } from '../validations';

export const PUT = async (req: Request, { params }: RouteParams) => {
  try {
    const routeParams = await params;
    await validateIdParamExistsAsync(routeParams);

    const body = await req.json();
    await validateSubjectBodyAsync(body);

    const { id } = routeParams;
    const { name } = body;

    await verifyEntityExists('subject', id);

    // TODO: check has duplicate & diff id

    const subject = await prisma.subject.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ data: subject });
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
    await verifyEntityExists('subject', id);

    // TODO: check has relative artwork

    await prisma.subject.delete({ where: { id } });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    console.error('delete error', e);
    return handleApiError(e);
  }
};
