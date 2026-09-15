# Modelagem de dados — Biblioteca Online

Schema Prisma para Postgres (Neon). Decisões e o porquê de cada uma, para não serem re-derivadas na Fase 2.

## Fonte de livros: Open Library, curada pelo admin

A [Open Library API](https://openlibrary.org/developers/api) é gratuita e não exige chave. Dois endpoints usados:

- `GET /search.json?q=...&limit=20&fields=key,title,author_name,first_publish_year,cover_i,ia,subject` — busca; retorna `key` (ex.: `/works/OL82563W`), título, autor(es), ano, `cover_i` (id da capa), `subject[]`. **Não traz descrição.**
- `GET /works/{id}.json` — traz `description`, que vem ora como `string`, ora como objeto `{type, value}` (confirmado testando `OL82563W` ao vivo) — o parser em `lib/open-library.ts` precisa tratar os dois formatos.
- Capas: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`.

O admin busca, escolhe um resultado, o formulário é pré-preenchido (título, autor, descrição, categoria = primeiro `subject`, capa) e ele **revisa antes de salvar**. Cadastro manual sem busca continua disponível. O catálogo público só lê a tabela `Livro` local — nunca chama a API externa ao vivo. Isso resolve o requisito 8 (cadastro de livro pelo admin) com dados reais, sem tornar o site público dependente de uptime/latência de um serviço de terceiros.

## Schema completo

> **Atualizado na Fase 2**: o bloco abaixo mostra a intenção original (Prisma clássico). O Prisma 7 (versão realmente instalada) não aceita mais `url`/`directUrl` dentro de `schema.prisma` — a configuração de conexão foi movida para `prisma.config.ts`, e o `PrismaClient` passou a exigir um driver adapter. Ver `docs/decisoes-fase-2.md` para a configuração real (`@prisma/adapter-neon`, `DIRECT_URL` para migração via `prisma.config.ts`, `DATABASE_URL` pooled para o adapter em runtime). O restante do schema abaixo (models, enums, relações) é o que foi implementado, sem mudanças.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled — runtime
  directUrl = env("DIRECT_URL")     // direta — só `prisma migrate` (evita erro de prepared statement do pgbouncer da Neon)
}

generator client {
  provider = "prisma-client-js"
}

enum TipoUsuario {       // mesmos nomes do enum Java (bibliotecainfnetapi.enums.TipoUsuario) — continuidade de domínio
  CLIENTE
  ADMINISTRADOR
}

enum FormaPagamento { PIX BOLETO CARTAO }   // idem ao enum Java
enum StatusPagamento { CONFIRMADO FALHOU }  // simulado: nunca fica "pendente" de verdade, sempre resolve na hora
enum StatusAluguel { ATIVO EXPIRADO CANCELADO }
enum StatusAssinatura { ATIVA EXPIRADA CANCELADA }
enum PlanoAssinatura { MENSAL SEMESTRAL ANUAL }

model Usuario {
  id             String   @id @default(cuid())
  nomeCompleto   String
  email          String   @unique
  senhaHash      String
  cpf            String   @unique
  dataNascimento DateTime
  telefone       String
  cep            String
  logradouro     String
  numero         String
  complemento    String?
  bairro         String
  cidade         String
  estado         String                     // UF, 2 letras
  papel          TipoUsuario @default(CLIENTE)
  criadoEm       DateTime @default(now())
  atualizadoEm   DateTime @updatedAt
  alugueis       Aluguel[]
  assinaturas    Assinatura[]
  progressos     ProgressoLeitura[]
}

model Livro {
  id            String   @id @default(cuid())
  titulo        String
  autor         String
  descricao     String   @db.Text
  categoria     String
  capaUrl       String?
  openLibraryId String?  @unique
  criadoEm      DateTime @default(now())
  atualizadoEm  DateTime @updatedAt
  itens         ItemAluguel[]
  progressos    ProgressoLeitura[]
  @@index([categoria])
}

model Aluguel {                             // 1 checkout de carrinho = 1 Aluguel (mesmo prazo em dias p/ todos os itens, igual ao protótipo Java)
  id             String   @id @default(cuid())
  usuarioId      String
  usuario        Usuario  @relation(fields: [usuarioId], references: [id])
  dias           Int
  dataInicio     DateTime @default(now())
  dataFim        DateTime
  valorTotal     Decimal  @db.Decimal(10,2) // = 2.50 * nº livros * dias
  formaPagamento FormaPagamento
  status         StatusAluguel @default(ATIVO)
  transacaoId    String?  @unique
  transacao      Transacao? @relation(fields: [transacaoId], references: [id])
  itens          ItemAluguel[]
  criadoEm       DateTime @default(now())
}

model ItemAluguel {                          // 1 linha por livro dentro do checkout
  id            String  @id @default(cuid())
  aluguelId     String
  aluguel       Aluguel @relation(fields: [aluguelId], references: [id], onDelete: Cascade)
  livroId       String
  livro         Livro   @relation(fields: [livroId], references: [id])   // onDelete Restrict (padrão) — protege histórico de aluguéis mesmo se o livro for removido do acervo
  valorUnitario Decimal @db.Decimal(10,2)
  @@unique([aluguelId, livroId])
}

model Assinatura {
  id                  String   @id @default(cuid())
  usuarioId           String
  usuario             Usuario  @relation(fields: [usuarioId], references: [id])
  plano               PlanoAssinatura
  dataInicio          DateTime @default(now())
  dataFim             DateTime
  valor               Decimal  @db.Decimal(10,2)
  formaPagamento      FormaPagamento          // validado no Zod: só PIX ou CARTAO (regra do briefing)
  status              StatusAssinatura @default(ATIVA)
  renovacaoAutomatica Boolean @default(false) // true quando cartão — só texto informativo, sem cron real
  transacaoId         String?  @unique
  transacao           Transacao? @relation(fields: [transacaoId], references: [id])
  criadoEm            DateTime @default(now())
}

model Transacao {                            // "pagamento" simulado — nunca guarda PAN/CVV
  id             String   @id @default(cuid())
  usuarioId      String
  formaPagamento FormaPagamento
  valor          Decimal  @db.Decimal(10,2)
  status         StatusPagamento @default(CONFIRMADO)
  codigoFake     String                       // chave Pix / linha digitável / código de autorização — sempre fake
  cartaoFinal4   String?                      // só os 4 últimos dígitos, se CARTAO
  criadoEm       DateTime @default(now())
  aluguel        Aluguel?
  assinatura     Assinatura?
}

model ProgressoLeitura {                      // requisito 6: "retoma de onde parou"
  id           String   @id @default(cuid())
  usuarioId    String
  usuario      Usuario  @relation(fields: [usuarioId], references: [id])
  livroId      String
  livro        Livro    @relation(fields: [livroId], references: [id])
  percentual   Int      @default(0)           // 0–100
  atualizadoEm DateTime @updatedAt
  @@unique([usuarioId, livroId])
}
```

## Por que não há tabelas de adapter do NextAuth

Com Credentials provider, o Auth.js só suporta sessão JWT (não database sessions) — então as tabelas padrão do adapter (`Account`, `Session`, `VerificationToken`) seriam infraestrutura sem uso real aqui. O schema fica só com o domínio de negócio.

## "Meus Livros" — regra de composição

Não é uma tabela — é uma função (`lib/meus-livros.ts`) que une, no momento da consulta:

1. Livros com `ItemAluguel` cujo `Aluguel.status = ATIVO` e `dataFim >= now()`.
2. Se existir `Assinatura` com `status = ATIVA` e `dataFim >= now()`: o catálogo inteiro.

Deduplicado por `livro.id`; cada item carrega `origem: 'ALUGUEL' | 'ASSINATURA'` e, quando for aluguel, a `dataFim` para exibir "disponível até".

## Granularidade do carrinho

O carrinho em si **não é uma tabela** — vive só no cliente (Context + `localStorage`, apenas os IDs dos livros). Só vira `Aluguel` + `ItemAluguel[]` no momento do checkout. Isso evita ter que sincronizar carrinho entre abas/dispositivos (fora de escopo de portfólio) e evita reproduzir o bug de escopo do `Carrinho` `@Component` singleton do Spring original, que num app real multiusuário vazaria entre sessões.

## Pagamento simulado — o que nunca é persistido

`Transacao` nunca tem coluna para número completo de cartão nem CVV. O formulário de checkout com cartão calcula `cartaoFinal4` **no client** a partir do número digitado e só esse valor (+ nome impresso) chega ao Server Action — o restante do número e o CVV nunca saem do formulário. Pix e Boleto geram apenas strings fake (`codigoFake`) sem nenhuma chamada a gateway real. Todo pagamento é confirmado na hora (replica a UX do protótipo Java, que também liberava o livro imediatamente).
