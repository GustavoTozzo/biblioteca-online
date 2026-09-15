# Decisões — Fase 8 (polish)

O deploy no Vercel ainda não aconteceu (depende de você criar/confirmar a conta) — este documento cobre só a parte de polish que já dá pra fazer sem isso.

## Acessibilidade

- **Todas as capas de livro tinham `alt=""`** (tratando como decorativas) em 6 lugares — catálogo, detalhe, carrinho, checkout de sucesso, Meus Livros, busca do admin. Trocado por `alt={\`Capa de ${titulo}\`}` em todos — a capa é conteúdo, não decoração.
- **Contraste de cor verificado matematicamente**, não só "olhando": calculei a razão de contraste WCAG (luminância relativa + fórmula oficial) de cada combinação texto/fundo da paleta. Todas passam AA para texto normal (mínimo 4.5:1) — a pior é `selo` sobre `papel` (erros) com 5.97:1, a melhor é `tinta` sobre branco (inputs) com 17.15:1.
- **Nenhum `outline-none`/`focus:outline-none` em lugar nenhum do código** — confirmado via busca, não assumido. O anel de foco padrão do navegador continua ativo em todo lugar, então navegação por teclado funciona sem precisar de nenhum trabalho extra de estilização de foco.
- Cada rota agora tem um `<title>` próprio (`docs/decisoes-fase-8.md` mesmo arquivo cobre isso abaixo) — ajuda tanto SEO quanto quem navega com várias abas abertas ou leitor de tela (o título da aba é uma das primeiras coisas anunciadas).

## Títulos de página por rota

O layout raiz ganhou um `title.template: "%s — Biblioteca Online"`; cada página agora define seu próprio título curto (ex.: "Entrar", "Meus dados", "Planos de assinatura"), e as três páginas dinâmicas (`/livros/[id]`, `/meus-livros/[livroId]/ler`, `/planos/[plano]/checkout`) usam `generateMetadata` com o nome real do livro/plano. Três páginas que eram inteiramente Client Components (`cadastro`, `carrinho`, `carrinho/checkout`, mais `admin/livros/novo`) precisaram ser divididas em um wrapper Server Component (só com o `export const metadata`) + o conteúdo interativo movido pra um componente cliente separado — `metadata`/`generateMetadata` só podem ser exportados de Server Components, não existe outra forma suportada. Em `/livros/[id]` e `/admin/livros/[id]/editar`, usei `React.cache()` pra não duplicar a query do livro entre `generateMetadata` e a página.

## Bug real de responsividade encontrado e corrigido

Testando em viewport de 375px (mobile), a página de detalhe do livro (`/livros/[id]`) estourava a largura da tela — o layout usava `flex gap-8` sem nunca empilhar pra coluna única, cortando o título, o preço e o botão "Adicionar ao carrinho" fora da tela. Corrigido com `flex-col sm:flex-row`. O cabeçalho (`Header`) tinha o mesmo problema de fundo: com "Planos", "Carrinho", "Painel admin", "Meus livros", nome do usuário e "Sair" todos numa linha só, o botão "Cadastrar" ficava cortado em telas estreitas — corrigido com `flex-col sm:flex-row` no `<header>` e `flex-wrap` no `<nav>`, deixando os links quebrarem linha em vez de estourar a largura. As duas tabelas do admin (`/admin/livros`, `/admin/usuarios`, 4 e 6 colunas) ganharam um contêiner `overflow-x-auto` — não testado quebrando de verdade no mobile, mas é a prevenção padrão pra tabela larga.

## Catálogo expandido para ~20 livros reais

`prisma/seed.ts` passou a também popular o acervo (antes só criava o usuário administrador), buscando ~22 clássicos de domínio público na Open Library (mistura de literatura brasileira e mundial) — idempotente, pula título já existente, então rodar de novo não duplica nada. Três entradas vieram com título/autor no idioma/alfabeto original (russo, grego) porque o primeiro resultado de busca da Open Library pra "Crime and Punishment"/"The Odyssey"/"War and Peace" não é necessariamente a edição em inglês — corrigido manualmente pra título/autor em português, mantendo a capa e a descrição reais (que já vieram em inglês/da Wikipedia, então essas ficaram como estavam).

## O que foi deliberadamente deixado de fora

- **Lighthouse**: não instalado. `farmacia-do-povo` já tinha `@lhci/cli` configurado desde a Fase 2 daquele projeto (e mesmo lá, rodar localmente no Windows esbarra num bug conhecido do `chrome-launcher`, só verificável de verdade no GitHub Actions); aqui a Fase 2 não configurou isso, e adicionar a dependência só agora, sem CI pra rodar de verdade, teria custo maior que o benefício. Os pontos que o Lighthouse cobre (contraste, alt text, meta tags, foco) já foram checados manualmente acima.
- **Testes automatizados**: este projeto nunca teve Vitest/Jest configurado (diferente de `farmacia-do-povo`) — decisão que já vinha da Fase 2 e não foi revista agora. A cobertura real veio de testar cada fluxo manualmente no navegador a cada fase (login, cadastro, aluguel, assinatura, leitor, exportação CSV), sempre verificando o resultado direto no banco quando fazia sentido, não só a UI.
