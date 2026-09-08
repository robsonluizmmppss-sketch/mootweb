import { cache } from "react";
import { prisma, safeQuery } from "@/lib/prisma";
import { defaultHome } from "@/lib/mock-data";

export const listServices = cache(async () => {
  const rows = await safeQuery(
    () =>
      prisma.service.findMany({
        where: { enabled: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    [],
  );
  if (rows.length) return rows;
  // fallback
  return defaultHome.services.map((s, i) => ({
    id: s.slug,
    title: s.title,
    slug: s.slug,
    summary: s.summary,
    description: null as string | null,
    icon: s.icon,
    imageUrl: null as string | null,
    priceLabel: null,
    ctaLabel: "Solicitar orçamento",
    ctaHref: "/orcamento",
    features: s.features,
    featured: i < 2,
    enabled: true,
    order: i,
  }));
});

export const getServiceBySlug = cache(async (slug: string) => {
  const row = await safeQuery(
    () => prisma.service.findUnique({ where: { slug } }),
    null,
  );
  if (row) return row;
  const mock = defaultHome.services.find((s) => s.slug === slug);
  if (!mock) return null;
  return {
    id: mock.slug,
    title: mock.title,
    slug: mock.slug,
    summary: mock.summary,
    description: null as string | null,
    icon: mock.icon,
    imageUrl: null as string | null,
    priceLabel: null,
    ctaLabel: "Solicitar orçamento",
    ctaHref: "/orcamento",
    features: mock.features,
  };
});
