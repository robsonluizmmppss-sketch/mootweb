import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem, Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectCardItem } from "@/types/content";

export function PortfolioPreview({ projects }: { projects: ProjectCardItem[] }) {
  if (!projects.length) return null;
  const list = projects.slice(0, 6);

  return (
    <Section id="portfolio" className="border-t border-white/10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="Portfólio"
          title="Projetos recentes"
          highlight="que geram resultado."
          description="Uma amostra do que construímos com clientes de SaaS, fintech, saúde e varejo."
          className="mx-0"
        />
        <Reveal>
          <Link
            href="/portfolio"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Ver tudo
            <ArrowRight />
          </Link>
        </Reveal>
      </div>

      <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <RevealItem key={p.slug}>
            <ProjectCard project={p} className="h-full" />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
