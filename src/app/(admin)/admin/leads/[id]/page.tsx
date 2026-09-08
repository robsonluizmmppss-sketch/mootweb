import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { addLeadNote, updateLead, setLeadStatus } from "@/server/actions/crm";
import { PageHeader, Breadcrumb } from "@/components/admin/page-header";
import { StatusSelect } from "@/components/admin/status-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Novo" },
  { value: "CONTACTED", label: "Contato" },
  { value: "NEGOTIATING", label: "Negociação" },
  { value: "WON", label: "Fechado" },
  { value: "LOST", label: "Perdido" },
];

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("VIEWER");
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      quotes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Leads", href: "/admin/leads" }, { label: lead.name }]} />
      <PageHeader title={lead.name} description={lead.company ?? "Lead"}>
        <StatusSelect
          action={setLeadStatus}
          id={lead.id}
          value={lead.status}
          options={STATUS_OPTIONS}
        />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form action={updateLead} className="card-premium grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <input type="hidden" name="id" value={lead.id} />
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={lead.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" name="company" defaultValue={lead.company ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" defaultValue={lead.email ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" defaultValue={lead.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Responsável</Label>
            <Input id="ownerName" name="ownerName" defaultValue={lead.ownerName ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor estimado (R$)</Label>
            <Input
              id="value"
              name="value"
              type="number"
              step="0.01"
              defaultValue={lead.value != null ? lead.value / 100 : ""}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="gradient">
              Salvar dados
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="card-premium rounded-2xl p-6">
            <h2 className="text-sm font-semibold">Anotações</h2>
            <form action={addLeadNote} className="mt-3 space-y-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <Textarea name="body" rows={3} placeholder="Registrar contato, follow-up..." required />
              <Button type="submit" variant="secondary" size="sm">
                Adicionar nota
              </Button>
            </form>
            <ul className="mt-4 space-y-3">
              {lead.notes.map((n) => (
                <li key={n.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm">
                  <p className="whitespace-pre-wrap">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    {n.authorName ?? "—"} ·{" "}
                    {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ptBR })}
                  </p>
                </li>
              ))}
              {lead.notes.length === 0 && (
                <li className="text-xs text-muted-foreground/60">Sem anotações.</li>
              )}
            </ul>
          </div>

          {lead.quotes.length > 0 && (
            <div className="card-premium rounded-2xl p-6">
              <h2 className="text-sm font-semibold">Orçamentos vinculados</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {lead.quotes.map((q) => (
                  <li key={q.id} className="flex justify-between">
                    <span className="text-muted-foreground">{q.projectType ?? "Projeto"}</span>
                    <span>{q.budgetRange ?? "—"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
