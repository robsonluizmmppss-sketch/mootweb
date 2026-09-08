import type { Metadata } from "next";
import { ShieldCheck, Clock, FileCheck2 } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Solicitar orçamento",
  description: "Envie o briefing do seu projeto e receba uma proposta da MootWeb.",
};

const PERKS = [
  { icon: Clock, title: "Resposta em 1 dia útil", text: "Análise do briefing e próximos passos." },
  { icon: FileCheck2, title: "Proposta clara", text: "Escopo, prazo e investimento sem letras miúdas." },
  { icon: ShieldCheck, title: "Sem compromisso", text: "A conversa inicial é gratuita e sem pressão." },
];

export default function OrcamentoPage() {
  return (
    <Section className="pt-36 sm:pt-44">
      <SectionHeading
        eyebrow="Orçamento"
        title="Conte seu projeto."
        highlight="Devolvemos um plano."
        description="Quanto mais contexto, melhor a estimativa. Leva ~3 minutos."
      />

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.6fr]">
        <ul className="space-y-4">
          {PERKS.map((p) => (
            <li key={p.title} className="card-premium rounded-2xl p-5">
              <p.icon className="size-5 text-accent" />
              <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ul>

        <QuoteForm />
      </div>
    </Section>
  );
}
