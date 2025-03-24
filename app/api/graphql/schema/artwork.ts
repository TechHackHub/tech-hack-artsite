import prisma from '@/app/libs/prisma';
import { builder } from '../builder';

builder.prismaObject('Artwork', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    materials: t.relation('materials'),
    subject: t.relation('subject', { nullable: true }),
    width: t.exposeFloat('width'),
    height: t.exposeFloat('height'),
    depth: t.exposeFloat('depth'),
    description: t.exposeString('description'),
    completedAt: t.expose('completedAt', { type: 'DateTime' }),
    publish: t.exposeBoolean('publish'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    showOnCarousel: t.exposeBoolean('showOnCarousel'),
  }),
});

const CreateArtworkInput = builder.inputType('CreateArtworkInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    materials: t.stringList({ required: true }),
    subject: t.string(),
    width: t.float({ required: true }),
    height: t.float({ required: true }),
    depth: t.float({ required: true }),
    description: t.string({ defaultValue: '' }),
    completedAt: t.string({ required: true }),
    publish: t.boolean({ defaultValue: false }),
    showOnCarousel: t.boolean({ defaultValue: false }),
  }),
});

const UpdateArtworkInput = builder.inputType('UpdateArtworkInput', {
  fields: (t) => ({
    title: t.string(),
    materials: t.stringList(),
    subject: t.string(),
    width: t.float(),
    height: t.float(),
    depth: t.float(),
    description: t.string(),
    completedAt: t.string(),
    publish: t.boolean(),
    showOnCarousel: t.boolean(),
  }),
});

builder.queryField('getArtwork', (t) =>
  t.prismaField({
    type: 'Artwork',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_query, _, args) =>
      await prisma.artwork.findUnique({
        where: { id: args.id },
      }),
  }),
);

builder.queryField('getArtworks', (t) =>
  t.prismaConnection({
    type: 'Artwork',
    cursor: 'id',
    args: {
      year: t.arg.int({ required: false }),
    },
    resolve: async (query, _, args) => {
      const whereCondition = args.year
        ? {
            completedAt: {
              gte: new Date(args.year, 0, 1),
              lt: new Date(args.year + 1, 0, 1),
            },
          }
        : {};

      const items = await prisma.artwork.findMany({
        ...query,
        where: whereCondition,
        orderBy: { updatedAt: 'desc' },
      });

      return items;
    },
  }),
);

builder.mutationField('createArtwork', (t) =>
  t.prismaField({
    type: 'Artwork',
    authScopes: { isLogin: true },
    args: {
      input: t.arg({ type: CreateArtworkInput, required: true }),
    },
    resolve: async (query, _, args) => {
      const { input } = args;
      return await prisma.artwork.create({
        ...query,
        data: {
          title: input.title,
          materials: {
            connect: input.materials.map((materialId) => ({ id: materialId })),
          },
          ...(input?.subject && {
            subject: {
              connect: { id: input.subject },
            },
          }),
          width: input.width,
          height: input.height,
          depth: input.depth,
          description: input.description ?? '',
          completedAt: new Date(input.completedAt), // Ensure this is a Date object
          publish: input.publish ?? false,
          showOnCarousel: input.showOnCarousel ?? false,
        },
      });
    },
  }),
);

builder.mutationField('updateArtwork', (t) =>
  t.prismaField({
    type: 'Artwork',
    authScopes: { isLogin: true },
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateArtworkInput, required: true }),
    },
    resolve: async (query, _, args) => {
      const { id, input } = args;

      const artwork = await prisma.artwork.findFirst({ where: { id } });

      if (!artwork) {
        throw new Error('Artwork not found');
      }

      return await prisma.artwork.update({
        ...query,
        where: { id },
        data: {
          title: input?.title ?? artwork.title,
          ...(input?.materials && {
            materials: {
              set: input.materials.map((materialId) => ({ id: materialId })),
            },
          }),
          ...(input?.subject && {
            subject: { connect: { id: input.subject } },
          }),
          width: input?.width ?? artwork.width,
          height: input?.height ?? artwork.height,
          depth: input?.depth ?? artwork.depth,
          description: input?.description ?? artwork?.description,
          completedAt: input?.completedAt
            ? new Date(input.completedAt)
            : artwork?.completedAt,
          publish: input?.publish ?? artwork?.publish,
          showOnCarousel: input?.showOnCarousel ?? artwork.showOnCarousel,
        },
      });
    },
  }),
);

builder.mutationField('publishArtworks', (t) =>
  t.int({
    authScopes: { isLogin: true },
    args: {
      publish: t.arg.boolean({ required: true }),
      ids: t.arg.idList({ required: true }),
    },
    resolve: async (_, args) => {
      const { publish, ids } = args;

      const result = await prisma.artwork.updateMany({
        where: { id: { in: ids } },
        data: { publish },
      });

      return result.count;
    },
  }),
);

builder.mutationField('deleteArtwork', (t) =>
  t.prismaField({
    type: 'Artwork',
    authScopes: { isLogin: true },
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _, args) => {
      const { id } = args;
      return await prisma.artwork.delete({ ...query, where: { id } });
    },
  }),
);
