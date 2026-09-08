"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal ao rolar — implementação leve com IntersectionObserver + CSS.
 * -----------------------------------------------------------------------------
 * Por que não Framer Motion aqui:
 *  - o estado de repouso é VISÍVEL (progressive enhancement): se o JS/observer
 *    não rodar, o conteúdo aparece mesmo assim — nada de tela em branco.
 *  - CSS transitions continuam funcionando com a aba em segundo plano
 *    (ao contrário de animações baseadas em requestAnimationFrame).
 */

type Direction = "up" | "down" | "left" | "right" | "none";

const hiddenTransform: Record<Direction, string> = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(24px)",
  right: "translateX(-24px)",
  none: "none",
};

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1, ...options },
    );
    obs.observe(el);

    // Failsafe: garante que o conteúdo apareça mesmo se o observer não disparar
    // (ex.: aba em segundo plano / ambientes sem layout).
    const failsafe = window.setTimeout(() => setInView(true), 1500);

    return () => {
      obs.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [options]);

  return { ref, inView };
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-shown={inView || undefined}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-from": hiddenTransform[direction],
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("reveal-group", className)}
      data-shown={inView || undefined}
      style={{ "--reveal-stagger": `${stagger}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("reveal-item", className)}>{children}</div>;
}
