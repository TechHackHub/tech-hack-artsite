import prisma from "@/app/libs/prisma";
import { builder } from "../builder";

builder.prismaObject("Artist", {
  fields: (t) => ({
    id: t.exposeID("id"),
    avatar: t.exposeString("avatar"),
    name: t.exposeString("name"),
    born: t.exposeString("born"),
    educations: t.exposeStringList("educations"),
    description: t.exposeString("description"),
    email: t.exposeString("email"),
    phone: t.exposeString("phone", { nullable: true }),
    facebookUrl: t.exposeString("facebookUrl", { nullable: true }),
    IGUrl: t.exposeString("IGUrl", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

builder.queryField('getArtist', (t) => t.prismaField({
  type: 'Artist',
  resolve: async () => await prisma.artist.findFirst()
}));

const UpdateArtistInput = builder.inputType('UpdateArtistInput', {
  fields: (t) => ({
    avatar: t.string(),
    name: t.string(),
    born: t.string(),
    educations: t.stringList(),
    description: t.string(),
    email: t.string(),
    phone: t.string(),
    facebookUrl: t.string(),
    IGUrl: t.string(),
  }),
});

builder.mutationField('updateArtist', (t) => t.prismaField({
  type: 'Artist',
  args: {
    input: t.arg({ type: UpdateArtistInput, required: true })
  },
  resolve: async (parent, _, args) => {
    const { input } = args;

    const artist = await prisma.artist.findFirst();

    if (!artist) {
      throw new Error('Artist not found');
    }

    return await prisma.artist.update({
      where: { id: artist.id },
      data: {
        avatar: input?.avatar ?? artist.avatar,
        name: input.name ?? artist.name,
        born: input.born ?? artist.born,
        educations: input.educations ?? artist.educations,
        description: input.description ?? artist.description,
        email: input.email ?? artist.email,
        phone: input.phone ?? artist.phone,
        facebookUrl: input.facebookUrl ?? artist.facebookUrl,
        IGUrl: input.IGUrl ?? artist.IGUrl,
      }
    });
  },
}));