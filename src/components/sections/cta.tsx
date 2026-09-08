import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CtaContent } from "@/types/content";

export function CtaSection({ content }: { content: CtaContent }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center sm:p-16">
          {/* glow de fundo */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_50%_0%,rgba(37,99,235,0.35),transparent_70%)]" />
          <div className="absolute inset-0 -z-10 bg-grid opacity-30" />

          {content.eyebrow && (
            <span className="pill mx-auto">
              <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
              {content.eyebrow}
            </span>
          )}
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              {content.subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {content.primaryLabel && content.primaryHref && (
              <Link
                href={content.primaryHref}
                className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
              >
                {content.primaryLabel}
                <ArrowRight />
              </Link>
            )}
            {content.secondaryLabel && content.secondaryHref && (
              <Link
                href={content.secondaryHref}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                <MessageCircle className="size-4" />
                {content.secondaryLabel}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
