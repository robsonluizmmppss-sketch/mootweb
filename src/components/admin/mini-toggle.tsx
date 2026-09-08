"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Toggle controlado, sem Radix e sem <label> em volta (evita clique duplo),
 * que persiste via uma Server Action `(id, value) => Promise<void>`.
 */
export function MiniToggle({
  id,
  checked,
  action,
  labels = ["ativo", "inativo"],
  onLabel,
}: {
  id: string;
  checked: boolean;
  action: (id: string, value: boolean) => Promise<void>;
  labels?: [string, string];
  onLabel?: (v: boolean) => string;
}) {
  const [value, setValue] = React.useState(checked);
  const [pending, start] = React.useTransition();

  React.useEffect(() => setValue(checked), [checked]);

  function toggle() {
    const next = !value;
    setValue(next);
    start(async () => {
      try {
        await action(id, next);
      } catch {
        setValue(!next);
        toast.error("Não foi possível salvar.");
      }
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={toggle}
      disabled={pending}
      className="flex items-center gap-2 text-xs text-muted-foreground disabled:opacity-60"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-white/10 transition-colors",
          value ? "bg-primary" : "bg-white/10",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
      <span className={value ? "text-accent" : ""}>
        {onLabel ? onLabel(value) : value ? labels[0] : labels[1]}
      </span>
    </button>
  );
}
