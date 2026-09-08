import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { requireUser } from "@/lib/session";
import {
  getActivityTrend,
  getDashboardStats,
  getLeadFunnel,
  getRecentActivity,
} from "@/lib/admin/dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { TrendChart, FunnelChart } from "@/components/admin/charts";
import { EmptyState } from "@/components/admin/empty-state";

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, trend, funnel, activity] = await Promise.all([
    getDashboardStats(),
    getActivityTrend(14),
    getLeadFunnel(),
    getRecentActivity(8),
  ]);

  const firstName = (user.name ?? "").split(" ")[0] || "por aqui";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Olá, ${firstName} 👋`}
        description="Visão geral da operação — conteúdo, comercial e atividade recente."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leads em aberto"
          value={stats.openLeads}
          hint={`${stats.leads} no total`}
          icon="Target"
          href="/admin/leads"
          accent
        />
        <StatCard
          label="Mensagens não lidas"
          value={stats.unreadMessages}
          hint={`${stats.messages} recebidas`}
          icon="MailOpen"
          href="/admin/mensagens"
        />
        <StatCard
          label="Orçamentos novos"
          value={stats.newQuotes}
          hint={`${stats.quotes} no total`}
          icon="FileSpreadsheet"
          href="/admin/orcamentos"
        />
        <StatCard
          label="Projetos publicados"
          value={stats.publishedProjects}
          hint={`${stats.projects} cadastrados`}
          icon="FolderKanban"
          href="/admin/projetos"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-premium rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Atividade — últimos 14 dias</h2>
          <p className="text-xs text-muted-foreground">Leads, orçamentos e mensagens por dia.</p>
          <div className="mt-4">
            <TrendChart data={trend} />
          </div>
        </div>
        <div className="card-premium rounded-2xl p-6">
          <h2 className="text-sm font-semibold">Funil de leads</h2>
          <p className="text-xs text-muted-foreground">Distribuição por status.</p>
          <div className="mt-4">
            <FunnelChart data={funnel} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-premium rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Atividade recente</h2>
            <Link href="/admin/logs" className="text-xs text-accent hover:underline">
              Ver logs
            </Link>
          </div>
          <div className="mt-4">
            {activity.length === 0 ? (
              <EmptyState
                title="Sem registros ainda"
                description="As ações feitas no painel aparecerão aqui."
              />
            ) : (
              <ul className="divide-y divide-white/5">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-accent">{a.action}</span>
                      <span className="ml-2 text-muted-foreground">
                        {a.entityType ?? ""} {a.entityId ? `#${a.entityId.slice(0, 6)}` : ""}
                      </span>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">
                      {a.user?.name ?? a.user?.email ?? "sistema"} ·{" "}
                      {formatDistanceToNow(a.createdAt, { addSuffix: true, locale: ptBR })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card-premium rounded-2xl p-6">
          <h2 className="text-sm font-semibold">Conteúdo</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { label: "Posts no blog", value: stats.posts, href: "/admin/blog" },
              { label: "Depoimentos", value: stats.testimonials, href: "/admin/depoimentos" },
              { label: "Clientes", value: stats.clients, href: "/admin/clientes" },
              { label: "Equipe", value: stats.teamMembers, href: "/admin/equipe" },
            ].map((row) => (
              <li key={row.label}>
                <Link
                  href={row.href}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold">{row.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
