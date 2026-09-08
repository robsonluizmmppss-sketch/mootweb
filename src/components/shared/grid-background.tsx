/**
 * Fundo tecnológico global: grid sutil + orbs de glow azul.
 * Server component, sem JS — fica atrás de todo o conteúdo.
 */
export function GridBackground({
  grid = true,
}: {
  parallax?: boolean;
  grid?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_-10%,rgba(37,99,235,0.18),transparent_60%)]" />

      {grid && <div className="absolute inset-0 bg-grid bg-grid-fade opacity-70" />}

      <div className="absolute -left-40 top-[-10%] h-[38rem] w-[38rem] rounded-full bg-primary/20 blur-[140px] animate-pulse-glow" />
      <div
        className="absolute -right-40 top-[30%] h-[32rem] w-[32rem] rounded-full bg-moot-sky/15 blur-[150px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
