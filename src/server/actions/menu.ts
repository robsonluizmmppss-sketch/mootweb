"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

function rv() {
  revalidatePath("/admin/menu");
  revalidatePath("/", "layout");
}

export async function saveNavItem(form: FormData) {
  await requireRole("EDITOR");
  const id = form.get("id") ? String(form.get("id")) : null;
  const label = String(form.get("label") || "").trim();
  const href = String(form.get("href") || "").trim();
  if (!label || !href) return;

  const base = {
    location: String(form.get("location") || "header"),
    label,
    href,
    order: Number(form.get("order") || 0),
  };

  if (id) {
    // O toggle "ativo" é salvo à parte (setNavItemEnabled); não mexemos aqui.
    await prisma.navItem.update({ where: { id }, data: base });
  } else {
    await prisma.navItem.create({
      data: { ...base, enabled: form.get("enabled") !== "false" },
    });
  }
  await logActivity({
    action: id ? "nav.update" : "nav.create",
    entityType: "NavItem",
    entityId: id ?? undefined,
  });
  rv();
}

export async function deleteNavItem(form: FormData) {
  await requireRole("EDITOR");
  await prisma.navItem.delete({ where: { id: String(form.get("id")) } });
  rv();
}

/** Liga/desliga um item de menu (auto-save do toggle). */
export async function setNavItemEnabled(id: string, enabled: boolean) {
  await requireRole("EDITOR");
  await prisma.navItem.update({ where: { id }, data: { enabled } });
  await logActivity({
    action: "nav.toggle",
    entityType: "NavItem",
    entityId: id,
    metadata: { enabled },
  });
  rv();
}
