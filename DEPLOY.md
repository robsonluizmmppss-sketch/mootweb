# Deploy — Vercel + Supabase

Tudo já está preparado no repositório:

- `prisma/schema.prisma` com `directUrl` (pooler + conexão direta)
- `prisma/migrations/0_init` — migração inicial (todo o schema)
- `vercel.json` — build roda `prisma generate && prisma migrate deploy && next build`
- `scripts/deploy.mjs` — orquestra tudo (`npm run deploy`)

## Passo único que só você pode fazer: criar o banco no Supabase

1. Acesse <https://supabase.com/dashboard> → **New project**
   - Nome: `mootweb` · Região: **South America (São Paulo)** · defina uma **Database Password**
2. Aguarde ~2 min o provisionamento.
3. **Settings → Database → Connection string**, copie DUAS strings:
   - **Transaction** (porta **6543**, com `?pgbouncer=true`) → `SUPABASE_DB_URL_POOLED`
   - **Session** / direta (porta **5432**) → `SUPABASE_DB_URL_DIRECT`
   - troque `[YOUR-PASSWORD]` pela senha do passo 1 nas duas.

## Rodar o deploy

```bash
cp .env.deploy.example .env.deploy   # Windows: copy .env.deploy.example .env.deploy
# edite .env.deploy com as 2 strings do Supabase (e o domínio, se tiver)
npm run deploy
```

O script faz, automaticamente:

1. `vercel link` — cria o projeto na Vercel (você já está logado como `robsonluizmppss-9253`)
2. Sobe todas as variáveis de ambiente de produção
3. `prisma migrate deploy` — cria as tabelas no Supabase
4. `prisma db seed` — popula settings, menu, home, serviços, usuários, etc.
5. `vercel deploy --prod` — publica

No final imprime a URL e o login do painel:
**admin@mootweb.online / mootweb123** — troque a senha em `/admin/perfil`.

## Domínio mootweb.online

Depois do primeiro deploy: Vercel → Project → **Settings → Domains** → add `mootweb.online`
e aponte o DNS conforme as instruções da Vercel. O `AUTH_URL`/`NEXT_PUBLIC_SITE_URL`
já foram configurados para `https://mootweb.online` (ajuste no `.env.deploy` se mudar).

## Uploads em produção

O upload local grava em `public/uploads`, que **não persiste** em serverless (Vercel).
Para produção, configure um storage (Supabase Storage / S3 / UploadThing) — o driver
já está previsto em `src/app/api/upload/route.ts` (`STORAGE_DRIVER`).
