"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Select de status que submete uma Server Action ao mudar.
 */
export function StatusSelect({
  action,
  id,
  value,
  options,
  extra,
  className,
}: {
  action: (fd: FormData) => void | Promise<void>;
  id: string;
  value: string;
  options: { value: string; label: string }[];
  extra?: Record<string, string>;
  className?: string;
}) {
  const [pending, start] = React.useTransition();

  return (
    <Select
      defaultValue={value}
      disabled={pending}
      onValueChange={(next) => {
        const fd = new FormData();
        fd.set("id", id);
        fd.set("status", next);
        for (const [k, v] of Object.entries(extra ?? {})) fd.set(k, v);
        start(() => {
          action(fd);
        });
      }}
    >
      <SelectTrigger className={className ?? "h-8 w-[150px] text-xs"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
