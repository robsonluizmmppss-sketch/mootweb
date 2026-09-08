import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Youtube,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn, interpolate } from "@/lib/utils";
import type { NavLink, SiteSettingsView } from "@/types/content";

const socialIcons = {
  instagramUrl: Instagram,
  linkedinUrl: Linkedin,
  githubUrl: Github,
  twitterUrl: Twitter,
  youtubeUrl: Youtube,
} as const;

export function Footer({
  settings,
  groups,
}: {
  settings: SiteSettingsView;
  groups: { title: string; links: NavLink[] }[];
}) {
  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="container py-16">
        {/* CTA final do rodapé */}
        {settings.footerHeadline && (
          <div className="card-premium mb-16 flex flex-col items-start gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {settings.footerHeadline}
            </h2>
            <Link
              href="/orcamento"
              className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
            >
              Solicitar orçamento
              <ArrowUpRight />
            </Link>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo
              brandName={settings.brandName}
              logoUrl={settings.logoDarkUrl}
              imgClassName="h-8 w-auto"
            />
            {settings.footerText && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {settings.footerText}
              </p>
            )}

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Mail className="size-4" /> {settings.email}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Phone className="size-4" /> {settings.phone}
                </a>
              )}
              {(settings.addressLine || settings.city) && (
                <p className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {[settings.addressLine, settings.city, settings.state]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-accent"
                >
                  <MessageCircle className="size-4" />
                </a>
              )}
              {Object.entries(socialIcons).map(([key, IconCmp]) => {
                const url = settings[key as keyof SiteSettingsView] as
                  | string
                  | null;
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-accent"
                  >
                    <IconCmp className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>{interpolate(settings.footerCopyright)}</p>
          <p className="flex items-center gap-2">
            Construído com Next.js, TypeScript e obsessão por performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
