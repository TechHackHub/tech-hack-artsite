import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.prismaObject("Material", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    artwork: t.relation("Artwork", { nullable: true }),
  }),
});

builder.queryField('getMaterials', (t) => t.prismaConnection({
  type: 'Material',
  cursor: 'id',
  resolve: async (query) => await prisma.material.findMany({
    ...query,
    orderBy: { updatedAt: 'desc' }
  })
}));