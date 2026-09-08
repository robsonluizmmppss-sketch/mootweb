import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ResourceDef } from "@/lib/admin/types";
import { columnField } from "@/lib/admin/query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InlineToggle } from "./inline-toggle";
import { RowActions } from "./row-actions";
import { EmptyState } from "./empty-state";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUS_TONE: Record<string, string> = {
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  DRAFT: "border-white/10 bg-white/5 text-muted-foreground",
  SCHEDULED: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  ARCHIVED: "border-white/10 bg-white/5 text-muted-foreground/60",
};

function primaryLabel(resource: ResourceDef, row: any) {
  return row.title ?? row.name ?? row.question ?? row.authorName ?? row.key ?? row.path ?? row.id;
}

function Cell({
  resource,
  row,
  col,
}: {
  resource: ResourceDef;
  row: any;
  col: string;
}) {
  const f = columnField(resource, col);
  const raw = row[col];

  if (!f) return <span className="text-muted-foreground">{String(raw ?? "—")}</span>;

  switch (f.type) {
    case "boolean":
      return (
        <InlineToggle resource={resource.key} id={row.id} field={f.name} checked={Boolean(raw)} />
      );
    case "date":
      return <span>{raw ? formatDate(raw, { month: "short" }) : "—"}</span>;
    case "relation": {
      const accessor = f.name.replace(/Id$/, "");
      const rel = row[accessor];
      const label = rel?.[f.relationLabel ?? "name"];
      return label ? (
        <span className="text-muted-foreground">{label}</span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    }
    case "select": {
      if (f.name === "status" || col === "status") {
        return (
          <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
              STATUS_TONE[raw] ?? STATUS_TONE.DRAFT
            }`}
          >
            {f.options?.find((o) => o.value === raw)?.label ?? raw ?? "—"}
          </span>
        );
      }
      return <span>{f.options?.find((o) => o.value === raw)?.label ?? raw ?? "—"}</span>;
    }
    case "tags": {
      const arr: string[] = Array.isArray(raw) ? raw : [];
      if (!arr.length) return <span className="text-muted-foreground/40">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {arr.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]">
              {t}
            </span>
          ))}
          {arr.length > 3 && <span className="text-[11px] text-muted-foreground">+{arr.length - 3}</span>}
        </div>
      );
    }
    case "image":
      return raw ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={raw} alt="" className="size-9 rounded-lg border border-white/10 object-cover" />
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    case "number":
      return <span className="font-mono text-xs text-muted-foreground">{raw ?? 0}</span>;
    default: {
      const text = String(raw ?? "");
      return (
        <span className="line-clamp-1 max-w-[22rem]">
          {text || <span className="text-muted-foreground/40">—</span>}
        </span>
      );
    }
  }
}

export function DataTable({
  resource,
  rows,
}: {
  resource: ResourceDef;
  rows: any[];
}) {
  if (!rows.length) {
    return (
      <EmptyState
        title={`Nenhum item em ${resource.labelPlural.toLowerCase()}`}
        description="Crie o primeiro registro para começar."
      />
    );
  }

  return (
    <div className="card-premium overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            {resource.listColumns.map((col) => {
              const f = columnField(resource, col);
              return <TableHead key={col}>{f?.label ?? col}</TableHead>;
            })}
            <TableHead className="w-10 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {resource.listColumns.map((col, i) => (
                <TableCell key={col}>
                  {i === 0 ? (
                    <Link
                      href={`/admin/${resource.key}/${row.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      <Cell resource={resource} row={row} col={col} />
                    </Link>
                  ) : (
                    <Cell resource={resource} row={row} col={col} />
                  )}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <RowActions
                    resource={resource.key}
                    id={row.id}
                    editHref={`/admin/${resource.key}/${row.id}`}
                    duplicable={resource.duplicable}
                    label={String(primaryLabel(resource, row))}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
