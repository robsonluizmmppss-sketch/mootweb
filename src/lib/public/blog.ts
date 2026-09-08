import { cache } from "react";
import { prisma, safeQuery } from "@/lib/prisma";

export const listPosts = cache(async (opts: { category?: string; tag?: string } = {}) => {
  return safeQuery(
    () =>
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          ...(opts.category ? { category: { slug: opts.category } } : {}),
          ...(opts.tag ? { tags: { some: { tag: { slug: opts.tag } } } } : {}),
        },
        orderBy: { publishedAt: "desc" },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
        },
      }),
    [],
  );
});

export const listPostCategories = cache(async () => {
  return safeQuery(
    () =>
      prisma.postCategory.findMany({
        orderBy: { name: "asc" },
        select: { name: true, slug: true, _count: { select: { posts: true } } },
      }),
    [],
  );
});

export const getPostBySlug = cache(async (slug: string) => {
  return safeQuery(
    () =>
      prisma.post.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
          tags: { include: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    null,
  );
});

export const allPostSlugs = cache(async () =>
  safeQuery(
    () => prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
    [],
  ),
);

/** Renderiza o conteúdo do post: HTML cacheado, string simples ou blocos. */
export function renderPostContent(content: unknown, contentHtml?: string | null): string {
  if (contentHtml) return contentHtml;
  if (typeof content === "string") {
    return content
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }
  if (Array.isArray(content)) {
    return content
      .map((block: { type?: string; text?: string }) => {
        if (block.type === "heading") return `<h2>${block.text ?? ""}</h2>`;
        if (block.type === "quote") return `<blockquote>${block.text ?? ""}</blockquote>`;
        return `<p>${block.text ?? ""}</p>`;
      })
      .join("");
  }
  return "";
}
