"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { UserPlus, Pencil, Loader2 } from "lucide-react";

import { saveUser, type UserState } from "@/server/actions/users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* eslint-disable @typescript-eslint/no-explicit-any */
const initial: UserState = { ok: false, message: "" };

export function UserDialog({ user }: { user?: any }) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = useActionState(saveUser, initial);

  React.useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      if (!state.tempPassword) setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <button className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground">
            <Pencil className="size-4" />
          </button>
        ) : (
          <Button variant="gradient" size="sm">
            <UserPlus className="size-4" /> Novo usuário
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar usuário" : "Novo usuário"}</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          {user?.id && <input type="hidden" name="id" value={user.id} />}
          <div className="space-y-2">
            <Label htmlFor="u_name">Nome</Label>
            <Input id="u_name" name="name" defaultValue={user?.name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="u_email">E-mail</Label>
            <Input id="u_email" name="email" type="email" defaultValue={user?.email ?? ""} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="u_role">Papel</Label>
              <Select name="role" defaultValue={user?.role ?? "VIEWER"}>
                <SelectTrigger id="u_role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ativo</Label>
              <div className="pt-1.5">
                <Switch name="isActive" defaultChecked={user?.isActive ?? true} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="u_pw">{user ? "Nova senha (opcional)" : "Senha (opcional)"}</Label>
            <Input id="u_pw" name="password" type="password" minLength={8} placeholder="deixe vazio para gerar" />
          </div>

          {state.tempPassword && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm">
              Senha temporária: <code className="font-mono text-emerald-300">{state.tempPassword}</code>
            </p>
          )}

          <Button type="submit" variant="gradient" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {user ? "Salvar" : "Criar usuário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
