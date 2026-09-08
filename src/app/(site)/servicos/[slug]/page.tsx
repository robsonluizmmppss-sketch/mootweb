import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { getServiceBySlug, listServices } from "@/lib/public/services";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const list = await listServices();
  return list.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary ?? undefined };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <Section className="pt-36 sm:pt-44">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Serviços
          </Link>

          <div className="mt-8 grid size-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-accent">
            <Icon name={service.icon ?? "Boxes"} className="size-7" />
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {service.title}
          </h1>
          {service.summary && (
            <p className="mt-4 text-pretty text-lg text-muted-foreground">{service.summary}</p>
          )}
        </Reveal>

        {service.description && (
          <Reveal className="mt-10 whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {service.description}
          </Reveal>
        )}

        {(service.features ?? []).length > 0 && (
          <Reveal className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              O que está incluído
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(service.features ?? []).map((f: string) => (
                <li key={f} className="card-premium flex items-center gap-2 rounded-xl p-4 text-sm">
                  <Check className="size-4 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href={service.ctaHref ?? "/orcamento"}
            className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
          >
            {service.ctaLabel ?? "Solicitar orçamento"}
          </Link>
          <span className="text-sm text-muted-foreground">Projetos sob orçamento</span>
        </Reveal>
      </div>
    </Section>
  );
}
