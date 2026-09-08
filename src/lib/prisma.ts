import { PrismaClient } from "@prisma/client";

/**
 * Instância única do Prisma (evita esgotar o pool em dev com HMR).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Executa uma query e devolve um fallback caso o banco esteja indisponível
 * (ex: primeira execução antes de `npm run db:up && npm run db:seed`).
 * Mantém a Home renderizável com dados mock durante a Fase 1.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[safeQuery] usando fallback — banco indisponível?", (err as Error).message);
    }
    return fallback;
  }
}
