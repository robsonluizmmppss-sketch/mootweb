"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { HeroContent } from "@/types/content";

/**
 * Hero — animação de entrada por CSS (roda mesmo com a aba em segundo plano);
 * o card visual tem leve inclinação 3D seguindo o mouse (aprimoramento).
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-44">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ---- Copy ---- */}
          <div>
            <span className="pill animate-fade-up" style={{ animationDelay: "0.05s" }}>
              <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
              {content.eyebrow}
            </span>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {content.titleLines.map((line, i) => (
                <span
                  key={line}
                  className="block animate-fade-up"
                  style={{ animationDelay: `${0.12 + i * 0.08}s` }}
                >
                  {line}
                </span>
              ))}
              <span
                className="block text-gradient animate-fade-up"
                style={{ animationDelay: `${0.12 + content.titleLines.length * 0.08}s` }}
              >
                {content.highlight}
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground animate-fade-up sm:text-lg"
              style={{ animationDelay: "0.4s" }}
            >
              {content.description}
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                href={content.primaryCta.href}
                className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
              >
                {content.primaryCta.label}
                <ArrowRight />
              </Link>
              <Link
                href={content.secondaryCta.href}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                <Play className="size-4" />
                {content.secondaryCta.label}
              </Link>
            </div>

            <ul
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 animate-fade-up"
              style={{ animationDelay: "0.62s" }}
            >
              {content.badges.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <CheckCircle2 className="size-4 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Visual 3D discreto ---- */}
          <HeroVisual stats={content.stats} />
        </div>

        {/* ---- Faixa de stats ---- */}
        <div
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-fade-up sm:grid-cols-4"
          style={{ animationDelay: "0.7s" }}
        >
          {content.stats.map((s) => (
            <div key={s.label} className="bg-background/40 p-6 text-center backdrop-blur">
              <div className="text-2xl font-semibold text-gradient-blue sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Card de vidro com leve inclinação 3D seguindo o mouse (aprimoramento opcional). */
function HeroVisual({ stats }: { stats: { label: string; value: string }[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 12 });
  }

  return (
    <div
      className="relative mx-auto w-full max-w-md animate-fade-up [perspective:1200px]"
      style={{ animationDelay: "0.35s" }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="glass-strong relative rounded-3xl p-6 shadow-glow"
      >
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-muted-foreground">mootweb.online</span>
        </div>

        <div className="mt-5 space-y-3" style={{ transform: "translateZ(40px)" }}>
          <div className="h-3 w-2/3 rounded-full bg-white/10" />
          <div className="h-3 w-1/2 rounded-full bg-white/10" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.slice(0, 4).map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="text-lg font-semibold text-accent">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-24 rounded-xl bg-[linear-gradient(120deg,rgba(37,99,235,0.25),rgba(96,165,250,0.05))]" />
        </div>

        <div
          className="absolute -right-6 -top-6 rounded-2xl border border-white/10 bg-moot-slate/80 px-4 py-3 backdrop-blur-xl animate-float"
          style={{ transform: "translateZ(70px)" }}
        >
          <div className="text-[10px] text-muted-foreground">Lighthouse</div>
          <div className="text-xl font-semibold text-emerald-400">100</div>
        </div>
      </div>
    </div>
  );
}
