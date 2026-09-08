"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/admin/resources";
import { buildSchema, valuesFromForm, ensureSlugs } from "@/lib/admin/form";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";
import { slugify } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Db = Record<string, any>;
const db = prisma as unknown as Db;

export interface CrudState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

function zodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[i.path.join(".")] = i.message;
  return out;
}

function revalidateFor(resourceKey: string) {
  revalidatePath("/admin/" + resourceKey);
  // Revalida TODO o site público (layout raiz cobre /, /portfolio, /blog, ...).
  revalidatePath("/", "layout");
}

/** Cria OU atualiza um registro (id no form => update). */
export async function saveRecord(
  _prev: CrudState,
  form: FormData,
): Promise<CrudState> {
  const resourceKey = String(form.get("__resource"));
  const id = form.get("__id") ? String(form.get("__id")) : null;

  const resource = getResource(resourceKey);
  if (!resource) return { ok: false, message: "Recurso desconhecido." };

  await requireRole(resource.minRole);

  const parsed = buildSchema(resource).safeParse(valuesFromForm(resource, form));
  if (!parsed.success) {
    return { ok: false, message: "Corrija os campos destacados.", errors: zodErrors(parsed.error) };
  }

  const data = ensureSlugs(resource, { ...parsed.data });

  // remove chaves undefined (deixa o default do Prisma agir no create)
  for (const k of Object.keys(data)) if (data[k] === undefined) delete data[k];

  try {
    if (id) {
      await db[resource.model].update({ where: { id }, data });
      await logActivity({ action: `${resource.key}.update`, entityType: resource.model, entityId: id });
    } else {
      const created = await db[resource.model].create({ data });
      await logActivity({
        action: `${resource.key}.create`,
        entityType: resource.model,
        entityId: created.id,
      });
    }
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { ok: false, message: "Já existe um registro com esse valor único (ex.: slug)." };
    }
    console.error("[saveRecord]", err);
    return { ok: false, message: "Erro ao salvar. Verifique os dados." };
  }

  revalidateFor(resource.key);
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteRecord(form: FormData): Promise<CrudState> {
  const resourceKey = String(form.get("__resource"));
  const id = String(form.get("__id"));
  const resource = getResource(resourceKey);
  if (!resource) return { ok: false, message: "Recurso desconhecido." };

  await requireRole(resource.minRole);

  try {
    await db[resource.model].delete({ where: { id } });
    await logActivity({ action: `${resource.key}.delete`, entityType: resource.model, entityId: id });
  } catch (err: any) {
    console.error("[deleteRecord]", err);
    if (err?.code === "P2003") {
      return { ok: false, message: "Não é possível excluir: há registros vinculados a este item." };
    }
    return { ok: false, message: "Erro ao excluir." };
  }
  revalidateFor(resource.key);
  return { ok: true, message: "Registro excluído." };
}

export async function duplicateRecord(
  form: FormData,
): Promise<CrudState & { id?: string }> {
  const resourceKey = String(form.get("__resource"));
  const id = String(form.get("__id"));
  const resource = getResource(resourceKey);
  if (!resource || !resource.duplicable) {
    return { ok: false, message: "Recurso não pode ser duplicado." };
  }

  await requireRole(resource.minRole);

  const original = await db[resource.model].findUnique({ where: { id } });
  if (!original) return { ok: false, message: "Registro não encontrado." };

  const copy: Record<string, unknown> = {};
  for (const f of resource.fields) {
    let v = original[f.name];
    if (f.name === "slug" && typeof v === "string") v = slugify(`${v}-copia-${Date.now().toString(36)}`);
    if (f.name === "title" && typeof v === "string") v = `${v} (cópia)`;
    if (f.name === "name" && typeof v === "string") v = `${v} (cópia)`;
    if (v !== undefined) copy[f.name] = v;
  }
  if ("status" in copy) copy.status = "DRAFT";
  if ("featured" in copy) copy.featured = false;

  try {
    const created = await db[resource.model].create({ data: copy });
    await logActivity({
      action: `${resource.key}.duplicate`,
      entityType: resource.model,
      entityId: created.id,
    });
    revalidateFor(resource.key);
    return { ok: true, message: "Registro duplicado.", id: created.id };
  } catch (err) {
    console.error("[duplicateRecord]", err);
    return { ok: false, message: "Erro ao duplicar." };
  }
}

/** Alterna um campo booleano diretamente da listagem. */
export async function toggleBoolean(form: FormData): Promise<void> {
  const resourceKey = String(form.get("__resource"));
  const id = String(form.get("__id"));
  const field = String(form.get("__field"));
  const value = form.get("__value") === "true";

  const resource = getResource(resourceKey);
  if (!resource) return;
  await requireRole(resource.minRole);

  await db[resource.model].update({ where: { id }, data: { [field]: value } });
  revalidateFor(resource.key);
}

/** Reordena registros (lista de ids na nova ordem). */
export async function reorderRecords(resourceKey: string, ids: string[]): Promise<void> {
  const resource = getResource(resourceKey);
  if (!resource?.sortable) return;
  await requireRole(resource.minRole);

  await prisma.$transaction(
    ids.map((id, index) =>
      db[resource.model].update({ where: { id }, data: { order: index } }),
    ),
  );
  revalidateFor(resource.key);
}
