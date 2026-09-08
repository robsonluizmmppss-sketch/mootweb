import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminIcon } from "./admin-icon";

export function StatCard({
  label,
  value,
  icon,
  hint,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  href?: string;
  accent?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "card-premium group relative rounded-2xl p-5 transition-transform duration-300",
        href && "hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "grid size-9 place-items-center rounded-lg border",
            accent
              ? "border-primary/30 bg-primary/15 text-accent"
              : "border-white/10 bg-white/5 text-muted-foreground",
          )}
        >
          <AdminIcon name={icon} />
        </div>
        {href && (
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
      {hint && <div className="mt-2 text-xs text-muted-foreground/70">{hint}</div>}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
