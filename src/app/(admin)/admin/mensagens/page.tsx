import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { setMessageStatus } from "@/server/actions/crm";
import { PageHeader } from "@/components/admin/page-header";
import { StatusSelect } from "@/components/admin/status-select";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Mensagens" };

const OPTIONS = [
  { value: "UNREAD", label: "Não lida" },
  { value: "READ", label: "Lida" },
  { value: "REPLIED", label: "Respondida" },
  { value: "ARCHIVED", label: "Arquivada" },
];

export default async function MessagesPage() {
  await requireRole("VIEWER");
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-6">
      <PageHeader title="Mensagens" description={`${messages.length} mensagens de contato`} />

      {messages.length === 0 ? (
        <EmptyState title="Caixa de entrada vazia" description="Mensagens do formulário de contato aparecem aqui." />
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`card-premium rounded-2xl p-5 ${m.status === "UNREAD" ? "border-l-2 border-primary/50" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {m.name}{" "}
                    <span className="text-sm font-normal text-muted-foreground">&lt;{m.email}&gt;</span>
                  </p>
                  {m.subject && <p className="text-sm text-accent">{m.subject}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground/70">
                    {formatDistanceToNow(m.createdAt, { addSuffix: true, locale: ptBR })}
                  </span>
                  <StatusSelect action={setMessageStatus} id={m.id} value={m.status} options={OPTIONS} />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{m.body}</p>
              {m.phone && (
                <p className="mt-2 text-xs text-muted-foreground/70">Telefone: {m.phone}</p>
              )}
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "seu contato")}`}
                className="mt-3 inline-block text-xs text-accent hover:underline"
              >
                Responder por e-mail →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
