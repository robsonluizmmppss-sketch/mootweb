import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { setQuoteStatus, quoteToLead } from "@/server/actions/crm";
import { PageHeader } from "@/components/admin/page-header";
import { StatusSelect } from "@/components/admin/status-select";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Orçamentos" };

const OPTIONS = [
  { value: "RECEIVED", label: "Recebido" },
  { value: "REVIEWING", label: "Em análise" },
  { value: "QUOTED", label: "Orçado" },
  { value: "ACCEPTED", label: "Aceito" },
  { value: "DECLINED", label: "Recusado" },
];

export default async function QuotesPage() {
  await requireRole("VIEWER");
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { files: true, lead: { select: { id: true, name: true } } },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Orçamentos" description={`${quotes.length} solicitações`} />

      {quotes.length === 0 ? (
        <EmptyState title="Nenhum orçamento" description="Solicitações do formulário de orçamento aparecem aqui." />
      ) : (
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="card-premium rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {q.name}
                    {q.company ? ` · ${q.company}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {q.email}
                    {q.phone ? ` · ${q.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground/70">
                    {formatDistanceToNow(q.createdAt, { addSuffix: true, locale: ptBR })}
                  </span>
                  <StatusSelect action={setQuoteStatus} id={q.id} value={q.status} options={OPTIONS} />
                </div>
              </div>

              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Tipo", q.projectType],
                  ["Prazo", q.deadline],
                  ["Orçamento", q.budgetRange],
                  ["Local", [q.city, q.state].filter(Boolean).join("/")],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-xs text-muted-foreground/70">{k}</dt>
                    <dd>{(v as string) || "—"}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{q.message}</p>

              {q.files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.files.map((f) => (
                    <a
                      key={f.id}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
                    >
                      {f.name}
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                {q.lead ? (
                  <span className="text-xs text-emerald-400">
                    ✓ Lead: {q.lead.name}
                  </span>
                ) : (
                  <form action={quoteToLead}>
                    <input type="hidden" name="id" value={q.id} />
                    <Button type="submit" size="sm" variant="secondary">
                      Converter em lead
                    </Button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
