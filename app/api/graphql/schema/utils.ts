import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.queryField('getYears', (t) => t.field({
  type: ['Int'],
  args: {
    type: t.arg.string({ required: true })
  },
  resolve: async (_, args: { type: string }) => {
    if (args.type === 'artwork') {
      const years = await prisma.artwork.findMany({
        select: { completedAt: true },
        orderBy: { updatedAt: 'desc' }
      }).then(years => [...new Set(years.map(year => new Date(year.completedAt).getFullYear()))]);

      return years;
    } else if (args.type === 'achievement') {
      const years = await prisma.achievement.findMany({
        distinct: ['year'],
        select: { year: true },
        orderBy: { updatedAt: 'desc' }
      });
      return years.map(year => new Date(year.year).getFullYear());
    } else {
      throw new Error('Invalid type. Please use "artwork" or "achievement".');
    }
  }
}));