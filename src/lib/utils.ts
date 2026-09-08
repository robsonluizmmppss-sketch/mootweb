import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge condicional de classes Tailwind sem conflitos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Gera slug amigável a partir de qualquer string. */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Formata data para pt-BR (ex: "12 de março de 2025"). */
export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(d);
}

/** Formata número compacto (2500 -> "2,5 mil"). */
export function formatCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(value);
}

/** Interpola {year} e afins em textos vindos do CMS. */
export function interpolate(text: string, vars: Record<string, string | number> = {}) {
  const merged = { year: new Date().getFullYear(), ...vars };
  return text.replace(/\{(\w+)\}/g, (_, k) =>
    String(merged[k as keyof typeof merged] ?? `{${k}}`),
  );
}

/** Constrói URL absoluta a partir do SITE_URL. */
export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Pausa util para skeletons/demos. */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
