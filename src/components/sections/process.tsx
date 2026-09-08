import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import type { ProcessStepItem } from "@/types/content";

export function Process({ steps }: { steps: ProcessStepItem[] }) {
  if (!steps.length) return null;
  return (
    <Section id="processo" className="border-t border-white/10">
      <SectionHeading
        eyebrow="Processo"
        title="Um método claro,"
        highlight="do briefing ao roadmap."
        description="Transparência total em cada etapa, com entregas incrementais e sem surpresas."
      />

      <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <RevealItem key={step.title}>
            <div className="card-premium relative h-full rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                  <Icon name={step.icon} />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-sm font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
