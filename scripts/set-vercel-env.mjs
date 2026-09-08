/**
 * Define as variáveis de ambiente de produção na Vercel a partir de .env.deploy.
 *   node scripts/set-vercel-env.mjs
 */
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";

process.loadEnvFile(".env.deploy");

const POOLED = process.env.SUPABASE_DB_URL_POOLED.trim();
const DIRECT = process.env.SUPABASE_DB_URL_DIRECT.trim();
const SITE = (process.env.PROD_SITE_URL || "").trim().replace(/\/$/, "");
const SECRET = process.env.PROD_AUTH_SECRET?.trim() || randomBytes(32).toString("base64");

const ENV = {
  DATABASE_URL: POOLED,
  DIRECT_URL: DIRECT,
  AUTH_SECRET: SECRET,
  AUTH_TRUST_HOST: "true",
};
if (SITE) {
  ENV.AUTH_URL = SITE;
  ENV.NEXT_PUBLIC_SITE_URL = SITE;
}
if (process.env.SMTP_FROM) ENV.SMTP_FROM = process.env.SMTP_FROM.trim();

const NODE = process.execPath;
const VC_JS = `${process.env.APPDATA}\\npm\\node_modules\\vercel\\dist\\index.js`;

function vc(args, input) {
  return execFileSync(NODE, [VC_JS, ...args], {
    encoding: "utf8",
    input,
    stdio: input ? ["pipe", "pipe", "pipe"] : ["pipe", "pipe", "pipe"],
  });
}

for (const [k, v] of Object.entries(ENV)) {
  try {
    vc(["env", "rm", k, "production", "--yes"]);
  } catch {}
  try {
    vc(["env", "add", k, "production"], `${v}\n`);
    console.log(`  ✓ ${k}`);
  } catch (e) {
    console.error(`  ✗ ${k}: ${String(e.stderr || e.message).slice(0, 200)}`);
  }
}
console.log("\nVariáveis de produção configuradas na Vercel.");
