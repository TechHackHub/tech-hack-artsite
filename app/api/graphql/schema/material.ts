import prisma from '@/app/libs/prisma';
import { builder } from '../builder';

builder.prismaObject('Material', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    artwork: t.relation('Artwork', { nullable: true }),
  }),
});

builder.queryField('getMaterials', (t) =>
  t.prismaConnection({
    type: 'Material',
    cursor: 'id',
    resolve: async (query) =>
      await prisma.material.findMany({
        ...query,
        orderBy: { updatedAt: 'desc' },
      }),
  }),
);

const checkMaterialExisting = async (name: string, id?: string | null) => {
  const existingEntry = await prisma.material.findFirst({ where: { name } });

  if (existingEntry && (!id || existingEntry.id !== id)) {
    throw new Error(`Material name <${name}> already exists`);
  }
};

builder.mutationField('createMaterial', (t) =>
  t.prismaField({
    type: 'Material',
    args: {
      name: t.arg.string({ required: true }),
    },
    authScopes: { isLogin: true },
    resolve: async (query, _, args) => {
      const { name } = args;

      await checkMaterialExisting(name);

      return await prisma.material.create({ ...query, data: { name } });
    },
  }),
);

builder.mutationField('updateMaterial', (t) =>
  t.prismaField({
    type: 'Material',
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    authScopes: { isLogin: true },
    resolve: async (query, _, args) => {
      const { id, name } = args;

      await checkMaterialExisting(name, id);

      return await prisma.material.update({
        ...query,
        where: { id },
        data: { name },
      });
    },
  }),
);

builder.mutationField('deleteMaterial', (t) =>
  t.prismaField({
    type: 'Material',
    authScopes: { isLogin: true },
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _, args) => {
      const { id } = args;

      const containArtworks = await prisma.material.findFirst({
        where: { artworkId: { not: null } },
      });

      if (containArtworks) {
        throw new Error(
          'Cannot be deleted, the material data is used by artworks',
        );
      }

      return await prisma.material.delete({ ...query, where: { id } });
    },
  }),
);
