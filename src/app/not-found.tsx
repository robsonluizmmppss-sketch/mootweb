import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <div className="relative text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <p className="mt-8 font-mono text-sm text-accent">ERRO 404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "gradient", size: "lg" }), "mt-8")}
        >
          <ArrowLeft />
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}
