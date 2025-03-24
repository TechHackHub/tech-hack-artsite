import prisma from '@/app/libs/prisma';
import { builder } from '../builder';

builder.prismaObject('Subject', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    artworks: t.relation('Artwork'),
  }),
});

builder.queryField('getSubjects', (t) =>
  t.prismaConnection({
    type: 'Subject',
    cursor: 'id',
    resolve: async (query) =>
      await prisma.subject.findMany({
        ...query,
        orderBy: { updatedAt: 'desc' },
      }),
  }),
);

async function checkSubjectExisting(name: string, id?: string | null) {
  const existingEntry = await prisma.subject.findFirst({ where: { name } });

  if (existingEntry && (!id || existingEntry.id !== id)) {
    throw new Error(`Subject name <${name}> already exists`);
  }
}

builder.mutationField('createSubject', (t) =>
  t.prismaField({
    type: 'Subject',
    authScopes: { isLogin: true },
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args) => {
      const { name } = args;

      await checkSubjectExisting(name);

      return await prisma.subject.create({ ...query, data: { name } });
    },
  }),
);

builder.mutationField('updateSubject', (t) =>
  t.prismaField({
    type: 'Subject',
    authScopes: { isLogin: true },
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args) => {
      const { id, name } = args;

      await checkSubjectExisting(name, id);

      return await prisma.subject.update({
        ...query,
        where: { id },
        data: { name },
      });
    },
  }),
);

builder.mutationField('deleteSubject', (t) =>
  t.prismaField({
    type: 'Subject',
    authScopes: { isLogin: true },
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _, args) => {
      const { id } = args;

      const containArtworks = await prisma.subject.findFirst({
        where: { Artwork: { some: {} } },
      });

      if (containArtworks) {
        throw new Error(
          'Cannot be deleted, the subject data is used by artworks',
        );
      }

      return await prisma.subject.delete({ ...query, where: { id } });
    },
  }),
);
