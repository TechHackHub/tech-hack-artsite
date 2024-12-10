import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.prismaObject("Subject", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    artworks: t.relation("Artwork"),
  }),
});

builder.queryField('getSubjects', (t) => t.prismaConnection({
  type: 'Subject',
  cursor: 'id',
  resolve: async (query) => await prisma.subject.findMany({
    ...query,
    orderBy: { updatedAt: 'desc' }
  })
}));