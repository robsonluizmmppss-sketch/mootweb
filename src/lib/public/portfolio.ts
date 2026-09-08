import { cache } from "react";
import { prisma, safeQuery } from "@/lib/prisma";

export const listCategories = cache(async () => {
  return safeQuery(
    () =>
      prisma.category.findMany({
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true, _count: { select: { projects: true } } },
      }),
    [],
  );
});

export const listProjects = cache(
  async (opts: { category?: string; q?: string } = {}) => {
    return safeQuery(
      () =>
        prisma.project.findMany({
          where: {
            status: "PUBLISHED",
            ...(opts.category ? { category: { slug: opts.category } } : {}),
            ...(opts.q
              ? {
                  OR: [
                    { title: { contains: opts.q, mode: "insensitive" } },
                    { excerpt: { contains: opts.q, mode: "insensitive" } },
                    { tags: { has: opts.q } },
                  ],
                }
              : {}),
          },
          orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
          include: {
            category: { select: { name: true, slug: true } },
            technologies: { include: { technology: { select: { name: true } } } },
          },
        }),
      [],
    );
  },
);

export const getProjectBySlug = cache(async (slug: string) => {
  return safeQuery(
    () =>
      prisma.project.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          category: { select: { name: true, slug: true } },
          client: { select: { name: true, websiteUrl: true, logoUrl: true } },
          gallery: { orderBy: { order: "asc" } },
          technologies: { include: { technology: { select: { name: true, iconUrl: true } } } },
          relatedFrom: {
            include: {
              target: { select: { title: true, slug: true, excerpt: true, coverUrl: true } },
            },
          },
        },
      }),
    null,
  );
});

export const getAdjacentProjects = cache(async (order: number) => {
  const [prev, next] = await Promise.all([
    safeQuery(
      () =>
        prisma.project.findFirst({
          where: { status: "PUBLISHED", order: { lt: order } },
          orderBy: { order: "desc" },
          select: { title: true, slug: true },
        }),
      null,
    ),
    safeQuery(
      () =>
        prisma.project.findFirst({
          where: { status: "PUBLISHED", order: { gt: order } },
          orderBy: { order: "asc" },
          select: { title: true, slug: true },
        }),
      null,
    ),
  ]);
  return { prev, next };
});

export const allProjectSlugs = cache(async () => {
  return safeQuery(
    () => prisma.project.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
    [],
  );
});
