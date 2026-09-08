import type { Role } from "@prisma/client";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "date"
  | "image"
  | "slug"
  | "json"
  | "relation"
  | "password";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** para select */
  options?: { value: string; label: string }[];
  /** para relation */
  relationTo?: string; // nome do model Prisma (ex: "category")
  relationLabel?: string; // campo exibido (ex: "name")
  /** para slug: campo de origem */
  slugFrom?: string;
  /** coluna some do formulário (só leitura em listas) */
  listOnly?: boolean;
  /** não aparece na listagem */
  hideInList?: boolean;
  /** largura no grid do formulário */
  span?: 1 | 2;
  default?: unknown;
}

export interface ResourceDef {
  /** slug de rota: /admin/<key> */
  key: string;
  /** nome do model no Prisma Client (prisma[model]) */
  model: string;
  labelSingular: string;
  labelPlural: string;
  icon: string;
  minRole: Role; // papel mínimo para editar
  /** campos exibidos como colunas da tabela (nomes de fields) */
  listColumns: string[];
  /** campos pesquisáveis (contains) */
  searchable: string[];
  /** ordenação padrão */
  defaultSort?: { field: string; dir: "asc" | "desc" };
  /** habilita reordenação drag (campo `order`) */
  sortable?: boolean;
  /** habilita duplicar */
  duplicable?: boolean;
  fields: FieldDef[];
}
