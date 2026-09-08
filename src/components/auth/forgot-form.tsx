"use client";

import { useActionState } from "react";
import { Loader2, Mail } from "lucide-react";

import { requestPasswordReset, type ActionState } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = { ok: false, message: "" };

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);

  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-300">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail da conta</Label>
        <Input id="email" name="email" type="email" required autoFocus placeholder="voce@mootweb.online" />
        {state.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email}</p>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
        Enviar link de redefinição
      </Button>
    </form>
  );
}
