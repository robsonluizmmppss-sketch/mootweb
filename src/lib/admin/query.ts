import { prisma } from "@/lib/prisma";
import type { ResourceDef, FieldDef } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = prisma as unknown as Record<string, any>;

export const PAGE_SIZE = 20;

/** Resolve a coluna de lista para um FieldDef (aceita "category" -> "categoryId"). */
export function columnField(resource: ResourceDef, col: string): FieldDef | undefined {
  return (
    resource.fields.find((f) => f.name === col) ??
    resource.fields.find((f) => f.name === `${col}Id`)
  );
}

export async function listRecords(
  resource: ResourceDef,
  opts: { q?: string; page?: number },
) {
  const page = Math.max(1, opts.page ?? 1);
  const where: any = {};

  if (opts.q && resource.searchable.length) {
    where.OR = resource.searchable.map((field) => ({
      [field]: { contains: opts.q, mode: "insensitive" },
    }));
  }

  // include para colunas do tipo relation
  const include: any = {};
  for (const col of resource.listColumns) {
    const f = columnField(resource, col);
    if (f?.type === "relation" && f.relationTo) {
      const accessor = f.name.replace(/Id$/, "");
      include[accessor] = { select: { [f.relationLabel ?? "name"]: true, id: true } };
    }
  }

  const orderBy = resource.defaultSort
    ? { [resource.defaultSort.field]: resource.defaultSort.dir }
    : { createdAt: "desc" as const };

  const [rows, total] = await Promise.all([
    db[resource.model].findMany({
      where,
      include: Object.keys(include).length ? include : undefined,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db[resource.model].count({ where }),
  ]);

  return { rows, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getRecord(resource: ResourceDef, id: string) {
  return db[resource.model].findUnique({ where: { id } });
}

/** Opções para campos `relation` (id + label). */
export async function relationOptions(resource: ResourceDef) {
  const map: Record<string, { value: string; label: string }[]> = {};
  for (const f of resource.fields) {
    if (f.type !== "relation" || !f.relationTo) continue;
    const labelField = f.relationLabel ?? "name";
    const items = await db[f.relationTo].findMany({
      select: { id: true, [labelField]: true },
      orderBy: { [labelField]: "asc" },
      take: 500,
    });
    map[f.name] = items.map((it: any) => ({ value: it.id, label: String(it[labelField] ?? it.id) }));
  }
  return map;
}
