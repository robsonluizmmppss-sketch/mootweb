/**
 * PostgreSQL local para desenvolvimento — SEM Docker.
 * Usa `embedded-postgres` (binário real do PostgreSQL 17, sem daemon).
 *
 *   node scripts/pg.mjs start   # inicializa (1x) e MANTÉM o servidor no ar
 *   node scripts/pg.mjs stop    # derruba o servidor
 *   node scripts/pg.mjs status  # checa a porta
 *
 * IMPORTANTE: `start` fica em primeiro plano segurando o processo do Postgres.
 * Rode em um terminal dedicado (ou em background). Ctrl+C encerra o banco.
 *
 * Dados em ./.pgdata (gitignored). Credenciais == .env:
 *   postgresql://mootweb:mootweb@localhost:5432/mootweb
 */
import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import net from "node:net";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, ".pgdata");

const PORT = Number(process.env.PGPORT ?? 5432);
const USER = process.env.PGUSER ?? "mootweb";
const PASSWORD = process.env.PGPASSWORD ?? "mootweb";
const DB = process.env.PGDATABASE ?? "mootweb";

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function makePg() {
  const mod = await import("embedded-postgres");
  const EmbeddedPostgres = mod.default ?? mod;
  return new EmbeddedPostgres({
    databaseDir: dataDir,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    initdbFlags: ["--encoding=UTF8", "--locale=C"],
  });
}

async function start() {
  if (await checkPort(PORT)) {
    console.log(`[ok] Já existe Postgres escutando em :${PORT}. Nada a fazer.`);
    return;
  }

  // pid órfão de uma execução anterior
  const stalePid = path.join(dataDir, "postmaster.pid");
  if (existsSync(stalePid)) {
    try {
      rmSync(stalePid);
    } catch {}
  }

  const pg = await makePg();

  if (!existsSync(path.join(dataDir, "PG_VERSION"))) {
    console.log("[..] Inicializando cluster PostgreSQL em ./.pgdata (só na 1ª vez)...");
    await pg.initialise();
  }

  console.log("[..] Subindo PostgreSQL...");
  await pg.start();

  try {
    await pg.createDatabase(DB);
    console.log(`[ok] Banco "${DB}" criado.`);
  } catch (err) {
    const msg = String(err?.message ?? err);
    if (msg.includes("already exists")) console.log(`[ok] Banco "${DB}" já existe.`);
    else console.warn("[!!] createDatabase:", msg);
  }

  console.log(
    `\n[ok] PostgreSQL no ar — deixe este processo aberto:\n     postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DB}\n`,
  );

  let stopping = false;
  const shutdown = async (sig) => {
    if (stopping) return;
    stopping = true;
    console.log(`\n[..] ${sig} recebido — parando PostgreSQL...`);
    try {
      await pg.stop();
    } catch {}
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGBREAK", () => shutdown("SIGBREAK"));

  // mantém o event loop vivo indefinidamente
  setInterval(() => {}, 1 << 30);
}

async function stop() {
  const pg = await makePg();
  try {
    await pg.stop();
    console.log("[ok] PostgreSQL parado.");
  } catch (err) {
    console.warn("[!!] stop:", err?.message ?? err);
  }
  process.exit(0);
}

async function status() {
  const up = await checkPort(PORT);
  console.log(up ? `[ok] Porta :${PORT} ativa.` : `[--] Porta :${PORT} inativa.`);
  process.exit(up ? 0 : 1);
}

const cmd = process.argv[2] ?? "start";
({ start, stop, status })[cmd]?.() ?? start();
