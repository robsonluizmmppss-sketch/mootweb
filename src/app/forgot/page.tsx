import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={
        <>
          Lembrou?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Voltar ao login
          </Link>
        </>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
