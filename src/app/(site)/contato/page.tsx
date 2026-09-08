import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

import { getSiteSettings } from "@/lib/content";
import { Section, SectionHeading } from "@/components/shared/section";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a MootWeb — engenharia e design de produtos digitais.",
};

export default async function ContatoPage() {
  const s = await getSiteSettings();

  return (
    <Section className="pt-36 sm:pt-44">
      <SectionHeading
        eyebrow="Contato"
        title="Vamos conversar sobre"
        highlight="o seu projeto."
        description="Respondemos em até 1 dia útil. Para orçamentos, use o formulário dedicado."
      />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {s.email && (
            <a
              href={`mailto:${s.email}`}
              className="card-premium flex items-center gap-3 rounded-2xl p-5 hover:-translate-y-0.5"
            >
              <Mail className="size-5 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">E-mail</div>
                <div className="text-sm font-medium">{s.email}</div>
              </div>
            </a>
          )}
          {s.whatsapp && (
            <a
              href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
              className="card-premium flex items-center gap-3 rounded-2xl p-5 hover:-translate-y-0.5"
            >
              <MessageCircle className="size-5 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">WhatsApp</div>
                <div className="text-sm font-medium">{s.whatsapp}</div>
              </div>
            </a>
          )}
          {s.phone && (
            <div className="card-premium flex items-center gap-3 rounded-2xl p-5">
              <Phone className="size-5 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Telefone</div>
                <div className="text-sm font-medium">{s.phone}</div>
              </div>
            </div>
          )}
          {(s.addressLine || s.city) && (
            <div className="card-premium flex items-center gap-3 rounded-2xl p-5">
              <MapPin className="size-5 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Endereço</div>
                <div className="text-sm font-medium">
                  {[s.addressLine, s.city, s.state].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          )}
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
