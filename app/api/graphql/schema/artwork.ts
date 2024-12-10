import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.prismaObject("Artwork", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    materials: t.relation("materials"),
    subject: t.relation("subject", { nullable: true }),
    width: t.exposeFloat("width"),
    height: t.exposeFloat("height"),
    depth: t.exposeFloat("depth"),
    description: t.exposeString("description"),
    completedAt: t.expose("completedAt", { type: "DateTime" }),
    publish: t.exposeBoolean("publish"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    showOnCarousel: t.exposeBoolean("showOnCarousel"),
  }),
});

builder.queryField('getArtwork', (t) => t.prismaField({
  type: 'Artwork',
  args: { id: t.arg.string({ required: true }) },
  resolve: async (parent, _, args) => await prisma.artwork.findUnique({
    where: { id: args.id }
  })
}));

builder.queryField('getArtworks', (t) => t.prismaConnection({
  type: 'Artwork',
  cursor: 'id',
  args: {
    year: t.arg.int({ required: false })
  },
  resolve: async (query, _, args) => {
    const whereCondition = args.year ? {
      completedAt: {
        gte: new Date(args.year, 0, 1),
        lt: new Date(args.year + 1, 0, 1)
      }
    } : {};

    const items = await prisma.artwork.findMany({
      ...query,
      where: whereCondition,
      orderBy: { updatedAt: 'desc' }
    });

    return items
  }
}));