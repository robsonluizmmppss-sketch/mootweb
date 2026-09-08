import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Placeholder das rotas que serão implementadas nas próximas fases.
 * Mantém a navegação sem links quebrados e comunica o roadmap.
 */
export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-40 text-center">
      <Reveal>
        <span className="pill">
          <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
          {phase}
        </span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          {description}
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "secondary" }), "mt-8")}
        >
          <ArrowLeft />
          Voltar para a home
        </Link>
      </Reveal>
    </section>
  );
}
