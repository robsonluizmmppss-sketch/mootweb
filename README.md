# MootWeb — Plataforma Premium

Plataforma completa da agência **MootWeb**: site institucional de alta conversão +
CMS próprio + CRM + painel administrativo. Construída com padrão _enterprise_ para
parecer um produto SaaS de nível internacional.

> **Status:** funcional ponta a ponta — site público, formulários, autenticação,
> RBAC e painel administrativo completo. Detalhes no [Roadmap](#roadmap).

---

## Stack

| Camada        | Tecnologia                                                       |
| ------------- | --------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router) · React 19 · TypeScript                 |
| Estilo        | TailwindCSS · Design System próprio (shadcn-compatible)         |
| Animação      | Framer Motion                                                   |
| Ícones        | Lucide                                                          |
| Dados/estado  | TanStack Query · React Hook Form · Zod                          |
| ORM / Banco   | Prisma 6 · PostgreSQL 16                                        |
| Auth (Fase 2) | NextAuth / Auth.js (papéis: Admin · Editor · Visualizador)     |

---

## Pré-requisitos

- **Node.js 20.11+** (`node -v`)
- **npm 10+**
- PostgreSQL — **não é preciso instalar nada**: `npm run db:up` sobe um
  PostgreSQL 17 real e local via `embedded-postgres` (dados em `./.pgdata`).
  Alternativas: Docker (`npm run db:up:docker`) ou um Postgres próprio.

> **Windows:** o binário embutido do PostgreSQL precisa do
> _Visual C++ Redistributable 2015–2022 (x64)_. Se `npm run db:up` falhar com
> erro de DLL, instale com `winget install Microsoft.VCRedist.2015+.x64`.

---

## Setup rápido

```bash
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run setup                 # sobe o banco + cria tabelas + seed
npm run dev
```

Ou passo a passo:

```bash
npm run db:up      # PostgreSQL local (deixe rodando em um terminal)
npm run db:push    # cria as tabelas a partir do schema
npm run db:seed    # conteúdo inicial (settings, menu, home, projetos, usuários)
npm run dev
```

Abra <http://localhost:3000> · painel em <http://localhost:3000/admin>.

> **Antes do primeiro seed** a Home já renderiza usando `src/lib/mock-data.ts`
> (fallback automático via `safeQuery`).

### Credenciais do seed (uso na Fase 2)

| Papel  | E-mail                | Senha        |
| ------ | --------------------- | ------------ |
| Admin  | `admin@mootweb.com`   | `mootweb123` |
| Editor | `editor@mootweb.com`  | `mootweb123` |

---

## Scripts

| Comando              | Ação                                                     |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                            |
| `npm run build`      | `prisma generate` + build de produção                  |
| `npm run start`      | Servir o build                                         |
| `npm run lint`       | ESLint (next/core-web-vitals + typescript)             |
| `npm run typecheck`  | `tsc --noEmit`                                         |
| `npm run db:up`      | Sobe PostgreSQL + Adminer (Docker)                     |
| `npm run db:down`    | Derruba os containers                                  |
| `npm run db:push`    | Sincroniza o schema com o banco (sem migration)       |
| `npm run db:migrate` | Cria/aplica migration versionada                      |
| `npm run db:seed`    | Popula o banco com o conteúdo inicial                  |
| `npm run db:studio`  | Prisma Studio (GUI do banco)                           |
| `npm run db:reset`   | Recria o banco e roda o seed                           |

---

## Estrutura de pastas

```
moot/
├─ docker-compose.yml          # PostgreSQL 16 + Adminer
├─ .env.example                # Todas as variáveis documentadas
├─ prisma/
│  ├─ schema.prisma            # 40+ modelos (todo o domínio da plataforma)
│  └─ seed.ts                  # Conteúdo inicial (settings, menu, home, users…)
├─ public/
│  ├─ brand/                   # Arquivos da logo (placeholder por SVG até o upload)
│  └─ uploads/                 # Storage local de mídias (Fase 3)
└─ src/
   ├─ app/
   │  ├─ layout.tsx            # Root: fontes, metadata dinâmica, providers, analytics
   │  ├─ globals.css           # Tokens do Design System + utilitários
   │  ├─ icon.svg              # Favicon (convenção do App Router)
   │  ├─ opengraph-image.tsx   # OG image dinâmica (next/og)
   │  ├─ robots.ts / sitemap.ts
   │  ├─ error.tsx / not-found.tsx
   │  ├─ login/                # Placeholder do painel (Fase 2)
   │  └─ (site)/               # Grupo de rotas do site público
   │     ├─ layout.tsx         # GridBackground + Navbar + Footer
   │     ├─ page.tsx           # HOME (compõe todas as seções)
   │     ├─ loading.tsx        # Skeleton da Home
   │     ├─ portfolio · servicos · blog · sobre · contato · orcamento (placeholders)
   ├─ components/
   │  ├─ ui/                   # Primitivos: button, card, badge, accordion, skeleton
   │  ├─ layout/               # navbar, footer
   │  ├─ sections/             # hero, features, services, process, portfolio-preview,
   │  │                        #   stats-band, testimonials, partners, faq, cta, logo-marquee
   │  └─ shared/               # logo, icon, reveal, grid-background, section, project-card…
   ├─ lib/
   │  ├─ prisma.ts             # Client singleton + safeQuery (fallback p/ mock)
   │  ├─ content.ts            # Camada de conteúdo (DB → mock) consumida pelas páginas
   │  ├─ mock-data.ts          # Conteúdo padrão MootWeb (fonte do seed e do fallback)
   │  └─ utils.ts              # cn, slugify, formatDate, interpolate…
   ├─ providers/               # ThemeProvider (next-themes) + QueryProvider + Toaster
   └─ types/                   # Tipos de conteúdo (contrato front ↔ CMS)
```

---

## Design System

Definido em `src/app/globals.css` + `tailwind.config.ts`.

**Paleta** `#050816` `#081120` `#0F172A` `#2563EB` `#3B82F6` `#60A5FA` `#FFFFFF`

**Tokens** expostos como CSS vars (`--background`, `--primary`, `--radius`…) com
temas `dark` (padrão) e `light`, prontos para troca via painel.

**Utilitários de marca:**

| Classe            | Efeito                                             |
| ----------------- | ------------------------------------------------- |
| `.glass` / `.glass-strong` | Glassmorphism (blur + borda translúcida)   |
| `.card-premium`   | Card com borda em gradiente que acende no hover   |
| `.text-gradient` / `.text-gradient-blue` | Texto com gradiente da marca |
| `.bg-grid` / `.bg-grid-fade` | Grid tecnológico de fundo com máscara   |
| `.glow-ring`      | Sombra/halo azul                                 |
| `.hairline`       | Linha divisória futurista                        |
| `.pill`           | Badge translúcida                                |
| `.marquee`        | Faixa infinita de logos                          |

Animações padrão: `Reveal` / `RevealGroup` / `RevealItem` (fade + slide + blur ao
entrar na viewport), parallax no `GridBackground`, tilt 3D no visual do Hero.
Tudo respeita `prefers-reduced-motion`.

---

## Modelo de dados

`prisma/schema.prisma` já cobre **todo** o domínio da plataforma (mesmo o que só
será usado nas próximas fases), evitando migrations quebradas:

- **Auth:** `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`
- **Site:** `SiteSettings` (singleton), `PageSection` (blocos editáveis), `NavItem`
- **Portfólio:** `Project`, `ProjectImage`, `ProjectRelation`, `Category`, `Technology`, `ProjectTech`
- **Relacionamento:** `Client`, `Testimonial`, `TeamMember`, `Partner`
- **Serviços:** `Service`, `ProcessStep`
- **Blog:** `Post`, `PostCategory`, `Tag`, `PostTag`, `Comment`
- **Landing pages:** `LandingPage`
- **FAQ:** `FaqCategory`, `FaqItem`
- **CRM / Formulários:** `Quote`, `QuoteFile`, `Message`, `Lead`, `LeadNote`
- **SEO:** `SeoMeta` (por rota ou por entidade)
- **Marketing:** `Banner`, `Popup`, `Cta`
- **Infra:** `MediaFolder`, `MediaAsset`, `ActivityLog`, `BackupRecord`, `AnalyticsEvent`

---

## Roadmap

| Fase | Escopo | Status |
| ---- | ------ | ------ |
| **1** | Fundação · Design System · Home pública · schema completo · seed · banco local | ✅ |
| **2** | Auth (Auth.js) · painel admin (sidebar recolhível, tema escuro) · Dashboard com gráficos · RBAC (Admin/Editor/Visualizador) · motor de CRUD genérico (16 recursos) · Configurações · Menu · Páginas & Seções · Usuários · Perfil / troca de senha | ✅ |
| **3** | Serviços · Sobre · Contato · Orçamento (form multi-etapas + upload + e-mail) · CRM (Leads kanban · Mensagens · Orçamentos) | ✅ |
| **4** | Portfólio ponta a ponta (filtros por categoria, busca, tags, página de projeto premium, prev/next, relacionados) | ✅ |
| **5** | Blog (lista + artigo + categorias/tags) · Landing Pages (recurso no painel) | ✅ (editor rico e comentários: evolução) |
| **6** | Mídias/uploads (drag & drop, pastas) · Banners/Popups/CTA (via CRUD) · Analytics próprio · Logs de auditoria | ✅ (backup: evolução) |
| **7** | SEO (metadata dinâmica, sitemap, robots, OG dinâmico, SEO por rota) · headers de segurança · honeypot · rate limit (evolução) · Lighthouse | 🚧 parcial |

### O que já funciona

- **Site público**: Home (11 seções editáveis), Portfólio + página de projeto,
  Blog + artigo, Serviços + detalhe, Sobre, Contato, Orçamento (3 etapas + upload).
- **Autenticação**: login, logout, "esqueci a senha" (token + e-mail), redefinir
  e trocar senha, sessão JWT, middleware protegendo `/admin`.
- **Painel** (`/admin`): Dashboard (gráficos + KPIs + atividade), CRUD de Projetos,
  Categorias, Tecnologias, Serviços, Processo, FAQ, Clientes, Depoimentos, Equipe,
  Parceiros, Blog, Landing Pages, SEO, Banners, Popups, CTA — tudo via um motor
  genérico dirigido por `src/lib/admin/resources.ts`.
- **Bespoke**: Configurações (identidade, contato, redes, rodapé, aparência,
  analytics), Menu, Páginas & Seções (edição de payload JSON), Leads (CRM kanban),
  Mensagens, Orçamentos, Usuários (RBAC), Mídias, Logs, Analytics, Perfil.
- **Tudo editável pelo painel** — logo, textos, cores, links, SEO, pixels, etc.

---

## Convenções

- **TypeScript estrito**, imports via alias `@/*`.
- Componentes de servidor por padrão; `"use client"` só onde há interação/motion.
- Todo texto/imagem/cor do site vem de `content.ts` — nada _hard-coded_ nas seções.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`…).

---

## Licença

Proprietário — © MootWeb.
