import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moveu a configuração de datasource pra cá (schema.prisma não aceita
// mais `url`/`directUrl`). Usamos a connection string DIRETA (sem "-pooler")
// aqui — é a usada por `prisma migrate`/`db push` — e a POOLED fica só para o
// PrismaClient em runtime via driver adapter (ver src/lib/prisma.ts), que é
// quem realmente serve as requisições da aplicação na Vercel.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
