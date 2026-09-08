import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { hasRole } from "@/lib/rbac";

/** Sessão atual (ou null). */
export async function getSession() {
  return auth();
}

/** Usuário atual (ou null). */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Exige autenticação; redireciona para /login se não houver sessão. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Exige papel mínimo; redireciona para /admin (sem acesso) se insuficiente. */
export async function requireRole(min: Role) {
  const user = await requireUser();
  if (!hasRole(user.role, min)) redirect("/admin?denied=1");
  return user;
}

/** Versão booleana para checagens finas em Server Actions. */
export async function can(min: Role) {
  const user = await getCurrentUser();
  return hasRole(user?.role, min);
}
