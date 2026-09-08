"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accordion CSS-only (grid-template-rows: 0fr → 1fr).
 * Sem dependência de animação por requestAnimationFrame.
 */

interface AccordionContextValue {
  open: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
}: {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState<string[]>(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [],
  );

  const toggle = React.useCallback(
    (value: string) => {
      setOpen((prev) => {
        const isOpen = prev.includes(value);
        if (type === "single") return isOpen ? [] : [value];
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      });
    },
    [type],
  );

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <div className={cn("divide-y divide-white/10", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem deve estar dentro de <Accordion>");
  const isOpen = ctx.open.includes(value);

  return (
    <div className="py-2">
      <h3>
        <button
          type="button"
          onClick={() => ctx.toggle(value)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-accent"
        >
          <span className="text-pretty">{question}</span>
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300",
              isOpen && "rotate-45 border-primary/40 bg-primary/10 text-accent",
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pr-12 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
