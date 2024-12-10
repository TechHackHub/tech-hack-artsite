import prisma from "@/app/libs/prisma";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { Prisma } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";
import RelayPlugin from '@pothos/plugin-relay';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relay: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf
  }
});

builder.addScalarType("DateTime", DateTimeResolver, {});

// register query and mutation entry point
builder.queryType({});
builder.mutationType({});