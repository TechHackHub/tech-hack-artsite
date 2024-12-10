import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.prismaObject("Achievement", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    year: t.expose("year", { type: "DateTime" }),
    category: t.expose("category", { type: AchievementCategory }),
    subcategory: t.expose("subcategory", { type: AchievementSubcategory, nullable: true }),
    organization: t.exposeString("organization"),
    location: t.exposeString("location"),
    publish: t.exposeBoolean("publish"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
})

export const AchievementCategory = builder.enumType("AchievementCategory", {
  values: ["Exhibition", "Award", "Collection"] as const,
});

export const AchievementSubcategory = builder.enumType("AchievementSubcategory", {
  values: ["Solo", "Group"] as const,
});

builder.queryField('getAchievement', (t) => t.prismaField({
  type: 'Achievement',
  args: { id: t.arg.string({ required: true }) },
  resolve: async (parent, _, args) => await prisma.achievement.findUnique({
    where: { id: args.id }
  })
}));

builder.queryField('getAchievements', (t) => t.prismaConnection({
  type: 'Achievement',
  cursor: 'id',
  args: {
    year: t.arg.int({ required: false }),
    categories: t.arg({ type: [AchievementCategory], required: false }),
    subcategories: t.arg({ type: [AchievementSubcategory], required: false })
  },
  resolve: async (query, _, args) => {
    const whereCondition = {
      ...(args.year ? {
        year: {
          gte: new Date(args.year, 0, 1),
          lt: new Date(args.year + 1, 0, 1)
        }
      } : {}),
      ...(args.categories ? {
        category: {
          in: args.categories
        }
      } : {}),
      ...(args.subcategories ? {
        subcategory: {
          in: args.subcategories
        }
      } : {})
    };

    const items = await prisma.achievement.findMany({
      ...query,
      where: whereCondition,
      orderBy: { updatedAt: 'desc' }
    });

    return items
  }
}));