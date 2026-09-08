import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { PartnerItem } from "@/types/content";

export function Partners({ items }: { items: PartnerItem[] }) {
  if (!items.length) return null;

  return (
    <Section id="parceiros" className="border-t border-white/10">
      <SectionHeading
        eyebrow="Parceiros"
        title="Ecossistema de tecnologia"
        highlight="de primeira linha."
        description="Trabalhamos lado a lado com as plataformas que sustentam produtos modernos."
      />

      <RevealGroup className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((p) => (
          <RevealItem key={p.name}>
            <div className="card-premium flex h-28 items-center justify-center rounded-2xl p-6">
              {p.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logoUrl} alt={p.name} className="max-h-8 w-auto opacity-80" />
              ) : (
                <span className="text-lg font-semibold tracking-tight text-muted-foreground">
                  {p.name}
                </span>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
