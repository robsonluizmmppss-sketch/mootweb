import { Reveal } from "@/components/shared/reveal";
import type { StatItem } from "@/types/content";

export function StatsBand({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;
  return (
    <section className="border-t border-white/10 py-20">
      <div className="container">
        <Reveal className="card-premium overflow-hidden rounded-3xl">
          <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="p-8 text-center">
                <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  <span className="text-gradient">{s.value}</span>
                  {s.suffix && (
                    <span className="ml-1 text-lg text-accent">{s.suffix}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
