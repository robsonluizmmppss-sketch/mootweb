import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Coletor de eventos de analytics do próprio site.
 * Best-effort: nunca falha a navegação do usuário.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      path?: string;
      referrer?: string;
      sessionId?: string;
      metadata?: Record<string, unknown>;
    };
    if (!body?.name) return NextResponse.json({ ok: false }, { status: 400 });

    await prisma.analyticsEvent.create({
      data: {
        name: body.name.slice(0, 60),
        path: body.path?.slice(0, 300) ?? null,
        referrer: body.referrer?.slice(0, 300) ?? null,
        sessionId: body.sessionId?.slice(0, 64) ?? null,
        metadata: body.metadata as object | undefined,
      },
    });
  } catch {
    /* ignora */
  }
  return NextResponse.json({ ok: true });
}
