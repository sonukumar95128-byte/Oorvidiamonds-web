// Prisma client — safe lazy initialization.
// The client is only created when first used, not when the module is imported.
// This prevents 503 crashes on Hostinger when the DB connection isn't ready at startup.

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global._prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured.");
    const adapter = new PrismaMariaDb(url);
    global._prisma = new PrismaClient({ adapter });
  }
  return global._prisma;
}
