"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export interface SectionState {
  ok: boolean;
  message: string;
}

function revalidate() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/paginas");
}

/** Liga/desliga a visibilidade de uma seção (auto-save do toggle). */
export async function setSectionEnabled(id: string, enabled: boolean): Promise<void> {
  await requireRole("EDITOR");
  await prisma.pageSection.update({ where: { id }, data: { enabled } });
  await logActivity({
    action: "section.toggle",
    entityType: "PageSection",
    entityId: id,
    metadata: { enabled },
  });
  revalidate();
}

/** Atualiza a ordem de uma seção (auto-save). */
export async function setSectionOrder(id: string, order: number): Promise<void> {
  await requireRole("EDITOR");
  await prisma.pageSection.update({
    where: { id },
    data: { order: Number.isFinite(order) ? order : 0 },
  });
  revalidate();
}

/** Salva o payload JSON de uma seção. */
export async function saveSection(
  _prev: SectionState,
  form: FormData,
): Promise<SectionState> {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const rawJson = String(form.get("data") ?? "");

  let data: unknown;
  try {
    data = JSON.parse(rawJson);
  } catch {
    return { ok: false, message: "JSON inválido — verifique a sintaxe." };
  }
  if (data === null || typeof data !== "object") {
    return { ok: false, message: "O conteúdo deve ser um objeto ou lista JSON." };
  }

  await prisma.pageSection.update({
    where: { id },
    data: { data: data as object },
  });
  await logActivity({ action: "section.update", entityType: "PageSection", entityId: id });
  revalidate();

  return { ok: true, message: "Seção atualizada." };
}
