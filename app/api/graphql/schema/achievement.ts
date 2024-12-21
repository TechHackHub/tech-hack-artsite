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

const CreateAchievementkInput = builder.inputType('CreateAchievementkInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    year: t.string({ required: true }),
    category: t.field({ type: AchievementCategory, required: true }),
    subcategory: t.field({ type: AchievementSubcategory }),
    organization: t.string(),
    location: t.string(),
    publish: t.boolean({ defaultValue: false }),
  }),
});

const UpdateAchievementkInput = builder.inputType('UpdateAchievementkInput', {
  fields: (t) => ({
    title: t.string(),
    year: t.string(),
    category: t.field({ type: AchievementCategory }),
    subcategory: t.field({ type: AchievementSubcategory }),
    organization: t.string(),
    location: t.string(),
    publish: t.boolean(),
  }),
});

builder.queryField('getAchievement', (t) => t.prismaField({
  type: 'Achievement',
  args: { id: t.arg.string({ required: true }) },
  resolve: async (_query, _, args) => await prisma.achievement.findUnique({
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

builder.queryField('createAchievement', (t) => t.prismaField({
  type: 'Achievement',
  authScopes: { isLogin: true },
  args: {
    input: t.arg({ type: CreateAchievementkInput, required: true })
  },
  resolve: async (query, _, args) => {
    const { input } = args;
    return await prisma.achievement.create({
      ...query,
      data: {
        title: input.title,
        year: input.year,
        category: input.category,
        subcategory: input.subcategory,
        organization: input?.organization ?? "",
        location: input?.location ?? "",
        publish: input?.publish ?? false
      }
    });
  }
}));

builder.queryField('updateAchievement', (t) => t.prismaField({
  type: 'Achievement',
  authScopes: { isLogin: true },
  args: {
    id: t.arg.id({ required: true }),
    input: t.arg({ type: UpdateAchievementkInput, required: true })
  },
  resolve: async (query, _, args) => {
    const { id, input } = args;

    const achievement = await prisma.achievement.findFirst({ where: { id } });

    if (!achievement) {
      throw new Error('Achievement not found');
    }

    return await prisma.achievement.update({
      ...query,
      where: { id },
      data: {
        title: input?.title ?? achievement.title,
        year: input?.year ?? achievement.year,
        category: input?.category ?? achievement.category,
        subcategory: input?.subcategory ?? achievement.subcategory,
        organization: input?.organization ?? achievement.organization,
        location: input?.location ?? achievement.location,
        publish: input?.publish ?? achievement.publish
      }
    });
  }
}));

builder.mutationField('publishAchievements', (t) => t.int({
  authScopes: { isLogin: true },
  args: {
    publish: t.arg.boolean({ required: true }),
    ids: t.arg.idList({ required: true }),
  },
  resolve: async (_, args) => {
    const { publish, ids } = args;

    const result = await prisma.achievement.updateMany({
      where: { id: { in: ids } },
      data: { publish }
    });

    return result.count;
  },
}));

builder.mutationField('deleteAchievement', (t) => t.prismaField({
  type: 'Achievement',
  authScopes: { isLogin: true },
  args: { id: t.arg.id({ required: true }) },
  resolve: async (query, _, args) => {
    const { id } = args;
    return await prisma.achievement.delete({ ...query, where: { id } });
  }
}));