import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      iqScore: number;
    } & NextAuth.DefaultSession["user"];
  }

  interface User {
    iqScore?: number;
    bio?: string;
    image?: string;
    username?: string;
    emailVerified?: Date;
  }
}
