import { type Material as PrismaMaterial } from '@prisma/client';

export type Material = Omit<PrismaMaterial, 'artworkId'>;
