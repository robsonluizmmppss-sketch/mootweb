import { prisma, safeQuery } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

interface TechContent {
  title?: string;
  highlight?: string;
  description?: string;
  enabled?: boolean;
}

export async function Technologies({ content }: { content?: TechContent }) {
  if (content && content.enabled === false) return null;

  const techs = await safeQuery(
    () =>
      prisma.technology.findMany({
        orderBy: { order: "asc" },
        select: { id: true, name: true, iconUrl: true },
      }),
    [],
  );

  if (!techs.length) return null;

  return (
    <Section id="tecnologias" className="border-t border-white/10">
      <SectionHeading
        eyebrow="Stack"
        title={content?.title ?? "Tecnologias que"}
        highlight={content?.highlight ?? "dominamos."}
        description={
          content?.description ??
          "Ferramentas modernas, escolhidas por performance e manutenibilidade — não por moda."
        }
      />

      <RevealGroup className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {techs.map((t) => (
          <RevealItem key={t.id}>
            <div className="card-premium flex h-full items-center gap-3 rounded-xl px-4 py-3.5 transition-transform duration-300 hover:-translate-y-0.5">
              {t.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.iconUrl} alt="" className="size-5 shrink-0 object-contain" />
              ) : (
                <span className="size-2 shrink-0 rounded-full bg-accent/70" />
              )}
              <span className="truncate text-sm font-medium text-muted-foreground">
                {t.name}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
