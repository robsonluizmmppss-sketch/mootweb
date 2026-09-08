import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo da MootWeb.
 * - Se `logoUrl` existir (SiteSettings / upload no painel), renderiza o lockup
 *   oficial (imagem já contém símbolo + wordmark).
 * - Caso contrário, desenha símbolo SVG + wordmark tipográfico como fallback.
 */
export function Logo({
  brandName = "MootWeb",
  logoUrl,
  className,
  withWordmark = true,
  href = "/",
  imgClassName,
}: {
  brandName?: string;
  logoUrl?: string | null;
  className?: string;
  withWordmark?: boolean;
  href?: string | null;
  imgClassName?: string;
}) {
  const content = logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={brandName}
      className={cn("h-8 w-auto select-none", imgClassName)}
      draggable={false}
    />
  ) : (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8" />
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Moot<span className="text-accent">Web</span>
          <span className="text-accent">.</span>
        </span>
      )}
    </span>
  );

  if (!href) return <span className="shrink-0">{content}</span>;
  return (
    <Link href={href} aria-label={brandName} className="shrink-0">
      {content}
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="moot-mark" x1="8" y1="4" x2="40" y2="44">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* Monograma angular "M" formado por fitas em chevron */}
      <path
        d="M5 42V8l11 13L27 8"
        stroke="url(#moot-mark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 6v34L32 27 21 40"
        stroke="url(#moot-mark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 40V16"
        stroke="url(#moot-mark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M35 8v24"
        stroke="url(#moot-mark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
