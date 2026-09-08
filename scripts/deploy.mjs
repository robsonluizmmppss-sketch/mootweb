/**
 * Deploy automático: Vercel + Supabase.
 * ---------------------------------------------------------------------------
 * Pré-requisitos:
 *   1) `vercel` CLI instalado e logado  (npx vercel login)
 *   2) Um projeto Postgres no Supabase já criado
 *   3) Um arquivo `.env.deploy` na raiz (gitignored) com:
 *
 *        SUPABASE_DB_URL_POOLED="postgresql://postgres.<ref>:<senha>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
 *        SUPABASE_DB_URL_DIRECT="postgresql://postgres.<ref>:<senha>@aws-0-<region>.pooler.supabase.com:5432/postgres"
 *        PROD_SITE_URL="https://mootweb.online"        # ou o domínio .vercel.app
 *        PROD_AUTH_SECRET=""                            # opcional; gerado se vazio
 *        # opcionais:
 *        SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASSWORD= SMTP_FROM=
 *        NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_GTM_ID= NEXT_PUBLIC_FB_PIXEL_ID=
 *
 * Uso:  npm run deploy
 */
import { execFileSync, execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";

try {
  process.loadEnvFile?.(".env.deploy");
} catch {}

const {
  SUPABASE_DB_URL_POOLED,
  SUPABASE_DB_URL_DIRECT,
  PROD_SITE_URL,
} = process.env;

if (!existsSync(".env.deploy")) {
  fail(
    "Crie o arquivo .env.deploy na raiz (veja o cabeçalho de scripts/deploy.mjs).",
  );
}
if (!SUPABASE_DB_URL_POOLED || !SUPABASE_DB_URL_DIRECT) {
  fail("Defina SUPABASE_DB_URL_POOLED e SUPABASE_DB_URL_DIRECT em .env.deploy.");
}

const AUTH_SECRET =
  process.env.PROD_AUTH_SECRET?.trim() || randomBytes(32).toString("base64");
const SITE_URL = (PROD_SITE_URL || "").replace(/\/$/, "");

const OPTIONAL = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_GTM_ID",
  "NEXT_PUBLIC_FB_PIXEL_ID",
];

const ENV = {
  DATABASE_URL: SUPABASE_DB_URL_POOLED,
  DIRECT_URL: SUPABASE_DB_URL_DIRECT,
  AUTH_SECRET,
  AUTH_TRUST_HOST: "true",
  ...(SITE_URL ? { AUTH_URL: SITE_URL, NEXT_PUBLIC_SITE_URL: SITE_URL } : {}),
};
for (const k of OPTIONAL) if (process.env[k]) ENV[k] = process.env[k];

function fail(msg) {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}
function run(cmd, args, opts = {}) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  return execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });
}
function vercel(args, input) {
  return execFileSync("npx", ["--yes", "vercel@latest", ...args], {
    encoding: "utf8",
    shell: true,
    input,
    stdio: input ? ["pipe", "pipe", "inherit"] : ["inherit", "pipe", "inherit"],
  });
}

// 1. Link (cria o projeto na 1ª vez)
console.log("▶  Vinculando projeto Vercel…");
try {
  vercel(["link", "--yes"]);
} catch {
  fail("`vercel link` falhou. Rode `npx vercel login` e tente de novo.");
}

// 2. Variáveis de ambiente (production) — remove e recria para ficar idempotente
console.log("▶  Configurando variáveis de ambiente (production)…");
for (const [key, value] of Object.entries(ENV)) {
  try {
    vercel(["env", "rm", key, "production", "--yes"]);
  } catch {
    /* não existia */
  }
  vercel(["env", "add", key, "production"], `${value}\n`);
  console.log(`   ✓ ${key}`);
}

// 3. Migrations + seed no Supabase (conexão direta)
console.log("▶  Aplicando migrations no Supabase…");
run("npx", ["prisma", "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: SUPABASE_DB_URL_DIRECT, DIRECT_URL: SUPABASE_DB_URL_DIRECT },
});

console.log("▶  Populando o banco (seed)…");
try {
  run("npx", ["tsx", "prisma/seed.ts"], {
    env: {
      ...process.env,
      DATABASE_URL: SUPABASE_DB_URL_DIRECT,
      DIRECT_URL: SUPABASE_DB_URL_DIRECT,
    },
  });
} catch {
  console.warn("⚠  Seed falhou (talvez já populado). Seguindo…");
}

// 4. Deploy de produção
console.log("▶  Publicando na Vercel (produção)…");
const out = vercel(["deploy", "--prod", "--yes"]);
const url = (out.match(/https:\/\/[^\s]+\.vercel\.app/) || [])[0] || out.trim();

console.log("\n────────────────────────────────────────");
console.log("✅  Deploy concluído!");
console.log(`   URL:      ${url}`);
if (SITE_URL) console.log(`   Domínio:  ${SITE_URL} (configure o DNS na Vercel)`);
console.log("   Painel:   " + (SITE_URL || url) + "/admin");
console.log("   Login:    admin@mootweb.online / mootweb123  (troque a senha!)");
console.log("────────────────────────────────────────\n");

try {
  execSync("git add -A && git commit -q -m \"chore: config de deploy\" || exit 0", {
    stdio: "ignore",
    shell: true,
  });
} catch {}
