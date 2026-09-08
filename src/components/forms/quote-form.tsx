"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, Paperclip, X } from "lucide-react";

import { submitQuote, type FormState } from "@/server/actions/public-forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

const PROJECT_TYPES = [
  "Site institucional",
  "Landing page",
  "E-commerce",
  "Plataforma / SaaS",
  "Aplicativo",
  "Design System",
  "Outro",
];
const BUDGETS = ["Até R$ 10k", "R$ 10k – R$ 30k", "R$ 30k – R$ 80k", "R$ 80k+", "A definir"];
const DEADLINES = ["Sem pressa", "1–2 meses", "3–4 meses", "Urgente"];

type UploadedFile = { url: string; name: string; size: number; mimeType: string };

const STEPS = ["Sobre você", "O projeto", "Detalhes & envio"];

export function QuoteForm() {
  const [state, action, pending] = useActionState(submitQuote, initial);
  const [step, setStep] = React.useState(0);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [uploading, setUploading] = React.useState(false);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", "orcamentos");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (res.ok) {
          setFiles((f) => [
            ...f,
            { url: json.url, name: json.name, size: file.size, mimeType: file.type },
          ]);
        }
      }
    } finally {
      setUploading(false);
    }
  }

  if (state.ok) {
    return (
      <div className="card-premium flex flex-col items-center rounded-2xl p-10 text-center">
        <CheckCircle2 className="size-12 text-emerald-400" />
        <h3 className="mt-4 text-xl font-semibold">Briefing recebido!</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card-premium rounded-2xl p-6 sm:p-8">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="fileUrls" value={JSON.stringify(files)} />

      {/* stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium",
                i <= step
                  ? "border-primary/40 bg-primary/15 text-accent"
                  : "border-white/10 text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("hidden text-xs sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-white/10" />}
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      <div className={cn("grid gap-5 sm:grid-cols-2", step === 0 ? "block" : "hidden")}>
        <div className="space-y-2">
          <Label htmlFor="q_name">Nome *</Label>
          <Input id="q_name" name="name" />
          {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_company">Empresa</Label>
          <Input id="q_company" name="company" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_email">E-mail *</Label>
          <Input id="q_email" name="email" type="email" />
          {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_phone">Telefone</Label>
          <Input id="q_phone" name="phone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_whatsapp">WhatsApp</Label>
          <Input id="q_whatsapp" name="whatsapp" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="q_city">Cidade</Label>
            <Input id="q_city" name="city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q_state">UF</Label>
            <Input id="q_state" name="state" maxLength={2} />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className={cn("grid gap-5 sm:grid-cols-2", step === 1 ? "block" : "hidden")}>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="q_type">Tipo de projeto *</Label>
          <select
            id="q_type"
            name="projectType"
            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione...
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {state.errors?.projectType && (
            <p className="text-xs text-destructive">{state.errors.projectType}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_budget">Orçamento estimado</Label>
          <select
            id="q_budget"
            name="budgetRange"
            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm"
            defaultValue=""
          >
            <option value="">A definir</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="q_deadline">Prazo</Label>
          <select
            id="q_deadline"
            name="deadline"
            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm"
            defaultValue=""
          >
            <option value="">Sem definição</option>
            {DEADLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3 */}
      <div className={cn(step === 2 ? "block" : "hidden")}>
        <div className="space-y-2">
          <Label htmlFor="q_message">Conte sobre o projeto *</Label>
          <Textarea
            id="q_message"
            name="message"
            rows={6}
            placeholder="Objetivo, público, referências, funcionalidades..."
          />
          {state.errors?.message && <p className="text-xs text-destructive">{state.errors.message}</p>}
        </div>

        <div className="mt-5 space-y-2">
          <Label>Anexos (opcional)</Label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground hover:border-white/25">
            <Paperclip className="size-4" />
            {uploading ? "Enviando..." : "Anexar briefing, referências (PDF, imagens)"}
            <input
              type="file"
              multiple
              hidden
              accept="image/*,application/pdf"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
          {files.length > 0 && (
            <ul className="space-y-1">
              {files.map((f, i) => (
                <li
                  key={f.url}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 text-xs"
                >
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {state.message && !state.ok && (
          <p className="mt-4 text-sm text-destructive">{state.message}</p>
        )}
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" /> Voltar
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" variant="gradient" onClick={() => setStep((s) => s + 1)}>
            Continuar <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button type="submit" variant="gradient" size="lg" disabled={pending || uploading}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enviar briefing
          </Button>
        )}
      </div>
    </form>
  );
}
