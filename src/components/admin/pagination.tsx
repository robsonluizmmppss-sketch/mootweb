import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  baseQuery,
}: {
  page: number;
  pageCount: number;
  baseQuery: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const mk = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(baseQuery)) if (v) sp.set(k, v);
    sp.set("page", String(p));
    return `?${sp.toString()}`;
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-4 text-sm">
      <span className="text-muted-foreground">
        Página {page} de {pageCount}
      </span>
      <div className="flex items-center gap-1">
        <Link
          href={mk(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5",
            page <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="size-4" />
        </Link>
        <Link
          href={mk(Math.min(pageCount, page + 1))}
          aria-disabled={page >= pageCount}
          className={cn(
            "grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5",
            page >= pageCount && "pointer-events-none opacity-40",
          )}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
