import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import type { FeatureItem } from "@/types/content";

export function Features({ items }: { items: FeatureItem[] }) {
  if (!items.length) return null;
  return (
    <Section id="diferenciais">
      <SectionHeading
        eyebrow="Por que MootWeb"
        title="Padrão de produto,"
        highlight="não de agência."
        description="Cada entrega combina design premium, engenharia sólida e obsessão por métricas."
      />

      <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((f) => (
          <RevealItem key={f.title}>
            <div className="card-premium group h-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid size-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent transition-colors group-hover:bg-primary/20">
                <Icon name={f.icon} />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
