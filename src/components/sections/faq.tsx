import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import type { FaqEntry } from "@/types/content";

export function Faq({ items }: { items: FaqEntry[] }) {
  if (!items.length) return null;

  return (
    <Section id="faq" className="border-t border-white/10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Perguntas"
          highlight="frequentes."
          description="Não encontrou o que procurava? Fale com a gente pelo formulário de contato."
          className="mx-0 lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal>
          <Accordion type="single" defaultValue="q0" className="card-premium rounded-2xl px-6">
            {items.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} question={f.question}>
                {f.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
