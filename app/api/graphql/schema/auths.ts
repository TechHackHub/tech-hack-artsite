import prisma from "@/app/libs/prisma";
import { builder } from "../builder";
import Bcrypt from "@/app/libs/bcrypt";
import { Credential } from "@/app/libs/credential";

interface LoginResponse {
  accessToken: string;
}

const LoginResponseRef = builder.objectRef<LoginResponse>('LoginResponse');

LoginResponseRef.implement({
  description: 'LoginResponse',
  fields: (t) => ({
    accessToken: t.exposeString('accessToken')
  }),
});

builder.mutationField('login', (t) => t.field({
  type: LoginResponseRef,
  args: {
    email: t.arg.string({ required: true }),
    password: t.arg.string({ required: true })
  },
  resolve: async (_, args) => {
    const { email, password } = args;
    const artist = await prisma.artist.findUnique({ where: { email } });

    if (!artist) {
      throw new Error('Incorrect Email');
    }

    const isPasswordValid = await Bcrypt.comparePassword(password, artist.password);

    if (!isPasswordValid) {
      throw new Error('Password invalid');
    }

    const accessToken = Credential.signJwt({
      id: artist.id,
      name: artist.name,
      email: artist.email
    });

    return { accessToken };
  }
}));

// reset password