# Decisões — Fase 3 (catálogo + Open Library no admin)

## Open Library: comportamento real confirmado em uso, não só em teste isolado

Testei a integração de ponta a ponta pelo próprio painel admin (não só via `curl`): busquei "Dom Casmurro", a Open Library devolveu 19 resultados reais (várias edições/traduções), cliquei em "Usar" no primeiro e os campos vieram preenchidos com dados reais — título, autor, capa (`covers.openlibrary.org`) e, num segundo fetch, a descrição em português vinda de `works/OL1003040W.json`. Confirma o que o agente de design já tinha verificado isoladamente (`docs/modelagem-dados.md`): a busca não traz descrição, só a rota `/works/{id}.json` traz, e o campo `description` varia entre `string` e `{type, value}` — `buscarDescricaoOpenLibrary` em `src/lib/open-library.ts` já trata os dois formatos.

## Login/cadastro: `signIn` aceita `FormData` direto, incluindo `redirectTo`

Antes de escrever `src/actions/auth.ts`, li a implementação real instalada (`node_modules/next-auth/lib/actions.js`), não só o `.d.ts` — o comentário JSDoc do pacote já mostra o padrão exato (`try { await signIn("credentials", formData) } catch (error) { if (error instanceof AuthError) ... }`). Confirmei que quando `options` é uma instância de `FormData`, o próprio `next-auth` faz `Object.fromEntries(options)` e extrai `redirectTo`/`redirect` dali — por isso o formulário de login tem um `<input type="hidden" name="redirectTo">` preenchido com o `callbackUrl` que o `proxy.ts` (Fase 2) already anexa na URL de redirecionamento, sem precisar de nenhuma lógica extra.

## Papel do usuário nunca vem do formulário público

`cadastrarUsuario` (`src/actions/usuarios.ts`) sempre grava `papel: "CLIENTE"`, hardcoded — o único jeito de existir um `ADMINISTRADOR` é `prisma/seed.ts` (`pnpm db:seed`, lê `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` do `.env`). Isso não estava no protótipo Java (lá, cadastro de admin também era um formulário público) — decisão consciente de reforçar aqui, já que agora existe uma superfície web real.

## CPF: validado de verdade (checksum), não só duplicidade

O briefing só pedia "validar CPF para evitar duplicidade" (requisito 13). Adicionei validação de dígito verificador em `src/lib/cpf.ts` (algoritmo padrão) via `.refine()` no schema Zod do cadastro — barato de fazer e evita lixo óbvio no banco. A duplicidade (e-mail OU CPF) é checada com uma query antes do `create`, com mensagem de erro específica pra cada caso; testado nos dois cenários (duplicidade real e formulário válido) direto no navegador.

## Exclusão de livro respeita a integridade referencial

`excluirLivro` captura `Prisma.PrismaClientKnownRequestError` com `code "P2003"` (violação de chave estrangeira) e redireciona de volta pra `/admin/livros` com uma mensagem amigável, em vez de deixar a página quebrar com um erro 500 — importante porque `ItemAluguel.livro` não tem `onDelete: Cascade` de propósito (ver `docs/modelagem-dados.md`: protege o histórico de aluguéis). Ainda não testável de ponta a ponta porque a Fase 4 (aluguel) ainda não existe — o `try/catch` está lá pronto pra quando existir.

## Todas as páginas são dinâmicas — CI continua sem precisar de `DATABASE_URL`

`next build` mostrou todas as rotas como `ƒ (Dynamic)`, nenhuma estática — como toda página já lê sessão (`auth()`) ou dados do Prisma em request-time, não há SSG tentando conectar no banco durante o build. A pendência que eu tinha deixado registrada em `docs/decisoes-fase-2.md` (CI precisar de secret de banco se alguma página virasse estática) não se aplica por enquanto; reavaliar se isso mudar numa fase futura.

## Catálogo populado com dados reais (não só o teste manual)

Depois de validar a UI manualmente, rodei um script Node avulso (não commitado) reaproveitando `lib/open-library.ts` + `lib/prisma.ts` pra popular o acervo com 3 clássicos reais (Dom Casmurro, O Cortiço, Memórias Póstumas de Brás Cubas) — mesmo mecanismo que o seed de livros da Fase 8 vai formalizar, só que adiantado aqui pra não deixar o catálogo vazio entre fases.
