import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { MediaType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { logActivity } from "@/lib/admin/log";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED: Record<string, MediaType> = {
  "image/png": "IMAGE",
  "image/jpeg": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
  "image/svg+xml": "SVG",
  "image/avif": "IMAGE",
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "application/pdf": "PDF",
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "geral");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Arquivo acima de 15 MB" }, { status: 413 });
  }
  const type = ALLOWED[file.type];
  if (!type) {
    return NextResponse.json({ error: `Tipo não suportado: ${file.type}` }, { status: 415 });
  }

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const base = slugify(path.basename(file.name, path.extname(file.name))).slice(0, 40) || "arquivo";
  const safeFolder = slugify(folder) || "geral";
  const filename = `${base}-${randomBytes(4).toString("hex")}${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/${safeFolder}/${filename}`;

  const asset = await prisma.mediaAsset.create({
    data: {
      name: file.name,
      url,
      type,
      mimeType: file.type,
      size: file.size,
    },
  });
  await logActivity({ action: "media.upload", entityType: "MediaAsset", entityId: asset.id });

  return NextResponse.json({ url, id: asset.id, name: asset.name, type });
}
