"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";

import { resetPassword, type ActionState } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = { ok: false, message: "" };

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);

  if (state.ok) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-300">
          {state.message}
        </p>
        <Link href="/login">
          <Button variant="gradient" className="w-full">
            Ir para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoFocus />
        {state.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar nova senha</Label>
        <Input id="confirm" name="confirm" type="password" required minLength={8} />
        {state.errors?.confirm && (
          <p className="text-xs text-destructive">{state.errors.confirm}</p>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
        Redefinir senha
      </Button>
    </form>
  );
}
