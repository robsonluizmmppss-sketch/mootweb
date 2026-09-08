import type { ClientItem } from "@/types/content";

/**
 * Faixa "empresas atendidas" com marca d'água.
 * Usa CSS animation (definida abaixo) para o loop infinito — sem JS.
 */
export function LogoMarquee({
  clients,
  label = "Marcas que confiam na MootWeb",
}: {
  clients: ClientItem[];
  label?: string;
}) {
  if (!clients.length) return null;
  const doubled = [...clients, ...clients];

  return (
    <section className="border-y border-white/10 py-12">
      <div className="container">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <div className="marquee mt-8">
          <div className="marquee__track">
            {doubled.map((c, i) => (
              <span
                key={`${c.name}-${i}`}
                className="text-xl font-semibold tracking-tight text-muted-foreground/70"
              >
                {c.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logoUrl} alt={c.name} className="h-7 w-auto opacity-70" />
                ) : (
                  c.name
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
