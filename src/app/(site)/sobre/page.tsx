import type { Metadata } from "next";

import { prisma, safeQuery } from "@/lib/prisma";
import { getHomeContent } from "@/lib/content";
import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem, Reveal } from "@/components/shared/reveal";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Sobre",
  description: "A MootWeb é um estúdio de engenharia e design de produtos digitais.",
};

export const revalidate = 300;

export default async function SobrePage() {
  const [team, home] = await Promise.all([
    safeQuery(
      () =>
        prisma.teamMember.findMany({
          where: { enabled: true },
          orderBy: { order: "asc" },
        }),
      [],
    ),
    getHomeContent(),
  ]);

  return (
    <>
      <Section className="pt-36 sm:pt-44">
        <SectionHeading
          eyebrow="Sobre"
          title="Engenharia e design"
          highlight="sob o mesmo teto."
          description="Somos um estúdio pequeno e sênior. Sem camadas, sem terceirização — o time que vende é o time que entrega."
        />

        <Reveal className="mx-auto mt-12 max-w-3xl space-y-4 text-pretty leading-relaxed text-muted-foreground">
          <p>
            A MootWeb nasceu da inconformidade com sites lentos, projetos que
            atrasam e agências que somem depois do go-live. Montamos um estúdio
            enxuto onde cada pessoa é responsável de ponta a ponta.
          </p>
          <p>
            Trabalhamos com Next.js, TypeScript e um design system próprio para
            entregar produtos que parecem — e performam como — os de uma startup
            bilionária, desde o primeiro commit.
          </p>
        </Reveal>
      </Section>

      <StatsBand stats={home.stats} />

      {team.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Time" title="Quem" highlight="constrói." />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <RevealItem key={m.id}>
                <div className="card-premium rounded-2xl p-6 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-lg font-semibold text-accent">
                    {m.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="size-16 rounded-full object-cover"
                      />
                    ) : (
                      m.name.charAt(0)
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <CtaSection content={home.cta} />
    </>
  );
}
