import type { Role } from "@prisma/client";

/** Hierarquia de papéis (maior número = mais permissões). */
export const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

export const ROLE_LABEL: Record<Role, string> = {
  VIEWER: "Visualizador",
  EDITOR: "Editor",
  ADMIN: "Administrador",
};

/** `true` se `role` tem pelo menos o nível de `min`. */
export function hasRole(role: Role | undefined | null, min: Role): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/** Papel mínimo exigido por rota do painel (prefixo => papel). */
export const ROUTE_MIN_ROLE: { prefix: string; min: Role }[] = [
  { prefix: "/admin/usuarios", min: "ADMIN" },
  { prefix: "/admin/configuracoes", min: "ADMIN" },
  { prefix: "/admin/backup", min: "ADMIN" },
  { prefix: "/admin/logs", min: "ADMIN" },
  { prefix: "/admin", min: "VIEWER" },
];

export function minRoleForPath(pathname: string): Role {
  return ROUTE_MIN_ROLE.find((r) => pathname.startsWith(r.prefix))?.min ?? "VIEWER";
}
