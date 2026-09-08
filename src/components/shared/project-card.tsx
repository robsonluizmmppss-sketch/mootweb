import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectCardItem } from "@/types/content";

export function ProjectCard({
  project,
  className,
}: {
  project: ProjectCardItem;
  className?: string;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn(
        "card-premium group relative flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {/* capa */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverUrl}
            alt={project.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,99,235,0.35),rgba(5,8,22,0.9))]">
            <div className="absolute inset-0 bg-grid opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {project.category && (
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs backdrop-blur">
            {project.category}
          </span>
        )}
      </div>

      {/* corpo */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.excerpt}
        </p>
        {project.technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
