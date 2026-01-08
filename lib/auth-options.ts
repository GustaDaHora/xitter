import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
          iqScore: user.iqScore ?? undefined,
          username: user.username ?? undefined,
          bio: user.bio ?? undefined,
          createdAt: user.createdAt?.toISOString() ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.iqScore = token.iqScore as number | undefined;
        session.user.username = token.username as string | undefined;
        session.user.bio = token.bio as string | undefined;
        session.user.createdAt = token.createdAt as string | undefined;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "update") {
        // Refetch user data from DB when client calls update()
        // session here is what the client sent to update()
        // But usually for IQ score update, we just want to REFATCH from DB because DB has changed.

        // Actually, we can fetch the user from DB again here using the token.id (which should be present)
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });

          if (dbUser) {
            token.iqScore = dbUser.iqScore;
            // Update other fields if necessary
          }
        }
      }

      if (user) {
        token.id = user.id;
        token.iqScore = user.iqScore;
        token.username = user.username;
        token.bio = user.bio;
        token.createdAt = (user as { createdAt?: string }).createdAt;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
