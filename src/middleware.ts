import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Protege /admin/** — usuários não autenticados são redirecionados para /login
 * (com callbackUrl). A checagem fina de papel (ADMIN/EDITOR/VIEWER) acontece
 * nas Server Actions e nos layouts do painel.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
