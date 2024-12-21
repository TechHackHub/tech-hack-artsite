import prisma from "@/app/libs/prisma";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { Prisma } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { NextRequest } from "next/server";

interface Context extends NextRequest {
  user?: { id: string; name: string, email: string }; // Adjust according to your user structure
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  AuthScopes: { isLogin: boolean };
  Scalars: { DateTime: { Input: Date; Output: Date } };
  Context: Context
}>({
  plugins: [PrismaPlugin, RelayPlugin, ScopeAuthPlugin],
  relay: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf
  },
  scopeAuth: {
    authScopes: async (context) => ({
      isLogin: !!context?.user
    }),
  }
});

builder.addScalarType("DateTime", DateTimeResolver, {});

// register query and mutation entry point
builder.queryType({});
builder.mutationType({});