import { subDays, startOfDay, format } from "date-fns";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { TrendChart } from "@/components/admin/charts";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  await requireRole("VIEWER");

  const since = startOfDay(subDays(new Date(), 29));
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { name: true, path: true, createdAt: true },
  });

  const pageviews = events.filter((e) => e.name === "pageview").length;
  const ctaClicks = events.filter((e) => e.name === "cta_click").length;
  const submissions = events.filter((e) => e.name.endsWith("_submit")).length;

  const topPaths = Object.entries(
    events
      .filter((e) => e.name === "pageview" && e.path)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.path!] = (acc[e.path!] ?? 0) + 1;
        return acc;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const days = 30;
  const buckets: Record<string, { date: string; mensagens: number; orcamentos: number; leads: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = format(subDays(new Date(), days - 1 - i), "dd/MM");
    buckets[d] = { date: d, mensagens: 0, orcamentos: 0, leads: 0 };
  }
  for (const e of events) {
    if (e.name !== "pageview") continue;
    const d = format(e.createdAt, "dd/MM");
    if (buckets[d]) buckets[d].leads += 1; // reaproveita a série "leads" como pageviews
  }
  const trend = Object.values(buckets).map((b) => ({ ...b, mensagens: 0, orcamentos: 0 }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Métricas coletadas pelo próprio site (últimos 30 dias). Integre GA/GTM em Configurações."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pageviews" value={pageviews} icon="BarChart3" accent />
        <StatCard label="Cliques em CTA" value={ctaClicks} icon="MousePointerClick" />
        <StatCard label="Envios de formulário" value={submissions} icon="FileSpreadsheet" />
      </div>

      <div className="card-premium rounded-2xl p-6">
        <h2 className="text-sm font-semibold">Pageviews por dia</h2>
        {events.length === 0 ? (
          <EmptyState
            className="mt-4"
            title="Sem dados ainda"
            description="Os eventos começam a ser gravados assim que houver tráfego no site."
          />
        ) : (
          <div className="mt-4">
            <TrendChart data={trend} />
          </div>
        )}
      </div>

      <div className="card-premium rounded-2xl p-6">
        <h2 className="text-sm font-semibold">Páginas mais vistas</h2>
        {topPaths.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Sem registros.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topPaths.map(([path, count]) => (
              <li key={path} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs text-muted-foreground">{path}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
