"use client";

import * as React from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { toggleBoolean } from "@/server/actions/crud";

export function InlineToggle({
  resource,
  id,
  field,
  checked,
}: {
  resource: string;
  id: string;
  field: string;
  checked: boolean;
}) {
  const [value, setValue] = React.useState(checked);
  const [pending, startTransition] = React.useTransition();

  // Sincroniza com a verdade do servidor após revalidação (evita estado preso).
  React.useEffect(() => {
    setValue(checked);
  }, [checked]);

  return (
    <Switch
      checked={value}
      disabled={pending}
      onCheckedChange={(next) => {
        setValue(next); // otimista
        startTransition(async () => {
          try {
            const fd = new FormData();
            fd.set("__resource", resource);
            fd.set("__id", id);
            fd.set("__field", field);
            fd.set("__value", String(next));
            await toggleBoolean(fd);
          } catch {
            setValue(!next); // reverte
            toast.error("Não foi possível salvar. Tente de novo.");
          }
        });
      }}
    />
  );
}
