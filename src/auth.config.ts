import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Config compartilhada e "edge-safe" do Auth.js.
 * NÃO importa Prisma nem bcrypt — é usada pelo middleware (Edge Runtime).
 * O provider Credentials com `authorize` fica em `src/auth.ts` (Node runtime).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const onAdmin = nextUrl.pathname.startsWith("/admin");
      if (onAdmin) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.uid = user.id;
        token.picture = user.image ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
