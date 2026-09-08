/**
 * Remove o fundo sólido da logo enviada pelo cliente (raster) gerando um PNG
 * com transparência real. Rode uma vez:  node scripts/logo-transparent.mjs
 *
 * Estratégia: chroma-key pela cor do canto (fundo sólido) com tolerância +
 * "feather" nas bordas anti-aliased. Também descontamina a franja escura
 * dividindo a cor pelo alfa (unpremultiply aproximado).
 */
import sharp from "sharp";
import { existsSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backup = path.join(root, "public/brand/mootweb-logo-original.png");
const src = existsSync(backup)
  ? backup
  : path.join(root, "public/brand/mootweb-logo.png");
const out = path.join(root, "public/brand/mootweb-logo.png");

if (!existsSync(src)) {
  console.error("Arquivo não encontrado:", src);
  process.exit(1);
}
if (!existsSync(backup)) copyFileSync(src, backup);

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// cor de fundo = média dos 4 cantos
function at(x, y) {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2]];
}
const corners = [
  at(0, 0),
  at(width - 1, 0),
  at(0, height - 1),
  at(width - 1, height - 1),
];
const bg = [0, 1, 2].map(
  (c) => Math.round(corners.reduce((s, p) => s + p[c], 0) / corners.length),
);

const NEAR = 26; // <= transparente
const FAR = 70; // >= opaco (entre os dois: feather)

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const dist = Math.max(
    Math.abs(r - bg[0]),
    Math.abs(g - bg[1]),
    Math.abs(b - bg[2]),
  );

  let a;
  if (dist <= NEAR) a = 0;
  else if (dist >= FAR) a = data[i + 3];
  else a = Math.round(((dist - NEAR) / (FAR - NEAR)) * data[i + 3]);

  // descontamina a franja: remove a contribuição do fundo (unpremultiply)
  if (a > 0 && a < 255) {
    const k = a / 255;
    data[i] = clamp((r - bg[0] * (1 - k)) / k);
    data[i + 1] = clamp((g - bg[1] * (1 - k)) / k);
    data[i + 2] = clamp((b - bg[2] * (1 - k)) / k);
  }
  data[i + 3] = a;
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(
  `✔  Logo transparente (fundo ${bg.join(",")} removido): ${path.relative(root, out)} (${width}x${height})`,
);
