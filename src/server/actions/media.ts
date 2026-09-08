"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export async function deleteMedia(form: FormData) {
  await requireRole("EDITOR");
  const id = String(form.get("id"));
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  if (asset.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", asset.url));
    } catch {
      /* arquivo já removido */
    }
  }
  await prisma.mediaAsset.delete({ where: { id } });
  await logActivity({ action: "media.delete", entityType: "MediaAsset", entityId: id });
  revalidatePath("/admin/midias");
}
