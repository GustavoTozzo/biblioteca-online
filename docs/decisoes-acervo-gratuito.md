# Decisões — acervo gratuito (`/gratuitos`)

## Contexto

Durante o teste pós-deploy, foi perguntado se dava pra aproveitar a Open
Library pra trazer também livros de domínio público com download direto,
sem cadastro nem aluguel. A resposta curta é sim, mas com uma ressalva
importante: a Open Library é principalmente um **catálogo de metadados**
(título, autor, capa, sinopse) — ela não hospeda os arquivos. Quando ela
aponta um livro pro Internet Archive, a maioria desses itens é
**empréstimo controlado** (exige conta, tem fila de espera, o PDF que
chega é criptografado por DRM), não download livre. Listar isso como
"grátis" seria enganoso.

Por isso a decisão foi trazer só **5 exemplos reais**, verificados um a
um, pra mostrar a abordagem — não um catálogo automático.

## Metodologia de verificação

Pra cada candidato, dois passos antes de entrar na lista:

1. **`https://archive.org/metadata/{id}`** — conferir que a resposta
   *não* tem `"access-restricted-item": true` no bloco `metadata`, e que
   os arquivos listados em `files` incluem um `.pdf` sem sufixo
   `_encrypted` (item de empréstimo sempre inclui um
   `{id}_encrypted.pdf` cifrado, mesmo quando também lista um `.pdf`
   "normal" que na prática não abre fora do leitor deles).
2. **`HEAD` no link de download** (`https://archive.org/download/{id}/{arquivo}.pdf`)
   — confirmar `200 OK` e pegar o `Content-Length` real, usado no botão
   "Baixar PDF (X MB)" da interface (nunca um número estimado).

Também foi conferido que `https://archive.org/services/img/{id}` (capa
usada pela Open Library) resolve pra cada item.

## Os 5 livros escolhidos

| Livro | Autor | Tamanho confirmado |
|---|---|---|
| Alice no País das Maravilhas | Lewis Carroll | 8.4 MB |
| Orgulho e Preconceito | Jane Austen | 30.8 MB |
| Um Conto de Natal | Charles Dickens | 5.6 MB |
| Frankenstein | Mary Shelley | 23 MB |
| O Guarani | José de Alencar | 17.3 MB |

Critério de escolha: obras de domínio público bem conhecidas, com pelo
menos uma em português (O Guarani), digitalizadas por universidades
(Toronto, Cornell) — não scans amadores.

## Por que uma lista estática, não um model no banco

`src/lib/gratuitos.ts` é um array TypeScript comum, sem tabela no
Prisma nem CRUD no painel admin. São só 5 itens curados manualmente pra
demonstrar a ideia — um model + formulário de admin pra 5 registros
fixos seria complexidade sem propósito. Se o catálogo gratuito crescer
de verdade no futuro, aí sim vale reconsiderar.

## Segurança (CSP)

`archive.org` foi adicionado a `img-src` e a `images.remotePatterns`
em `next.config.ts` (necessário pro `next/image` otimizar as capas dos
5 livros). Os links de "Baixar PDF" apontam direto pro `archive.org` e
abrem em nova aba (`target="_blank" rel="noreferrer"`) — não passam
pelo `connect-src` porque não é fetch feito pela nossa aplicação, é
navegação do usuário.
