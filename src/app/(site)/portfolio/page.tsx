import type { Metadata } from "next";
import Link from "next/link";

import { listCategories, listProjects } from "@/lib/public/portfolio";
import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { EmptyState } from "@/components/admin/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos de SaaS, e-commerce, fintech e design system entregues pela MootWeb.",
};

export const revalidate = 300;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [categories, projects] = await Promise.all([
    listCategories(),
    listProjects({ category: categoria, q }),
  ]);

  const cards = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    coverUrl: p.coverUrl,
    category: p.category?.name ?? null,
    tags: p.tags,
    technologies: p.technologies.map((t) => t.technology.name),
    featured: p.featured,
  }));

  return (
    <Section className="pt-36 sm:pt-44">
      <SectionHeading
        eyebrow="Portfólio"
        title="Trabalho que"
        highlight="fala por si."
        description="Uma seleção de produtos digitais que projetamos e construímos."
      />

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        <FilterChip label="Todos" href="/portfolio" active={!categoria} />
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            label={`${c.name} (${c._count.projects})`}
            href={`/portfolio?categoria=${c.slug}`}
            active={categoria === c.slug}
          />
        ))}
      </div>

      {cards.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="Nenhum projeto nesta categoria"
          description="Ajuste o filtro ou volte mais tarde."
        />
      ) : (
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => (
            <RevealItem key={p.slug}>
              <ProjectCard project={p} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Section>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-accent"
          : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
