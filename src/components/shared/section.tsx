import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Seção padrão com espaçamento generoso (muito espaço em branco). */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-24 sm:py-32", className)}>
      <div className="container">{children}</div>
    </section>
  );
}

/** Cabeçalho de seção: eyebrow + título com destaque + descrição. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="pill mb-4">
          <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}{" "}
        {highlight && <span className="text-gradient-blue">{highlight}</span>}
      </h2>
      {description && (
        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
