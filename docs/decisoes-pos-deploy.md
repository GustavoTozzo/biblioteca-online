# Decisões — ajustes pós-deploy (feedback do Gustavo no site ao vivo)

Depois do primeiro deploy (`biblioteca-online-snowy.vercel.app`), Gustavo testou o site publicado e trouxe 3 problemas reais. Documentando aqui porque nenhum deles apareceu nos testes locais anteriores — só ficaram visíveis com o site publicado de verdade.

## 1. Carrinho/login redirecionando pro `localhost` em produção

**Causa raiz encontrada no código do próprio `next-auth`** (`node_modules/next-auth/lib/env.js`): quando a variável de ambiente `AUTH_URL` existe, o Auth.js **sempre** usa esse valor fixo pra montar qualquer URL de redirecionamento — login, callback, proxy — e nunca tenta detectar o domínio real da requisição. Isso incluía tanto `.env` local (correto, aponta pro `localhost:3030`) quanto a mesma variável copiada pras env vars da Vercel na hora do deploy (o que eu tinha orientado antes) — só que lá o valor errado quebrava tudo.

A correção certa **não é** trocar `AUTH_URL` pelo domínio novo da Vercel: isso resolveria só até o próximo deploy de preview (cada PR/branch na Vercel ganha uma URL diferente) ou até trocar de domínio custom no futuro. Confirmei em `node_modules/.pnpm/@auth+core@.../lib/utils/env.js` que o Auth.js já ativa `trustHost` automaticamente quando a variável `VERCEL` existe no ambiente (a própria Vercel define isso em todo deploy) — ou seja, **sem `AUTH_URL` nenhuma**, o Auth.js detecta o host certo sozinho via cabeçalho `x-forwarded-host`, em produção, preview ou local, sem precisar reconfigurar nada a cada deploy.

**Ação necessária na Vercel** (não é algo que dá pra corrigir só no código): remover a variável `AUTH_URL` das Environment Variables do projeto na Vercel (não trocar o valor — remover mesmo) e fazer um novo deploy. `.env.example` e o `.env` local foram atualizados com um aviso explícito sobre isso pra não repetir o erro num deploy futuro.

## 2. Catálogo com títulos/sinopses em 3 idiomas diferentes

O script de seed (Fase 8) buscava os livros na Open Library e usava o primeiro resultado como veio — o que trouxe título e sinopse no idioma original de cada edição (inglês na maioria, mas espanhol pro Dom Quixote, e as sinopses de "Crime and Punishment"/"Guerra e Paz" tinham parágrafos inteiros em russo por causa da edição escolhida pela busca). Também tinham artefatos de markdown/links de wikipedia coladas cruas na descrição.

Reescrevi manualmente título, autor, categoria e sinopse dos 22 livros — tudo em português, sinopses originais (não traduzidas automaticamente, escritas do zero com o mesmo tamanho/tom pra cada uma, ~2-3 frases), sem links ou marcação solta. Categorias também foram consolidadas num conjunto pequeno e consistente (`Romance brasileiro`, `Clássico britânico`, `Clássico russo`, `Clássico americano`, `Épico clássico`, `Clássico espanhol`) em vez de uma etiqueta diferente por livro vinda direto da Open Library. As capas continuam vindo da Open Library (arte real da edição), só o texto ao redor é nosso.

## 3. Capas "esticadas"/borradas + design "antigo"

Duas causas distintas:

- **Capas**: a Fase 8 original usava o tamanho `-M` da Open Library (~180px de largura), exibido em caixas de até 300-400px — o navegador ampliava a imagem pequena, o que borra/"estica" visualmente mesmo com `object-cover` aplicado corretamente (o corte de proporção sempre funcionou; a resolução da fonte que era baixa). Troquei pro tamanho `-L` (~500px) em `src/lib/open-library.ts` — vale tanto pros 22 livros já existentes (atualizados no banco) quanto pra qualquer livro que o admin adicionar dali pra frente.

- **Design**: criei `src/lib/ui.ts` com classes compartilhadas de botão/campo/card (sombra, cantos mais arredondados, transições de hover, anel de foco colorido) e apliquei em todo o app — header com efeito de vidro fixo no topo, hero de verdade na home, cards de livro com elevação ao passar o mouse, badge de categoria na página do livro, plano "mais popular" destacado em `/planos`. Antes, cada página tinha seu próprio `className` improvisado (por isso a "cara de remendo" que o Gustavo notou); agora um ajuste no `lib/ui.ts` propaga pro app inteiro.

## Bug de CSP encontrado só num build de produção real (não no `next dev`)

Ao verificar o resultado num `next build && next start` de verdade (não só no dev, que mascarava isso com o overlay de devtools do Next), apareceram **24 violações reais** de `style-src` — uma por capa de livro. Causa: o próprio `next/image` injeta `style="color:transparent"` em todo `<img>` (truque interno do framework pra esconder o flash do texto alt antes da imagem carregar) — isso é comportamento do framework, não do nosso código, e não existe opção suportada pra desligar. Como o CSP já abre `'unsafe-inline'` pra `script-src` pelo mesmo motivo estrutural (documentado desde `docs/decisoes-fase-2.md`), apliquei a mesma decisão em `style-src`. Provavelmente esse problema já existia desde que a Fase 3 adicionou as primeiras capas reais — só não tinha sido pego porque nenhuma verificação de produção depois da Fase 2 recarregou o catálogo com livros de verdade.
