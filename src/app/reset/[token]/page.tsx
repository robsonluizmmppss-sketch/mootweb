import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nova senha",
  robots: { index: false, follow: false },
};

export default async function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const record = await prisma.passwordResetToken
    .findUnique({ where: { token } })
    .catch(() => null);

  const valid = record && !record.usedAt && record.expires > new Date();

  if (!valid) {
    return (
      <AuthShell
        title="Link inválido"
        subtitle="Este link de redefinição expirou ou já foi usado."
        footer={
          <Link href="/forgot" className="text-accent hover:underline">
            Solicitar um novo link
          </Link>
        }
      >
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm text-destructive">
          Solicite uma nova redefinição de senha para continuar.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Criar nova senha" subtitle="Escolha uma senha forte (mínimo 8 caracteres).">
      <ResetForm token={token} />
    </AuthShell>
  );
}
