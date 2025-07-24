import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
const handler = NextAuth(authOptions);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      iqScore?: number;
      username?: string;
      bio?: string;
      createdAt?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    iqScore?: number;
    username?: string;
    bio?: string;
  }

  interface JWT {
    id: string;
    iqScore?: number;
    username?: string;
    bio?: string;
  }
}

export { handler as GET, handler as POST };
