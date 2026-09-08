# Arquitetura — MootWeb

## Princípios

1. **Nada hard-coded no site.** Toda seção pública lê de `src/lib/content.ts`,
   que resolve conteúdo do banco (Prisma) e cai para `src/lib/mock-data.ts`
   quando o banco está indisponível ou vazio. O painel (Fase 2) edita as mesmas
   estruturas.
2. **Server-first.** Componentes são _React Server Components_ por padrão.
   `"use client"` só entra onde há estado, efeitos ou animação
   (`navbar`, `hero`, `reveal`, `grid-background`, `accordion`, `providers`).
3. **Design System como fonte única de verdade visual.**
   Tokens em `globals.css` (`:root` / `.dark`), utilitários de marca em
   `@layer components/utilities`, e mapeamento no `tailwind.config.ts`.
4. **Schema completo desde o início.** `prisma/schema.prisma` modela todo o
   domínio (auth, CRM, blog, mídias, logs…) para que as próximas fases só
   adicionem UI/rotas — sem migrations disruptivas.

## Fluxo de dados (site público)

```
Página (RSC)  ──►  lib/content.ts  ──►  lib/prisma.ts (safeQuery)
                        │                     │
                        │                     ├─ OK  ─► PostgreSQL
                        │                     └─ erro ─► lib/mock-data.ts (fallback)
                        ▼
                  tipos em types/content.ts  ──►  componentes de seção
```

- `getSiteSettings()`, `getHeaderNav()`, `getHomeContent()` são memoizados com
  `React.cache()` (dedupe por request).
- A Home usa **ISR** (`export const revalidate = 300`). Na Fase 2 o painel
  dispara `revalidatePath`/`revalidateTag` ao salvar.

## Camadas

| Pasta                | Responsabilidade                                        |
| -------------------- | ----------------------------------------------------- |
| `app/`               | Rotas, layouts, metadata, error boundaries            |
| `components/ui`      | Primitivos sem regra de negócio                       |
| `components/shared`  | Blocos reutilizáveis com alguma lógica de apresentação |
| `components/sections`| Seções compostas de página (recebem dados via props)  |
| `components/layout`  | Navbar / Footer                                       |
| `lib/`               | Acesso a dados, helpers puros                         |
| `providers/`         | Contextos de cliente (tema, query, toasts)            |
| `types/`             | Contrato de tipos entre CMS e front                   |

## Próximas fases (resumo técnico)

- **Auth:** Auth.js v5 (`auth.ts` + middleware), `PrismaAdapter`, provider
  Credentials com `bcryptjs`, RBAC por `User.role`. Recuperação de senha via
  `PasswordResetToken` + SMTP.
- **Painel:** grupo de rotas `app/(admin)/` com layout próprio (sidebar
  recolhível, tema escuro fixo), Server Actions para mutações, TanStack Query
  para listas/filtros, `zod` + `react-hook-form` nos formulários.
- **Uploads:** driver `local` (disco em `public/uploads`) ou `s3` (compatível),
  `MediaFolder`/`MediaAsset`, compressão e blurhash na ingestão.
- **Segurança:** middleware de rate limit, headers já em `next.config.mjs`,
  validação/sanitização de todo input, CSRF nos formulários públicos.
