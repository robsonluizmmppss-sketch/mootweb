import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { allPostSlugs, getPostBySlug, renderPostContent } from "@/lib/public/blog";
import { formatDate, absoluteUrl } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await allPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = renderPostContent(post.content, post.contentHtml);

  return (
    <article className="pt-32 sm:pt-40">
      <div className="container max-w-3xl">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Blog
          </Link>
          {post.category && (
            <span className="mt-6 block text-sm text-accent">{post.category.name}</span>
          )}
          <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
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
                <span>{post.readingTime} min de leitura</span>
              </>
            )}
          </div>
        </Reveal>
      </div>

      {post.coverUrl && (
        <div className="container mt-10 max-w-4xl">
          <Reveal className="overflow-hidden rounded-3xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverUrl} alt={post.title} className="w-full object-cover" />
          </Reveal>
        </div>
      )}

      <Section className="!pt-12">
        <div className="prose-invert mx-auto max-w-3xl">
          <div
            className="space-y-4 text-pretty leading-relaxed text-muted-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_a]:text-accent [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {post.tags.length > 0 && (
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${tag.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </Section>
    </article>
  );
}
