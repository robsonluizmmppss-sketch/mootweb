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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/mootweb-mark.png"
      alt="MootWeb"
      className={cn("h-8 w-auto max-w-none select-none object-contain", className)}
      draggable={false}
      aria-hidden
    />
  );
}
