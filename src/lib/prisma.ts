// Prisma client is initialized lazily — only creates a connection when getPrisma() is
// actually called, not at module import time. This prevents startup crashes if
// DATABASE_URL isn't set or the DB isn't immediately reachable (e.g. cold container start).

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const adapter = new PrismaMariaDb(url);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

// Convenience export for when you're sure the DB is configured
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  },
});
