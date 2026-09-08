import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { listServices } from "@/lib/public/services";
import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Product design, engenharia web, plataformas SaaS e growth — pela MootWeb.",
};

export const revalidate = 300;

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <>
      <Section className="pt-36 sm:pt-44">
        <SectionHeading
          eyebrow="Serviços"
          title="Como podemos"
          highlight="acelerar seu produto."
          description="Times sêniores, um único responsável e entregas semanais."
        />

        <RevealGroup className="mt-16 grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <RevealItem key={s.slug}>
              <Link
                href={`/servicos/${s.slug}`}
                className="card-premium group flex h-full flex-col rounded-2xl p-8 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                    <Icon name={s.icon ?? "Boxes"} className="size-6" />
                  </div>
                  <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                {s.summary && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                )}
                <ul className="mt-5 space-y-2">
                  {(s.features ?? []).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-accent" /> {f}
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

      <CtaSection
        content={{
          eyebrow: "Pronto para começar?",
          title: "Cada projeto começa com uma conversa.",
          subtitle: "Conte seu desafio e receba uma visão de produto em 30 minutos.",
          primaryLabel: "Solicitar orçamento",
          primaryHref: "/orcamento",
          secondaryLabel: "Falar no WhatsApp",
          secondaryHref: "/contato",
        }}
      />
    </>
  );
}
