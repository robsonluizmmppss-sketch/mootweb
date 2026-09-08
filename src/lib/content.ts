import { cache } from "react";
import { prisma, safeQuery } from "@/lib/prisma";
import {
  defaultFooterNav,
  defaultHome,
  defaultNav,
  defaultSiteSettings,
} from "@/lib/mock-data";
import type {
  HomeContent,
  NavLink,
  SiteSettingsView,
} from "@/types/content";

/**
 * Camada de conteúdo do site público.
 * -----------------------------------------------------------------
 * Todas as funções tentam ler do banco (Prisma) e, se ele estiver
 * indisponível ou sem dados, caem para os defaults de `mock-data`.
 * Isso mantém a Home 100% renderizável antes do primeiro seed
 * e serve de contrato para o painel admin (Fase 2).
 */

export const getSiteSettings = cache(async (): Promise<SiteSettingsView> => {
  const row = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    null,
  );
  if (!row) return defaultSiteSettings;

  return {
    brandName: row.brandName,
    tagline: row.tagline,
    logoLightUrl: row.logoLightUrl,
    logoDarkUrl: row.logoDarkUrl,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    addressLine: row.addressLine,
    city: row.city,
    state: row.state,
    instagramUrl: row.instagramUrl,
    linkedinUrl: row.linkedinUrl,
    githubUrl: row.githubUrl,
    twitterUrl: row.twitterUrl,
    youtubeUrl: row.youtubeUrl,
    behanceUrl: row.behanceUrl,
    dribbbleUrl: row.dribbbleUrl,
    footerHeadline: row.footerHeadline,
    footerText: row.footerText,
    footerCopyright: row.footerCopyright ?? defaultSiteSettings.footerCopyright,
    gaId: row.gaId,
    gtmId: row.gtmId,
    fbPixelId: row.fbPixelId,
    enableParallax: row.enableParallax,
    enableGridBg: row.enableGridBg,
    maintenanceMode: row.maintenanceMode,
    maintenanceText: row.maintenanceText,
  };
});

export const getHeaderNav = cache(async (): Promise<NavLink[]> => {
  const all = await safeQuery(
    () =>
      prisma.navItem.findMany({
        where: { location: "header", parentId: null },
        orderBy: { order: "asc" },
        include: { children: { orderBy: { order: "asc" } } },
      }),
    [],
  );
  // Só cai para o default quando NÃO há nenhum item cadastrado.
  if (!all.length) return defaultNav;
  return all
    .filter((r) => r.enabled)
    .map((r) => ({
      label: r.label,
      href: r.href,
      children: r.children.filter((c) => c.enabled).map((c) => ({ label: c.label, href: c.href })),
    }));
});

export const getFooterNav = cache(async () => {
  const all = await safeQuery(
    () =>
      prisma.navItem.findMany({
        where: { location: { startsWith: "footer:" } },
        orderBy: [{ location: "asc" }, { order: "asc" }],
      }),
    [],
  );
  if (!all.length) return defaultFooterNav;

  const rows = all.filter((r) => r.enabled);

  // Agrupa por "footer:<grupo>" preservando a ordem de aparição.
  const groups: { title: string; links: NavLink[] }[] = [];
  for (const r of rows) {
    const raw = r.location.split(":")[1] ?? "Links";
    const title = raw.charAt(0).toUpperCase() + raw.slice(1);
    let g = groups.find((x) => x.title.toLowerCase() === title.toLowerCase());
    if (!g) {
      g = { title, links: [] };
      groups.push(g);
    }
    g.links.push({ label: r.label, href: r.href });
  }
  return groups;
});

/**
 * Retorna o payload `data` de uma seção editável (PageSection), acrescido de
 * `enabled`. Null apenas quando NÃO existe linha para essa seção (o componente
 * decide o comportamento padrão). Se existir e estiver desativada, vem
 * `{ enabled: false }`.
 */
export const getSectionData = cache(
  async <T extends Record<string, unknown> = Record<string, unknown>>(
    page: string,
    key: string,
  ): Promise<(T & { enabled: boolean }) | null> => {
    const row = await safeQuery(
      () => prisma.pageSection.findUnique({ where: { page_key: { page, key } } }),
      null,
    );
    if (!row) return null;
    return { ...((row.data ?? {}) as T), enabled: row.enabled };
  },
);

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  // Seções livres (copy) => PageSection JSON.  Seções de entidade => tabelas.
  const [sections, services, steps, projects, testimonials, clients, partners, faq] =
    await Promise.all([
      safeQuery(
        () => prisma.pageSection.findMany({ where: { page: "home" } }),
        [] as { key: string; data: unknown; enabled: boolean }[],
      ),
      safeQuery(
        () =>
          prisma.service.findMany({
            where: { enabled: true },
            orderBy: [{ featured: "desc" }, { order: "asc" }],
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.processStep.findMany({
            where: { enabled: true },
            orderBy: { order: "asc" },
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.project.findMany({
            where: { status: "PUBLISHED" },
            orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
            take: 6,
            include: {
              category: { select: { name: true } },
              technologies: { include: { technology: { select: { name: true } } } },
            },
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.testimonial.findMany({
            where: { enabled: true },
            orderBy: [{ featured: "desc" }, { order: "asc" }],
            take: 6,
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.client.findMany({
            orderBy: [{ featured: "desc" }, { order: "asc" }],
            take: 12,
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.partner.findMany({
            where: { enabled: true },
            orderBy: { order: "asc" },
          }),
        [],
      ),
      safeQuery(
        () =>
          prisma.faqItem.findMany({
            where: { enabled: true },
            orderBy: { order: "asc" },
          }),
        [],
      ),
    ]);

  const byKey = new Map(sections.map((s) => [s.key, s]));
  const disabled = (key: string) => byKey.get(key)?.enabled === false;
  const json = <K extends keyof HomeContent>(key: K): HomeContent[K] => {
    if (disabled(key)) return emptyFor(key);
    return (byKey.get(key)?.data as unknown as HomeContent[K]) ?? defaultHome[key];
  };

  return {
    hero: json("hero"),
    features: json("features"),
    stats: json("stats"),
    cta: json("cta"),

    services:
      disabled("services")
        ? []
        : services.length
          ? services.map((s) => ({
              slug: s.slug,
              icon: s.icon ?? "Boxes",
              title: s.title,
              summary: s.summary ?? "",
              features: s.features,
              priceLabel: null, // valores não são exibidos no site (tudo é orçamento)
            }))
          : defaultHome.services,

    process:
      disabled("process")
        ? []
        : steps.length
          ? steps.map((p) => ({
              icon: p.icon ?? "Compass",
              title: p.title,
              description: p.description ?? "",
            }))
          : defaultHome.process,

    projects:
      disabled("projects")
        ? []
        : projects.length
          ? projects.map((p) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt ?? "",
              coverUrl: p.coverUrl,
              category: p.category?.name ?? p.clientName ?? null,
              tags: p.tags,
              technologies: p.technologies.map((t) => t.technology.name),
              featured: p.featured,
            }))
          : defaultHome.projects,

    testimonials:
      disabled("testimonials")
        ? []
        : testimonials.length
          ? testimonials.map((t) => ({
              authorName: t.authorName,
              role: t.role,
              company: t.company,
              avatarUrl: t.avatarUrl,
              quote: t.quote,
              rating: t.rating,
            }))
          : defaultHome.testimonials,

    clients:
      disabled("clients")
        ? []
        : clients.length
          ? clients.map((c) => ({ name: c.name, logoUrl: c.logoUrl }))
          : defaultHome.clients,

    partners:
      disabled("partners")
        ? []
        : partners.length
          ? partners.map((p) => ({
              name: p.name,
              logoUrl: p.logoUrl,
              tier: p.tier ?? "standard",
            }))
          : defaultHome.partners,

    faq:
      disabled("faq")
        ? []
        : faq.length
          ? faq.map((f) => ({ question: f.question, answer: f.answer }))
          : defaultHome.faq,
  };
});

/** Payload "vazio" para uma seção JSON desativada. */
function emptyFor<K extends keyof HomeContent>(key: K): HomeContent[K] {
  const empties: Partial<Record<keyof HomeContent, unknown>> = {
    features: [],
    stats: [],
  };
  return (empties[key] ?? defaultHome[key]) as HomeContent[K];
}

/** Conjunto de chaves de seção da home marcadas como ocultas no painel. */
export const getHomeHidden = cache(async (): Promise<Set<string>> => {
  const rows = await safeQuery(
    () =>
      prisma.pageSection.findMany({
        where: { page: "home", enabled: false },
        select: { key: true },
      }),
    [] as { key: string }[],
  );
  return new Set(rows.map((r) => r.key));
});
