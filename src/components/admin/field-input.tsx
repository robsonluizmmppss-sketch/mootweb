"use client";

import * as React from "react";
import type { FieldDef } from "@/lib/admin/types";
import { cn, slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toInputDate(v: any) {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function FieldInput({
  field,
  defaultValue,
  error,
  relationOptions,
  slugSource,
}: {
  field: FieldDef;
  defaultValue: any;
  error?: string;
  relationOptions?: { value: string; label: string }[];
  slugSource?: string;
}) {
  const id = `f_${field.name}`;
  const common = "space-y-2";

  const [slug, setSlug] = React.useState(defaultValue ?? "");
  const [touched, setTouched] = React.useState(Boolean(defaultValue));

  // auto-slug: escuta o campo de origem no mesmo form
  React.useEffect(() => {
    if (field.type !== "slug" || !field.slugFrom || touched) return;
    const form = document.getElementById(id)?.closest("form");
    const src = form?.querySelector<HTMLInputElement>(`[name="${field.slugFrom}"]`);
    if (!src) return;
    const handler = () => setSlug(slugify(src.value));
    src.addEventListener("input", handler);
    return () => src.removeEventListener("input", handler);
  }, [field, id, touched]);

  const labelEl = (
    <div className="flex items-center gap-2">
      <Label htmlFor={id}>{field.label}</Label>
      {field.required && <span className="text-xs text-destructive">*</span>}
    </div>
  );

  let control: React.ReactNode;

  switch (field.type) {
    case "boolean":
      control = (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <Switch id={id} name={field.name} defaultChecked={Boolean(defaultValue ?? field.default)} />
          <span className="text-sm">
            <span className="font-medium text-foreground">{field.label}</span>
            {field.help && (
              <span className="ml-1 text-muted-foreground">— {field.help}</span>
            )}
          </span>
        </div>
      );
      break;

    case "textarea":
    case "richtext":
      control = (
        <Textarea
          id={id}
          name={field.name}
          defaultValue={defaultValue ?? ""}
          rows={field.type === "richtext" ? 8 : 4}
          placeholder={field.placeholder}
        />
      );
      break;

    case "json":
      control = (
        <Textarea
          id={id}
          name={field.name}
          defaultValue={
            defaultValue ? JSON.stringify(defaultValue, null, 2) : ""
          }
          rows={6}
          className="font-mono text-xs"
          placeholder="{ }"
        />
      );
      break;

    case "number":
      control = (
        <Input
          id={id}
          name={field.name}
          type="number"
          defaultValue={defaultValue ?? field.default ?? ""}
          placeholder={field.placeholder}
        />
      );
      break;

    case "date":
      control = (
        <Input id={id} name={field.name} type="date" defaultValue={toInputDate(defaultValue)} />
      );
      break;

    case "select":
      control = (
        <Select name={field.name} defaultValue={defaultValue ?? (field.default as string) ?? undefined}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;

    case "relation":
      control = (
        <Select name={field.name} defaultValue={defaultValue ?? "__none__"}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Nenhum —</SelectItem>
            {relationOptions?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;

    case "tags":
      control = (
        <Input
          id={id}
          name={field.name}
          defaultValue={Array.isArray(defaultValue) ? defaultValue.join(", ") : (defaultValue ?? "")}
          placeholder="separe por vírgula"
        />
      );
      break;

    case "slug":
      control = (
        <Input
          id={id}
          name={field.name}
          value={slug}
          onChange={(e) => {
            setTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="slug-amigavel"
        />
      );
      break;

    case "image":
      control = (
        <Input
          id={id}
          name={field.name}
          defaultValue={defaultValue ?? ""}
          placeholder="/uploads/... ou https://..."
        />
      );
      break;

    default:
      control = (
        <Input
          id={id}
          name={field.name}
          defaultValue={defaultValue ?? ""}
          placeholder={field.placeholder}
        />
      );
  }

  return (
    <div className={cn(common, field.span === 2 && "sm:col-span-2")}>
      {field.type !== "boolean" && labelEl}
      {control}
      {field.help && field.type !== "boolean" && (
        <p className="text-xs text-muted-foreground/70">{field.help}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
