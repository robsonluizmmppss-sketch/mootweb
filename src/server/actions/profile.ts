"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export interface ProfileState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

const schema = z.object({
  name: z.string().min(1, "Informe seu nome"),
  image: z.string().url("URL inválida").optional().or(z.literal("")).transform((v) => v || null),
});

export async function updateProfile(
  _prev: ProfileState,
  form: FormData,
): Promise<ProfileState> {
  const user = await requireUser();
  const parsed = schema.safeParse({ name: form.get("name"), image: form.get("image") });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, message: "Corrija os campos.", errors };
  }

  await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  await logActivity({ action: "user.profile_update", entityType: "User", entityId: user.id });
  revalidatePath("/admin/perfil");
  revalidatePath("/admin", "layout");

  return { ok: true, message: "Perfil atualizado." };
}
