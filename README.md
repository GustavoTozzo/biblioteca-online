# Biblioteca Online

Biblioteca digital fictícia (aluguel unitário de livros + assinatura mensal/semestral/anual), reconstruída em Next.js como peça de portfólio, sem fins comerciais. Especificação completa em [`docs/brief-original.md`](docs/brief-original.md).

Inspirada no projeto de bloco acadêmico entregue em `../biblioteca-infnet-main/` (Java + Spring Boot, arquitetura documentada em PDF) — aquele projeto fica intocado como artefato histórico; a implementação real (frontend + backend) começa do zero aqui, porque Vercel não hospeda apps Java/Spring de longa duração nem bancos MySQL.

## Status

- [x] **Fase 1** — Plano de design e modelagem de dados
- [x] **Fase 2** — Setup (Next.js 16, Tailwind v4, Prisma + Neon, NextAuth/Auth.js, CSP, CI) — decisões em [`docs/decisoes-fase-2.md`](docs/decisoes-fase-2.md)
- [ ] Fase 3 — Catálogo público + integração Open Library no admin
- [ ] Fase 4 — Fluxo de aluguel unitário
- [ ] Fase 5 — Fluxo de assinatura
- [ ] Fase 6 — Leitor interno simulado + progresso de leitura + perfil
- [ ] Fase 7 — Painel admin completo (CRUD de livros, usuários, exportação CSV)
- [ ] Fase 8 — Polish, testes, Lighthouse e deploy no Vercel — **bloqueada**: precisa de uma conta Vercel

## Documentos

- [`docs/brief-original.md`](docs/brief-original.md) — transcrição consolidada dos 2 PDFs originais: requisitos funcionais, casos de uso, dicionário de dados, e o que faltava no protótipo Java
- [`docs/plano-de-design.md`](docs/plano-de-design.md) — paleta, tipografia, wireframes ASCII, princípios de design
- [`docs/modelagem-dados.md`](docs/modelagem-dados.md) — schema Prisma completo e o porquê de cada decisão (granularidade do aluguel, integração Open Library, composição de "Meus Livros", o que nunca é persistido no pagamento simulado)
- [`docs/decisoes-fase-2.md`](docs/decisoes-fase-2.md) — mudança de configuração do Prisma 7 (datasource saiu do `schema.prisma`), driver adapter da Neon, NextAuth/Auth.js v5, CSP testada empiricamente

## Pendências

- [ ] Criar/confirmar conta na [Vercel](https://vercel.com) — necessário para o deploy final na Fase 8
- [ ] Definir credenciais do usuário administrador inicial (seed) — ficam só em `.env` local, nunca commitadas

Este projeto é 100% simulado no que toca pagamento: nenhuma integração com gateway real, nenhum dado financeiro real é coletado ou persistido.

## Como rodar localmente

```bash
pnpm install
pnpm dev            # http://localhost:3030
pnpm typecheck
pnpm lint
pnpm build && pnpm start   # build de produção
```

Precisa de um `.env` local (ver `.env.example`) com `DATABASE_URL`/`DIRECT_URL` (Neon) e `AUTH_SECRET`/`AUTH_URL`.
