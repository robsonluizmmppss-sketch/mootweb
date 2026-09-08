"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      <div className="relative text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <p className="mt-8 font-mono text-sm text-destructive">ERRO 500</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Algo saiu do trilho
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Um erro inesperado aconteceu. Nossa equipe foi notificada. Tente novamente.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground/60">
            ref: {error.digest}
          </p>
        )}
        <Button variant="gradient" size="lg" onClick={reset} className="mt-8">
          <RotateCw />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
