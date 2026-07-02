import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global._prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured.");
    const adapter = new PrismaPg({ connectionString: url });
    global._prisma = new PrismaClient({ adapter });
  }
  return global._prisma;
}
