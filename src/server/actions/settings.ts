"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";
import { siteSettingsSchema } from "@/lib/validations/settings";

export interface SettingsState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

const BOOL_FIELDS = ["enableParallax", "enableGridBg", "maintenanceMode"];

export async function saveSettings(
  _prev: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  await requireRole("ADMIN");

  const raw: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) raw[k] = v;
  for (const b of BOOL_FIELDS) raw[b] = form.get(b) === "on" || form.get(b) === "true";

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, message: "Corrija os campos destacados.", errors };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  await logActivity({ action: "settings.update", entityType: "SiteSettings", entityId: "singleton" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");

  return { ok: true, message: "Configurações salvas." };
}

export async function getSettingsRow() {
  return prisma.siteSettings.findUnique({ where: { id: "singleton" } });
}
