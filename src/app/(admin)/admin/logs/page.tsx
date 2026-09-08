import { format } from "date-fns";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { EmptyState } from "@/components/admin/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Logs" };
const PAGE = 40;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("ADMIN");
  const { page: p } = await searchParams;
  const page = Math.max(1, Number(p ?? 1));

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
      skip: (page - 1) * PAGE,
      take: PAGE,
    }),
    prisma.activityLog.count(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Logs de atividade" description={`${total} registros de auditoria`} />

      {logs.length === 0 ? (
        <EmptyState title="Sem logs" description="Ações no painel são registradas automaticamente." />
      ) : (
        <>
          <div className="card-premium overflow-hidden rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(l.createdAt, "dd/MM/yy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-accent">{l.action}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {l.entityType ?? "—"}
                      {l.entityId ? ` #${l.entityId.slice(0, 8)}` : ""}
                    </TableCell>
                    <TableCell className="text-xs">
                      {l.user?.name ?? l.user?.email ?? "sistema"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.ip ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={page}
            pageCount={Math.max(1, Math.ceil(total / PAGE))}
            baseQuery={{}}
          />
        </>
      )}
    </div>
  );
}
