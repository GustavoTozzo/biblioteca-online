# Biblioteca Online

Biblioteca digital fictícia (aluguel unitário de livros + assinatura mensal/semestral/anual), reconstruída em Next.js como peça de portfólio, sem fins comerciais. Especificação completa em [`docs/brief-original.md`](docs/brief-original.md).

Inspirada no projeto de bloco acadêmico entregue em `../biblioteca-infnet-main/` (Java + Spring Boot, arquitetura documentada em PDF) — aquele projeto fica intocado como artefato histórico; a implementação real (frontend + backend) começa do zero aqui, porque Vercel não hospeda apps Java/Spring de longa duração nem bancos MySQL.

## Status

- [x] **Fase 1** — Plano de design e modelagem de dados
- [x] **Fase 2** — Setup (Next.js 16, Tailwind v4, Prisma + Neon, NextAuth/Auth.js, CSP, CI) — decisões em [`docs/decisoes-fase-2.md`](docs/decisoes-fase-2.md)
- [x] **Fase 3** — Catálogo público, cadastro/login, painel admin com busca na Open Library — decisões em [`docs/decisoes-fase-3.md`](docs/decisoes-fase-3.md)
- [x] **Fase 4** — Fluxo de aluguel unitário (carrinho, checkout, pagamento simulado, "Meus Livros") — decisões em [`docs/decisoes-fase-4.md`](docs/decisoes-fase-4.md)
- [x] **Fase 5** — Fluxo de assinatura (planos, checkout Pix/cartão, "Meus Livros" com acesso total) — decisões em [`docs/decisoes-fase-5.md`](docs/decisoes-fase-5.md)
- [x] **Fase 6** — Leitor interno simulado, progresso de leitura e perfil — decisões em [`docs/decisoes-fase-6.md`](docs/decisoes-fase-6.md)
- [x] **Fase 7** — Painel admin completo (lista de usuários, exportação CSV) — decisões em [`docs/decisoes-fase-7.md`](docs/decisoes-fase-7.md)
- [x] **Fase 8** — Polish + deploy no Vercel — decisões em [`docs/decisoes-fase-8.md`](docs/decisoes-fase-8.md)

**No ar:** [biblioteca-online-snowy.vercel.app](https://biblioteca-online-snowy.vercel.app/) — ajustes pós-deploy (bug de redirecionamento, catálogo em português consistente, capas em alta resolução, refresh visual) documentados em [`docs/decisoes-pos-deploy.md`](docs/decisoes-pos-deploy.md). A página [`/gratuitos`](https://biblioteca-online-snowy.vercel.app/gratuitos) traz uma pequena vitrine de livros de domínio público com download direto, verificados manualmente — decisões em [`docs/decisoes-acervo-gratuito.md`](docs/decisoes-acervo-gratuito.md).

## Documentos

- [`docs/brief-original.md`](docs/brief-original.md) — transcrição consolidada dos 2 PDFs originais: requisitos funcionais, casos de uso, dicionário de dados, e o que faltava no protótipo Java
- [`docs/plano-de-design.md`](docs/plano-de-design.md) — paleta, tipografia, wireframes ASCII, princípios de design
- [`docs/modelagem-dados.md`](docs/modelagem-dados.md) — schema Prisma completo e o porquê de cada decisão (granularidade do aluguel, integração Open Library, composição de "Meus Livros", o que nunca é persistido no pagamento simulado)
- [`docs/decisoes-fase-2.md`](docs/decisoes-fase-2.md) — mudança de configuração do Prisma 7 (datasource saiu do `schema.prisma`), driver adapter da Neon, NextAuth/Auth.js v5, CSP testada empiricamente
- [`docs/decisoes-fase-3.md`](docs/decisoes-fase-3.md) — integração Open Library confirmada em uso real, padrão `signIn(FormData)` com `redirectTo`, papel do usuário nunca vem do formulário público, validação de CPF (checksum), exclusão de livro protegida por integridade referencial
- [`docs/decisoes-fase-4.md`](docs/decisoes-fase-4.md) — carrinho com `useSyncExternalStore`, Server Action chamada fora de formulário via `useActionState`+`startTransition`, servidor nunca confia em preço/dados vindos do cliente, cartão nunca persiste além dos 4 últimos dígitos
- [`docs/decisoes-fase-5.md`](docs/decisoes-fase-5.md) — assinatura só aceita Pix/cartão, contratar novo plano cancela o anterior, "Meus Livros" já estava pronto pra composição com assinatura desde a Fase 2
- [`docs/decisoes-fase-6.md`](docs/decisoes-fase-6.md) — barra de progresso sem `style` inline (CSP), acesso ao leitor sempre revalidado, e-mail/CPF não editáveis por design, bug de fuso na data de nascimento corrigido
- [`docs/decisoes-fase-7.md`](docs/decisoes-fase-7.md) — CSV corrige aspas não escapadas do protótipo Java, nunca exporta e-mail/senha, guard testado nas duas camadas (403 real + redirect)
- [`docs/decisoes-fase-8.md`](docs/decisoes-fase-8.md) — contraste WCAG calculado (todas as combinações passam AA), alt text real nas capas, bug de responsividade achado e corrigido, título por rota, catálogo expandido pra ~22 livros reais
- [`docs/decisoes-pos-deploy.md`](docs/decisoes-pos-deploy.md) — causa raiz do bug de redirecionamento pro localhost em produção (`AUTH_URL` nunca deve existir na Vercel), catálogo reescrito em português consistente, capas em resolução maior, refresh visual (`src/lib/ui.ts`), CSP `style-src` corrigida (achada só num build de produção real)
- [`docs/decisoes-acervo-gratuito.md`](docs/decisoes-acervo-gratuito.md) — metodologia de verificação dos livros de domínio público (por que a maioria dos itens do Internet Archive é empréstimo, não download), os 5 livros escolhidos, por que é uma lista estática e não um model no banco

Este projeto é 100% simulado no que toca pagamento: nenhuma integração com gateway real, nenhum dado financeiro real é coletado ou persistido.

## Como rodar localmente

```bash
pnpm install
pnpm db:seed        # cria o único usuário ADMINISTRADOR (ADMIN_SEED_EMAIL/PASSWORD no .env)
pnpm dev            # http://localhost:3030
pnpm typecheck
pnpm lint
pnpm build && pnpm start   # build de produção
```

Precisa de um `.env` local (ver `.env.example`) com `DATABASE_URL`/`DIRECT_URL` (Neon), `AUTH_SECRET`/`AUTH_URL` e `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`.
