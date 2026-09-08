"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export interface UserState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  tempPassword?: string;
}

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
  isActive: z.coerce.boolean().default(true),
  password: z.string().optional(),
});

export async function saveUser(_prev: UserState, form: FormData): Promise<UserState> {
  const me = await requireRole("ADMIN");

  const parsed = schema.safeParse({
    id: form.get("id") || undefined,
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    isActive: form.get("isActive") === "on" || form.get("isActive") === "true",
    password: form.get("password") || undefined,
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, message: "Corrija os campos.", errors };
  }

  const { id, password, ...data } = parsed.data;
  const email = data.email.toLowerCase();

  try {
    if (id) {
      // impede o admin de rebaixar/desativar a si mesmo
      if (id === me.id && (data.role !== "ADMIN" || !data.isActive)) {
        return { ok: false, message: "Você não pode rebaixar ou desativar a própria conta." };
      }
      await prisma.user.update({
        where: { id },
        data: {
          ...data,
          email,
          ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
        },
      });
      await logActivity({ action: "user.update", entityType: "User", entityId: id });
      revalidatePath("/admin/usuarios");
      return { ok: true, message: "Usuário atualizado." };
    }

    const temp = password || randomBytes(6).toString("base64url");
    const created = await prisma.user.create({
      data: {
        ...data,
        email,
        emailVerified: new Date(),
        passwordHash: await bcrypt.hash(temp, 10),
      },
    });
    await logActivity({ action: "user.create", entityType: "User", entityId: created.id });
    revalidatePath("/admin/usuarios");
    return {
      ok: true,
      message: "Usuário criado.",
      tempPassword: password ? undefined : temp,
    };
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return { ok: false, message: "Já existe um usuário com esse e-mail." };
    }
    console.error("[saveUser]", err);
    return { ok: false, message: "Erro ao salvar usuário." };
  }
}

export async function deleteUser(form: FormData) {
  const me = await requireRole("ADMIN");
  const id = String(form.get("id"));
  if (id === me.id) return;
  await prisma.user.delete({ where: { id } });
  await logActivity({ action: "user.delete", entityType: "User", entityId: id });
  revalidatePath("/admin/usuarios");
}

export async function issueResetLink(form: FormData): Promise<{ link: string } | void> {
  await requireRole("ADMIN");
  const id = String(form.get("id"));
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;
  await prisma.passwordResetToken.deleteMany({ where: { userId: id, usedAt: null } });
  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { userId: id, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
  });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { link: `${base}/reset/${token}` };
}
