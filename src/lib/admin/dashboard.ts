import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function getDashboardStats() {
  const [
    projects,
    publishedProjects,
    leads,
    openLeads,
    messages,
    unreadMessages,
    quotes,
    newQuotes,
    posts,
    testimonials,
    clients,
    teamMembers,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "NEGOTIATING"] } } }),
    prisma.message.count(),
    prisma.message.count({ where: { status: "UNREAD" } }),
    prisma.quote.count(),
    prisma.quote.count({ where: { status: "RECEIVED" } }),
    prisma.post.count(),
    prisma.testimonial.count(),
    prisma.client.count(),
    prisma.teamMember.count(),
  ]);

  return {
    projects,
    publishedProjects,
    leads,
    openLeads,
    messages,
    unreadMessages,
    quotes,
    newQuotes,
    posts,
    testimonials,
    clients,
    teamMembers,
  };
}

export async function getLeadFunnel() {
  const grouped = await prisma.lead.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const order = ["NEW", "CONTACTED", "NEGOTIATING", "WON", "LOST"] as const;
  const label: Record<string, string> = {
    NEW: "Novo",
    CONTACTED: "Contato",
    NEGOTIATING: "Negociação",
    WON: "Fechado",
    LOST: "Perdido",
  };
  return order.map((s) => ({
    status: label[s],
    total: grouped.find((g) => g.status === s)?._count._all ?? 0,
  }));
}

export async function getActivityTrend(days = 14) {
  const since = startOfDay(subDays(new Date(), days - 1));
  const [messages, quotes, leads] = await Promise.all([
    prisma.message.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.quote.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.lead.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  const buckets: Record<string, { date: string; mensagens: number; orcamentos: number; leads: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = format(subDays(new Date(), days - 1 - i), "dd/MM");
    buckets[d] = { date: d, mensagens: 0, orcamentos: 0, leads: 0 };
  }
  const add = (arr: { createdAt: Date }[], key: "mensagens" | "orcamentos" | "leads") => {
    for (const r of arr) {
      const d = format(r.createdAt, "dd/MM");
      if (buckets[d]) buckets[d][key] += 1;
    }
  };
  add(messages, "mensagens");
  add(quotes, "orcamentos");
  add(leads, "leads");
  return Object.values(buckets);
}

export async function getRecentActivity(limit = 8) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { name: true, email: true } } },
  });
}
