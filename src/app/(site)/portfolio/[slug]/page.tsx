import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Target, Trophy } from "lucide-react";

import {
  allProjectSlugs,
  getAdjacentProjects,
  getProjectBySlug,
} from "@/lib/public/portfolio";
import { formatDate, absoluteUrl } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await allProjectSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt ?? undefined,
    openGraph: {
      title: project.title,
      description: project.excerpt ?? undefined,
      images: project.coverUrl ? [{ url: project.coverUrl }] : undefined,
      url: absoluteUrl(`/portfolio/${project.slug}`),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(project.order);
  const techs = project.technologies.map((t) => t.technology.name);
  const related = project.relatedFrom.map((r) => r.target);

  return (
    <article className="pt-32 sm:pt-40">
      {/* Hero */}
      <div className="container">
        <Reveal>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Portfólio
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.category && (
              <span className="pill">{project.category.name}</span>
            )}
            {project.deliveredAt && (
              <span className="text-xs text-muted-foreground">
                Entregue em {formatDate(project.deliveredAt, { day: undefined })}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {project.title}
          </h1>
          {project.excerpt && (
            <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              {project.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "gradient", size: "sm" }))}
              >
                Ver online <ExternalLink className="size-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                <Github className="size-4" /> Código
              </a>
            )}
          </div>
        </Reveal>
      </div>

      {/* Cover */}
      <div className="container mt-12">
        <Reveal className="card-premium overflow-hidden rounded-3xl">
          <div className="relative aspect-[16/9]">
            {project.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.coverUrl} alt={project.title} className="size-full object-cover" />
            ) : (
              <div className="size-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,99,235,0.4),rgba(5,8,22,0.9))]">
                <div className="absolute inset-0 bg-grid opacity-40" />
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Body */}
      <Section className="!pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {project.description && (
              <Reveal>
                <h2 className="text-xl font-semibold">O desafio</h2>
                <p className="mt-3 whitespace-pre-wrap text-pretty leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </Reveal>
            )}
            {project.objectives && (
              <Reveal>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Target className="size-5 text-accent" /> Objetivos
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {project.objectives}
                </p>
              </Reveal>
            )}
            {project.results && (
              <Reveal>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Trophy className="size-5 text-accent" /> Resultados
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {project.results}
                </p>
              </Reveal>
            )}

            {project.gallery.length > 0 && (
              <Reveal className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.alt ?? project.title}
                    className="card-premium w-full rounded-2xl object-cover"
                  />
                ))}
              </Reveal>
            )}

            {project.videoUrl && (
              <Reveal className="aspect-video overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={project.videoUrl}
                  title={project.title}
                  className="size-full"
                  allowFullScreen
                />
              </Reveal>
            )}
          </div>

          {/* Meta sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card-premium rounded-2xl p-6">
              <dl className="space-y-4 text-sm">
                {(project.client?.name || project.clientName) && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Cliente</dt>
                    <dd className="mt-0.5 font-medium">
                      {project.client?.name ?? project.clientName}
                    </dd>
                  </div>
                )}
                {project.category && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Categoria</dt>
                    <dd className="mt-0.5 font-medium">{project.category.name}</dd>
                  </div>
                )}
                {techs.length > 0 && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Tecnologias</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {techs.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Tags</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <span key={t} className="text-xs text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        <div className="mt-16 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/portfolio/${prev.slug}`}
              className="card-premium rounded-2xl p-5 text-left hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" /> Anterior
              </span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/portfolio/${next.slug}`}
              className="card-premium rounded-2xl p-5 text-right hover:-translate-y-0.5 sm:ml-auto"
            >
              <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                Próximo <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold">Projetos relacionados</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProjectCard
                  key={r.slug}
                  project={{
                    slug: r.slug,
                    title: r.title,
                    excerpt: r.excerpt ?? "",
                    coverUrl: r.coverUrl,
                    category: null,
                    tags: [],
                    technologies: [],
                    featured: false,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Section>
    </article>
  );
}
