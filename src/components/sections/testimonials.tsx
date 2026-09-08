import { Star, Quote } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { TestimonialItem } from "@/types/content";

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  if (!items.length) return null;

  return (
    <Section id="depoimentos" className="border-t border-white/10">
      <SectionHeading
        eyebrow="Depoimentos"
        title="O que dizem"
        highlight="quem já construiu com a gente."
      />

      <RevealGroup className="mt-16 grid gap-4 md:grid-cols-3">
        {items.map((t) => (
          <RevealItem key={t.authorName}>
            <figure className="card-premium flex h-full flex-col rounded-2xl p-8">
              <Quote className="size-8 text-primary/40" />
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="grid size-10 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-accent">
                  {t.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatarUrl}
                      alt={t.authorName}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    t.authorName.charAt(0)
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">{t.authorName}</div>
                  <div className="text-xs text-muted-foreground">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
