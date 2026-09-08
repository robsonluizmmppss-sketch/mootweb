"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import {
  saveSection,
  setSectionEnabled,
  setSectionOrder,
  type SectionState,
} from "@/server/actions/sections";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
const initial: SectionState = { ok: false, message: "" };

export function SectionEditor({ section }: { section: any }) {
  const [state, action, pending] = useActionState(saveSection, initial);
  const [open, setOpen] = React.useState(false);

  const [enabled, setEnabled] = React.useState<boolean>(section.enabled);
  const [order, setOrder] = React.useState<number>(section.order);
  const [saving, startSaving] = React.useTransition();

  React.useEffect(() => setEnabled(section.enabled), [section.enabled]);
  React.useEffect(() => setOrder(section.order), [section.order]);

  React.useEffect(() => {
    if (state.ok) toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);

  function toggle() {
    const next = !enabled;
    setEnabled(next); // otimista
    startSaving(async () => {
      try {
        await setSectionEnabled(section.id, next);
        toast.success(next ? "Seção visível" : "Seção ocultada");
      } catch {
        setEnabled(!next);
        toast.error("Não foi possível salvar.");
      }
    });
  }

  function commitOrder(value: number) {
    if (value === section.order || Number.isNaN(value)) return;
    startSaving(async () => {
      try {
        await setSectionOrder(section.id, value);
        toast.success("Ordem atualizada");
      } catch {
        setOrder(section.order);
        toast.error("Não foi possível salvar a ordem.");
      }
    });
  }

  return (
    <div className="card-premium rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{section.name}</p>
          <p className="text-xs text-muted-foreground">
            <code className="font-mono">
              {section.page}.{section.key}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle simples e controlado — sem Radix, sem <label> em volta */}
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? "Ocultar seção" : "Mostrar seção"}
            onClick={toggle}
            className="flex items-center gap-2 text-xs text-muted-foreground disabled:opacity-60"
          >
            <span
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full border border-white/10 transition-colors",
                enabled ? "bg-primary" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "inline-block size-5 rounded-full bg-white shadow transition-transform",
                  enabled ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </span>
            <span className={enabled ? "text-accent" : ""}>
              {enabled ? "visível" : "oculta"}
            </span>
          </button>

          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            onBlur={(e) => commitOrder(Number(e.target.value))}
            className="h-8 w-16"
            title="Ordem"
            disabled={saving}
          />

          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen((o) => !o)}>
            {open ? "Fechar JSON" : "Editar JSON"}
          </Button>
        </div>
      </div>

      {open && (
        <form action={action} className="mt-4">
          <input type="hidden" name="id" value={section.id} />
          <Textarea
            name="data"
            defaultValue={JSON.stringify(section.data ?? {}, null, 2)}
            rows={16}
            className="font-mono text-xs"
          />
          <div className="mt-3">
            <Button type="submit" variant="gradient" size="sm" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvar conteúdo
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
