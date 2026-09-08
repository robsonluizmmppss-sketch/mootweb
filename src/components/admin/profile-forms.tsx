"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Loader2, Save, KeyRound } from "lucide-react";

import { updateProfile, type ProfileState } from "@/server/actions/profile";
import { changePassword, type ActionState } from "@/server/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
const initial: ProfileState = { ok: false, message: "" };
const pwInitial: ActionState = { ok: false, message: "" };

export function ProfileForm({ user }: { user: any }) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  React.useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="card-premium grid gap-5 rounded-2xl p-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" defaultValue={user.name ?? ""} />
        {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={user.email ?? ""} disabled />
        <p className="text-xs text-muted-foreground/70">O e-mail de login não pode ser alterado aqui.</p>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="image">Foto (URL)</Label>
        <Input id="image" name="image" defaultValue={user.image ?? ""} placeholder="https://..." />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="gradient" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar perfil
        </Button>
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, pwInitial);

  React.useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <form
      action={action}
      id="senha"
      className="card-premium grid gap-5 rounded-2xl p-6 sm:grid-cols-2"
    >
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="current">Senha atual</Label>
        <Input id="current" name="current" type="password" autoComplete="current-password" />
        {state.errors?.current && (
          <p className="text-xs text-destructive">{state.errors.current}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" />
        {state.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar nova senha</Label>
        <Input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" />
        {state.errors?.confirm && (
          <p className="text-xs text-destructive">{state.errors.confirm}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
          Trocar senha
        </Button>
      </div>
    </form>
  );
}
