import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import { schema } from './schema';
import { Credential } from '@/app/libs/credential';

const server = new ApolloServer({
  schema,
  // csrfPrevention: false
  // introspection: false // dev playground for test api
  // validationRules:[] // apollo set depthLimit
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req, res) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')?.[1];

      if (!token) {
        throw new Error('Unauthorized');
      }

      const credential = Credential.verifyJwt(token);

      return { req, res, ...credential };
    } catch {
      return { req, res };
    }
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};
