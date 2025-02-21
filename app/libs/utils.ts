import dayjs from "dayjs";
import prisma from "./prisma";
import { NextResponse } from 'next/server';
import * as yup from "yup";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors";

export const formDateTimeToString = (date?: Date): string => {
  if (!date) {
    return "";
  }

  return dayjs(date).format("YYYY-MM-DD HH:mm");
};


export const verifyEntityExists = async (entity: "artist" | "subject" | "material" | "artwork" | "achievement", id: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const found = await (prisma[entity] as any).findUnique({ where: { id } });

  if (!found) {
    throw new NotFoundError(entity);
  }
}

export const handleApiError = (error: unknown) => {
  console.error("API Error:", error);

  if (error instanceof yup.ValidationError) {
    return NextResponse.json(
      {
        message: error?.message ?? "Validation failed",
        errors: error.errors
      },
      { status: 400 }
    );
  }

  if (error instanceof BadRequestError) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      { message: error.message },
      { status: 404 }
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { message: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
};