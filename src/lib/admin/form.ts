import { z } from "zod";
import type { FieldDef, ResourceDef } from "./types";
import { slugify } from "@/lib/utils";

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);

function fieldSchema(f: FieldDef): z.ZodTypeAny {
  switch (f.type) {
    case "number": {
      const n = z.coerce.number({ invalid_type_error: "Número inválido" });
      return f.required ? n : z.preprocess(emptyToNull, n.nullable());
    }
    case "boolean":
      return z.coerce.boolean().default(false);
    case "date":
      return z.preprocess(
        emptyToNull,
        z
          .string()
          .nullable()
          .transform((v) => (v ? new Date(v) : null)),
      );
    case "tags":
      return z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((v) => {
          if (Array.isArray(v)) return v.filter(Boolean);
          if (!v) return [] as string[];
          return v.split(",").map((s) => s.trim()).filter(Boolean);
        });
    case "json":
      return z.preprocess(
        emptyToNull,
        z
          .string()
          .nullable()
          .transform((v, ctx) => {
            if (v == null) return undefined;
            try {
              return JSON.parse(v);
            } catch {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: "JSON inválido" });
              return z.NEVER;
            }
          }),
      );
    case "relation":
      return z.preprocess(
        emptyToNull,
        z
          .string()
          .nullable()
          .transform((v) => (v && v !== "__none__" ? v : null)),
      );
    default: {
      // text | textarea | richtext | image | slug | select | password
      const s = z.string();
      if (f.required) return s.min(1, "Campo obrigatório");
      return z.preprocess(emptyToNull, s.nullable());
    }
  }
}

/** Schema Zod completo do recurso. */
export function buildSchema(resource: ResourceDef) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of resource.fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

/** FormData -> objeto bruto (pré-validação). */
export function valuesFromForm(resource: ResourceDef, form: FormData) {
  const raw: Record<string, unknown> = {};
  for (const f of resource.fields) {
    if (f.type === "boolean") {
      const v = form.get(f.name);
      raw[f.name] = v === "on" || v === "true";
    } else if (f.type === "tags") {
      const all = form.getAll(f.name).filter((v) => typeof v === "string") as string[];
      raw[f.name] = all.length > 1 ? all : (form.get(f.name) ?? "");
    } else {
      raw[f.name] = form.get(f.name) ?? undefined;
    }
  }
  return raw;
}

/** Normaliza campos slug (gera a partir da origem se vazio). */
export function ensureSlugs(resource: ResourceDef, data: Record<string, unknown>) {
  for (const f of resource.fields) {
    if (f.type !== "slug") continue;
    const current = data[f.name];
    if ((!current || current === "") && f.slugFrom && data[f.slugFrom]) {
      data[f.name] = slugify(String(data[f.slugFrom]));
    } else if (typeof current === "string" && current) {
      data[f.name] = slugify(current);
    }
  }
  return data;
}
