# Decisões — Fase 2 (setup)

## Prisma 7 mudou a configuração de datasource — schema.prisma não aceita mais `url`/`directUrl`

O plano original (`docs/modelagem-dados.md`) foi desenhado com a sintaxe clássica do Prisma (`datasource db { url = env(...) directUrl = env(...) }`). Ao rodar `prisma generate` pela primeira vez, o Prisma 7.10.0 (a versão estável instalada — `latest` no npm aponta pra `8.0.0-rc.15`, uma release candidate, deliberadamente evitada aqui) recusou o schema:

```
error: The datasource property `url` is no longer supported in schema files.
error: The datasource property `directUrl` is no longer supported in schema files.
```

Prisma 7 moveu toda a configuração de conexão para um `prisma.config.ts` na raiz do projeto (`datasource.url`, lido via o helper `env()`), e passou a exigir um **driver adapter** para o `PrismaClient` em vez de deixar o engine Rust abrir a conexão sozinho. `schema.prisma` agora só declara `provider = "postgresql"`, sem nenhuma URL.

**Configuração final**:
- `prisma.config.ts` → `datasource.url = env("DIRECT_URL")` (a connection string *direta*, sem `-pooler`) — é o que `prisma migrate`/`prisma generate` usam.
- `src/lib/prisma.ts` → `PrismaClient` instanciado com `@prisma/adapter-neon` (driver WebSocket da própria Neon, pacote `@neondatabase/serverless` + `ws`), usando `DATABASE_URL` (a *pooled*) — é o que a aplicação usa em runtime.

Motivo de manter os dois: `DIRECT_URL` para migração evita qualquer ambiguidade com o pooler da Neon (PgBouncer) durante `migrate dev`/`db push`; `DATABASE_URL` pooled + driver WebSocket da Neon é o padrão recomendado pela própria Neon para ambientes serverless como a Vercel, onde abrir uma conexão TCP direta por invocação de função seria caro. Testado ao vivo: `prisma generate` e `prisma migrate dev --name init` rodaram sem erro contra o Neon real, migração aplicada (`prisma/migrations/20260915004512_init/`).

## pnpm 12: build scripts de dependências agora exigem aprovação explícita

`create-next-app` já tinha gerado um `pnpm-workspace.yaml` com um bloco `allowBuilds` pedindo decisão sobre `@prisma/engines`/`prisma` (`true`/`false`) — versão nova do pnpm bloqueia scripts de instalação (`postinstall` etc.) de dependências por padrão, por segurança. Setei `true` para `@prisma/engines`, `prisma`, `esbuild`, `msgpackr-extract` e `workerd` (todos baixam binários pré-compilados oficiais dos próprios pacotes, nada de terceiros) e `false` pro que já veio do scaffold (`sharp`, `unrs-resolver`, não usados agora). **Importante**: o campo `"pnpm"` dentro de `package.json` (onde eu tentei primeiro) não é mais lido por versões recentes do pnpm — a configuração correta vive em `pnpm-workspace.yaml`.

## NextAuth/Auth.js v5 (beta) — Credentials + JWT

`next-auth@5.0.0-beta.32` é a versão atual (v5 ainda não saiu do beta). Confirmei via os `.d.ts` do pacote instalado (não só documentação, que pode datar de betas anteriores) que o wrapper `auth((req) => {...})` usado em `src/proxy.ts` estende `NextRequest` com `req.auth: Session | null` — é assim que o guard de rota lê a sessão sem precisar de outra chamada. Sessão é só JWT (Credentials provider não suporta database sessions no Auth.js), por isso não há tabelas de adapter no schema Prisma — decisão já registrada em `docs/modelagem-dados.md`.

## Next.js 16: `proxy.ts`, não `middleware.ts`

Confirmado em `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`: o arquivo se chama `proxy.ts`, exporta a função como default ou nomeada `proxy`, roda em runtime Node.js por padrão (bom — `auth()` e, futuramente, qualquer checagem que precise do Prisma funcionam sem restrição de Edge runtime). `src/proxy.ts` guarda `/admin/**` (exige papel `ADMINISTRADOR`) e as rotas que vão existir nas próximas fases (`/carrinho`, `/planos/*/checkout`, `/meus-livros`, `/perfil`) — os matchers já apontam pra essas rotas mesmo antes delas existirem, sem problema.

## CSP reaproveitada de `farmacia-do-povo` sem re-derivar

Mesma decisão e mesmo motivo documentados lá: CSP com nonce exige renderização dinâmica em toda página que o usa (incompatível com páginas estáticas que teremos, como a home do catálogo), e `script-src 'self'` estrito sem `'unsafe-inline'` quebra o próprio bootstrap do App Router em produção (scripts inline de streaming de RSC). `next.config.ts` usa `script-src 'self' 'unsafe-inline'` com todo o resto estrito, mais `img-src` liberando `covers.openlibrary.org` (capas de livro buscadas pelo admin na Fase 3).

## Porta e wrapper

`biblioteca-online-dev`, porta **3030** (próxima livre), `dev-biblioteca-online.cmd` na raiz de Projetos, entrada adicionada em `.claude/launch.json`.

## Pendente para as próximas fases

CI (`ci.yml`) hoje só faz `install`/`typecheck`/`lint`/`build` — nenhuma página ainda consulta o Prisma em build-time (SSG), então não precisa de `DATABASE_URL` como secret do GitHub Actions. Isso muda assim que alguma página estática (ex.: a home do catálogo) buscar livros do banco em build — nesse ponto, ou a página vira dinâmica (`export const dynamic = 'force-dynamic'`), ou o CI ganha um `DATABASE_URL`/`DIRECT_URL` de secret apontando pra um branch/DB de CI. Decidir isso quando a Fase 3 chegar lá, não antes.
