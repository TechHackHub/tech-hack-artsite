import { sign, verify, SignOptions } from 'jsonwebtoken';
import { Artist } from '@prisma/client';

type AuthUser = Pick<Artist, 'id' | 'name' | 'email'>;

const secret = process.env.ACCESS_TOKEN_SECRET ?? '';

export class Credential {
  static signJwt(user: AuthUser, options?: SignOptions): string {
    return sign(user, secret, { expiresIn: '7d', ...(options && options) });
  }

  static verifyJwt(token: string): { valid: boolean; user?: AuthUser } {
    try {
      const user = verify(token, secret) as AuthUser;
      return { valid: true, user };
    } catch (e) {
      console.error(e);
      return { valid: false };
    }
  }
}
