"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { submitContact, type FormState } from "@/server/actions/public-forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initial: FormState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="card-premium flex flex-col items-center rounded-2xl p-10 text-center">
        <CheckCircle2 className="size-10 text-emerald-400" />
        <h3 className="mt-4 text-lg font-semibold">Mensagem enviada!</h3>
        <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card-premium grid gap-5 rounded-2xl p-6 sm:grid-cols-2 sm:p-8">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="space-y-2">
        <Label htmlFor="c_name">Nome *</Label>
        <Input id="c_name" name="name" required />
        {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="c_email">E-mail *</Label>
        <Input id="c_email" name="email" type="email" required />
        {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="c_phone">Telefone / WhatsApp</Label>
        <Input id="c_phone" name="phone" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c_subject">Assunto</Label>
        <Input id="c_subject" name="subject" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="c_body">Mensagem *</Label>
        <Textarea id="c_body" name="body" rows={5} required />
        {state.errors?.body && <p className="text-xs text-destructive">{state.errors.body}</p>}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-destructive sm:col-span-2">{state.message}</p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" variant="gradient" size="lg" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}
