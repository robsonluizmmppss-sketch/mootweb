import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

import { listPosts, listPostCategories } from "@/lib/public/blog";
import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre engenharia web, design de produto, performance e SEO.",
};

export const revalidate = 300;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [posts, categories] = await Promise.all([
    listPosts({ category: categoria }),
    listPostCategories(),
  ]);

  return (
    <Section className="pt-36 sm:pt-44">
      <SectionHeading
        eyebrow="Blog"
        title="Ideias sobre"
        highlight="produto e engenharia."
        description="O que aprendemos construindo plataformas de alta performance."
      />

      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-4 py-1.5 text-sm ${
              !categoria ? "border-primary/40 bg-primary/15 text-accent" : "border-white/10 bg-white/5 text-muted-foreground"
            }`}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog?categoria=${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                categoria === c.slug
                  ? "border-primary/40 bg-primary/15 text-accent"
                  : "border-white/10 bg-white/5 text-muted-foreground"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="Ainda não há artigos publicados"
          description="Volte em breve — conteúdo novo a caminho."
        />
      ) : (
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-premium group flex h-full flex-col overflow-hidden rounded-2xl hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,99,235,0.35),rgba(5,8,22,0.9))]">
                      <div className="absolute inset-0 bg-grid opacity-40" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {post.category && (
                    <span className="text-xs text-accent">{post.category.name}</span>
                  )}
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    {post.author?.name && <span>{post.author.name}</span>}
                    {post.publishedAt && (
                      <>
                        <span>·</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </>
                    )}
                    {post.readingTime && (
                      <>
                        <span>·</span>
                        <span>{post.readingTime} min</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Section>
  );
}
