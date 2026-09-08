/**
 * Deploy automático: Vercel + Supabase.
 * ---------------------------------------------------------------------------
 * Pré-requisitos:
 *   1) `vercel` CLI logado           →  npx vercel login
 *   2) Projeto Postgres no Supabase criado
 *   3) Arquivo `.env.deploy` na raiz (gitignored) — modelo: .env.deploy.example
 *
 * Uso:  npm run deploy
 */
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";

try {
  process.loadEnvFile?.(".env.deploy");
} catch {}

function fail(msg) {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}

if (!existsSync(".env.deploy")) {
  fail("Crie o arquivo .env.deploy (copie de .env.deploy.example e preencha).");
}

const POOLED = process.env.SUPABASE_DB_URL_POOLED?.trim();
const DIRECT = process.env.SUPABASE_DB_URL_DIRECT?.trim();
if (!POOLED || !DIRECT) {
  fail("Defina SUPABASE_DB_URL_POOLED e SUPABASE_DB_URL_DIRECT em .env.deploy.");
}

const AUTH_SECRET =
  process.env.PROD_AUTH_SECRET?.trim() || randomBytes(32).toString("base64");
const SITE_URL = (process.env.PROD_SITE_URL || "").trim().replace(/\/$/, "");

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
  DATABASE_URL: POOLED,
  DIRECT_URL: DIRECT,
  AUTH_SECRET,
  AUTH_TRUST_HOST: "true",
  ...(SITE_URL ? { AUTH_URL: SITE_URL, NEXT_PUBLIC_SITE_URL: SITE_URL } : {}),
};
for (const k of OPTIONAL) if (process.env[k]) ENV[k] = process.env[k];

// usa o vercel instalado; cai para npx se não achar
function vercelBin() {
  for (const c of ["vercel", "vercel.cmd"]) {
    try {
      execFileSync(c, ["--version"], { stdio: "ignore", shell: true });
      return c;
    } catch {}
  }
  return "npx vercel@latest";
}
const VC = vercelBin();

function vc(args, input) {
  return execFileSync(VC, args, {
    encoding: "utf8",
    shell: true,
    input,
    stdio: input ? ["pipe", "pipe", "inherit"] : ["inherit", "pipe", "inherit"],
  });
}
function pnpx(args, env) {
  console.log(`\n$ npx ${args.join(" ")}`);
  return execFileSync("npx", args, { stdio: "inherit", shell: true, env: { ...process.env, ...env } });
}

// 1. Link (idempotente)
console.log("▶  Vinculando projeto na Vercel…");
try {
  vc(["link", "--yes"]);
} catch {
  fail("`vercel link` falhou. Rode `npx vercel login` e tente de novo.");
}

// 2. Variáveis de ambiente (production)
console.log("▶  Configurando variáveis de ambiente (production)…");
for (const [key, value] of Object.entries(ENV)) {
  try {
    vc(["env", "rm", key, "production", "--yes"]);
  } catch {}
  vc(["env", "add", key, "production"], `${value}\n`);
  console.log(`   ✓ ${key}`);
}

// 3. Migrations + seed no Supabase (conexão direta)
console.log("▶  Aplicando migrations no Supabase…");
pnpx(["prisma", "migrate", "deploy"], { DATABASE_URL: DIRECT, DIRECT_URL: DIRECT });

console.log("▶  Populando o banco (seed)…");
try {
  pnpx(["tsx", "prisma/seed.ts"], { DATABASE_URL: DIRECT, DIRECT_URL: DIRECT });
} catch {
  console.warn("⚠  Seed pulado (provavelmente já populado).");
}

// 4. Deploy de produção
console.log("▶  Publicando na Vercel (produção)…");
const out = vc(["deploy", "--prod", "--yes"]);
const url =
  (String(out).match(/https:\/\/[a-z0-9-]+\.vercel\.app/i) || [])[0] ||
  String(out).trim().split(/\s+/).pop();

console.log("\n────────────────────────────────────────");
console.log("✅  Deploy concluído!");
console.log(`   URL:     ${url}`);
if (SITE_URL) console.log(`   Domínio: ${SITE_URL} (aponte o DNS na Vercel → Settings → Domains)`);
console.log(`   Painel:  ${SITE_URL || url}/admin`);
console.log("   Login:   admin@mootweb.online / mootweb123  (troque em /admin/perfil)");
console.log("────────────────────────────────────────\n");
