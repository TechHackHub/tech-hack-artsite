import prisma from "@/app/libs/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "starklin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.artist.findUnique({ where: { email: credentials?.email } });

        // TODO: check pwd

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  },
});

export { handler as GET, handler as POST };