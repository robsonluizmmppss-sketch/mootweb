"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import type { NavLink, SiteSettingsView } from "@/types/content";

export function Navbar({
  nav,
  settings,
}: {
  nav: NavLink[];
  settings: SiteSettingsView;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container">
        <nav
          className={cn(
            "mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300",
            scrolled
              ? "glass-strong shadow-glow-sm"
              : "border border-transparent bg-transparent",
          )}
        >
          <Logo
            brandName={settings.brandName}
            logoUrl={settings.logoDarkUrl}
            imgClassName="h-7 w-auto sm:h-8"
          />

          <div className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.href && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/orcamento"
              className={cn(buttonVariants({ variant: "gradient", size: "sm" }))}
            >
              Iniciar projeto
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          "container overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[420px] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="glass-strong mt-2 rounded-2xl p-4">
          <div className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3">
            <Link
              href="/orcamento"
              className={cn(buttonVariants({ variant: "gradient", size: "sm" }), "w-full")}
            >
              Iniciar projeto
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
