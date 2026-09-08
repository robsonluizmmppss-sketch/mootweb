import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { setLeadStatus } from "@/server/actions/crm";
import { PageHeader } from "@/components/admin/page-header";
import { StatusSelect } from "@/components/admin/status-select";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Leads (CRM)" };

const COLUMNS: { key: string; label: string; tone: string }[] = [
  { key: "NEW", label: "Novo", tone: "border-blue-500/30" },
  { key: "CONTACTED", label: "Contato", tone: "border-cyan-500/30" },
  { key: "NEGOTIATING", label: "Negociação", tone: "border-amber-500/30" },
  { key: "WON", label: "Fechado", tone: "border-emerald-500/30" },
  { key: "LOST", label: "Perdido", tone: "border-white/10" },
];

const STATUS_OPTIONS = COLUMNS.map((c) => ({ value: c.key, label: c.label }));

export default async function LeadsPage() {
  await requireRole("VIEWER");
  const leads = await prisma.lead.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { notes: true, quotes: true } } },
  });

  const byStatus = (s: string) => leads.filter((l) => l.status === s);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads (CRM)"
        description={`${leads.length} leads no funil. Arraste o status pelo seletor de cada card.`}
      />

      {leads.length === 0 ? (
        <EmptyState
          title="Nenhum lead ainda"
          description="Leads entram automaticamente pelos formulários de contato e orçamento."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = byStatus(col.key);
            return (
              <div key={col.key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1 text-sm">
                  <span className="font-medium">{col.label}</span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((lead) => (
                    <div
                      key={lead.id}
                      className={`card-premium rounded-xl border-l-2 p-4 ${col.tone}`}
                    >
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="block font-medium hover:text-accent"
                      >
                        {lead.name}
                      </Link>
                      {lead.company && (
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      )}
                      {lead.value != null && (
                        <p className="mt-1 text-xs font-medium text-accent">
                          {(lead.value / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      )}
                      <p className="mt-2 text-[11px] text-muted-foreground/70">
                        {formatDistanceToNow(lead.updatedAt, { addSuffix: true, locale: ptBR })}
                        {lead._count.notes > 0 && ` · ${lead._count.notes} nota(s)`}
                      </p>
                      <div className="mt-3">
                        <StatusSelect
                          action={setLeadStatus}
                          id={lead.id}
                          value={lead.status}
                          options={STATUS_OPTIONS}
                          className="h-7 w-full text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-muted-foreground/50">
                      vazio
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
