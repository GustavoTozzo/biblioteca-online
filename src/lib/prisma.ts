import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Driver adapter da Neon (WebSocket) em vez de TCP direto — recomendado pela
// própria Neon para ambientes serverless como a Vercel. Usa a connection
// string POOLED (DATABASE_URL); a direta (DIRECT_URL) só é usada por
// `prisma migrate`/`db push`, configurada em prisma.config.ts.
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
