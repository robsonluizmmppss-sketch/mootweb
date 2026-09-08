"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendEmail, renderPasswordResetEmail } from "@/lib/email";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "@/lib/validations/auth";
import { requireUser } from "@/lib/session";
import { logActivity } from "@/lib/admin/log";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string> };

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) out[issue.path.join(".")] = issue.message;
  return out;
}

/** Solicita redefinição de senha — sempre responde "ok" (não vaza e-mails). */
export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: "Verifique o e-mail informado.", errors: fieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
    });
    const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset/${token}`;
    const mail = renderPasswordResetEmail(link);
    await sendEmail({ to: user.email, ...mail });
  }

  return {
    ok: true,
    message: "Se o e-mail existir, enviamos um link de redefinição. Verifique sua caixa de entrada.",
  };
}

/** Redefine a senha a partir de um token válido. */
export async function resetPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Corrija os campos destacados.", errors: fieldErrors(parsed.error) };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });
  if (!record || record.usedAt || record.expires < new Date()) {
    return { ok: false, message: "Link inválido ou expirado. Solicite um novo." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return { ok: true, message: "Senha redefinida! Você já pode entrar." };
}

/** Troca de senha do usuário logado. */
export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    current: formData.get("current"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Corrija os campos destacados.", errors: fieldErrors(parsed.error) };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.passwordHash) {
    return { ok: false, message: "Conta sem senha definida." };
  }
  const valid = await bcrypt.compare(parsed.data.current, dbUser.passwordHash);
  if (!valid) {
    return { ok: false, message: "Senha atual incorreta.", errors: { current: "Senha atual incorreta" } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await logActivity({ action: "user.password_change", entityType: "User", entityId: user.id });

  return { ok: true, message: "Senha alterada com sucesso." };
}
