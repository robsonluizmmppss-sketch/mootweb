import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE_LABEL } from "@/lib/rbac";
import { deleteUser } from "@/server/actions/users";
import { PageHeader } from "@/components/admin/page-header";
import { UserDialog } from "@/components/admin/user-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

export const metadata = { title: "Usuários" };

export default async function UsersPage() {
  const me = await requireRole("ADMIN");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <PageHeader title="Usuários" description={`${users.length} contas · papéis e permissões`}>
        <UserDialog />
      </PageHeader>

      <div className="card-premium overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      {u.image && <AvatarImage src={u.image} alt="" />}
                      <AvatarFallback>
                        {(u.name ?? u.email).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {u.name ?? "—"}
                        {u.id === me.id && (
                          <span className="ml-2 text-[11px] text-muted-foreground">(você)</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === "ADMIN" ? "primary" : "default"}>
                    {ROLE_LABEL[u.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.isActive ? (
                    <span className="text-emerald-400">Ativo</span>
                  ) : (
                    <span className="text-muted-foreground">Inativo</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.lastLoginAt
                    ? formatDistanceToNow(u.lastLoginAt, { addSuffix: true, locale: ptBR })
                    : "nunca"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <UserDialog user={u} />
                    {u.id !== me.id && (
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={u.id} />
                        <button className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-destructive hover:bg-destructive/10">
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
