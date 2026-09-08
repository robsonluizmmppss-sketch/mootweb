import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

interface LogInput {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/** Registra uma ação no ActivityLog (best-effort, nunca lança). */
export async function logActivity({ action, entityType, entityId, metadata }: LogInput) {
  try {
    const user = await getCurrentUser();
    let ip: string | undefined;
    let userAgent: string | undefined;
    try {
      const h = await headers();
      ip =
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        undefined;
      userAgent = h.get("user-agent") ?? undefined;
    } catch {
      /* fora de request scope */
    }

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        metadata: metadata as object | undefined,
        userId: user?.id ?? null,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    console.warn("[logActivity] falhou:", (err as Error).message);
  }
}
