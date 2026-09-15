# Decisões — Fase 7 (painel admin completo)

## CSV corrige um bug real do protótipo Java: aspas internas não escapadas

O `ExportadorCsvService` original fazia `String.format("%d;\"%s\";...")` sem escapar aspas dentro dos campos — uma descrição de livro contendo `"` quebraria o CSV gerado. `src/lib/csv.ts` escapa (`"` → `""`, a forma padrão de CSV) antes de citar cada campo. Confirmado em uso real, não só em teoria: a descrição de "Memórias Póstumas de Brás Cubas" (vinda da Open Library) contém a citação `"forma livre"`, e o CSV exportado trouxe corretamente `""forma livre""` em vez de corromper o arquivo.

## Usuários exportados nunca incluem e-mail nem senha

Mesmo escopo de colunas do CSV original (`ID;Nome Completo;CPF;Telefone;Tipo Usuário`) — decisão já registrada em `docs/modelagem-dados.md` desde o desenho inicial, só confirmada em código agora. `senhaHash` nunca é uma coluna, nem `email`.

## Sem a pergunta de sistema operacional do protótipo

O console original perguntava Windows/macOS pra decidir o separador de caminho da pasta Downloads — não faz sentido numa rota web: o `Content-Disposition: attachment` do Route Handler já entrega o arquivo pro navegador escolher onde salvar, em qualquer sistema operacional.

## Guard testado de verdade nas duas camadas, não só lido no código

`/api/admin/exportar/livros` e `/api/admin/exportar/usuarios` repetem a checagem de papel (defesa em profundidade, mesmo padrão dos endpoints de busca da Open Library desde a Fase 3). Testado com sessão real: como administrador, os dois endpoints devolvem o CSV certo (confirmado byte a byte o BOM UTF-8 `EF BB BF`); depois de um `sair` de verdade (não só limpar `document.cookie` do lado do cliente — o cookie de sessão do NextAuth é `httpOnly` e simplesmente ignora tentativas de limpeza via JavaScript, como esperado), o mesmo endpoint devolve `403`. `/admin/usuarios` e `/admin/exportar` também redirecionam pra `/login` quando deslogado, via `proxy.ts`.

## Dashboard ganhou atalhos, sem novo conteúdo

Os dois cartões de contagem em `/admin` (livros/usuários) viraram links pras respectivas páginas — mudança pequena, não uma feature nova, só evita um clique a mais no menu lateral que já existia.
