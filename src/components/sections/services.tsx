import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import type { ServiceItem } from "@/types/content";

export function Services({ items }: { items: ServiceItem[] }) {
  if (!items.length) return null;
  return (
    <Section id="servicos" className="border-t border-white/10">
      <SectionHeading
        eyebrow="Serviços"
        title="Tudo o que seu produto"
        highlight="precisa para escalar."
        description="Da primeira tela ao go-live, com times sêniores e um único ponto de responsabilidade."
      />

      <RevealGroup className="mt-16 grid gap-4 md:grid-cols-2">
        {items.map((s) => (
          <RevealItem key={s.slug}>
            <Link
              href={`/servicos/${s.slug}`}
              className="card-premium group relative flex h-full flex-col rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                  <Icon name={s.icon} className="size-6" />
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.summary}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sob orçamento
              </p>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
