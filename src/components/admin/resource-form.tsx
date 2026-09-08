"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";

import type { ResourceDef } from "@/lib/admin/types";
import { saveRecord, type CrudState } from "@/server/actions/crud";
import { FieldInput } from "./field-input";
import { Button } from "@/components/ui/button";

const initial: CrudState = { ok: false, message: "" };

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ResourceForm({
  resource,
  record,
  relationOptions,
}: {
  resource: ResourceDef;
  record: any | null;
  relationOptions: Record<string, { value: string; label: string }[]>;
}) {
  const [state, action, pending] = useActionState(saveRecord, initial);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="__resource" value={resource.key} />
      {record?.id && <input type="hidden" name="__id" value={record.id} />}

      {state.message && !state.ok && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="card-premium grid gap-5 rounded-2xl p-6 sm:grid-cols-2">
        {resource.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            defaultValue={record?.[f.name] ?? f.default}
            error={state.errors?.[f.name]}
            relationOptions={relationOptions[f.name]}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="gradient" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {record?.id ? "Salvar alterações" : "Criar"}
        </Button>
        <Link
          href={`/admin/${resource.key}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
