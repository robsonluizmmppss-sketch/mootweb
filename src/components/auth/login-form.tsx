"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const params = useSearchParams();
  const rawCallback = params.get("callbackUrl") ?? "/admin";
  // Aceita só caminhos internos (evita open-redirect).
  const callbackUrl = rawCallback.startsWith("/") ? rawCallback : "/admin";

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").toLowerCase().trim();
    const password = String(form.get("password") ?? "");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("E-mail ou senha incorretos.");
        setPending(false);
        return;
      }

      // Navegação "hard": garante que o middleware já enxergue o cookie de sessão.
      window.location.assign(callbackUrl);
    } catch {
      setError("Não foi possível entrar agora. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="voce@mootweb.online"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link href="/forgot" className="text-xs text-accent hover:underline">
            Esqueci a senha
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Entrar no painel
      </Button>

      <p className="rounded-lg bg-white/[0.03] px-3 py-2 text-center text-xs text-muted-foreground">
        Demo: <span className="text-foreground">admin@mootweb.online</span> / mootweb123
      </p>
    </form>
  );
}
