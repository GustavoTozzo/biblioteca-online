# Decisões — Fase 6 (leitor simulado + perfil)

## Barra de progresso sem `style` inline, de propósito (CSP)

O leitor precisa mostrar quanto da "leitura" já foi visto. Em vez de uma barra de progresso com largura calculada via `style={{ width: `${percentual}%` }}`, usei uma fileira de segmentos (`<div>` por página, cada um só trocando entre as classes Tailwind `bg-verde`/`bg-grafite/20`). Motivo: o `style` prop do React, quando renderizado no **servidor** (SSR/RSC — sem DOM disponível pra usar CSSOM), vira um atributo HTML `style="..."` literal na marcação inicial, que cairia sob `style-src 'self'` sem `'unsafe-inline'` (nosso `next.config.ts` desde a Fase 2) — e pior, mesmo depois da hidratação o React pode não re-aplicar o valor via CSSOM se o atributo já "bate" com o que ele calculou, deixando a barra sem preenchimento até a primeira interação. Em vez de implementar e só depois descobrir isso num build de produção, desenhei a barra pra nunca precisar de `style` inline — zero risco, zero necessidade de testar essa lacuna específica de CSP.

## Leitor: acesso sempre revalidado, nunca confiado na URL

`/meus-livros/[livroId]/ler` reusa `buscarMeusLivros` (Fase 4) pra confirmar que o `livroId` da URL realmente está entre os livros que o usuário tem acesso (aluguel ativo ou assinatura) antes de mostrar qualquer conteúdo — mesmo padrão de "nunca confiar no ID da URL sozinho" já usado nas páginas de sucesso de checkout.

## Progresso salvo em background, sem UI de erro/pendência

`salvarProgresso` (`src/actions/leitura.ts`) é chamado a cada "página virada", via `startTransition` direto (sem `useActionState`, já que não tem nada visível de pendência/erro pra mostrar — é um "auto-save" silencioso). Testado: virei a página de "Dom Casmurro" até 100%, saí pra "Meus Livros", voltei ao leitor do mesmo livro, e ele abriu de volta na página 2 (a última vista) — "retomar de onde parou" funcionando de verdade, não só a lógica escrita.

## Perfil: e-mail e CPF não editáveis por design

Requisito 7 pede "visualizar e editar dados pessoais", mas nem o briefing nem o TPS detalham o que acontece se o e-mail (usado pro login) ou o CPF (identificador único validado no cadastro) mudarem — mudar qualquer um dos dois exigiria reverificação de identidade, fora de escopo pra um projeto de portfólio. Ficam visíveis (pra contexto) mas com o atributo `disabled`, e o Server Action nem aceita esses dois campos no schema Zod — não é só uma trava de UI.

## Bug de fuso horário na data de nascimento (achado e corrigido)

`dataNascimento` é armazenada como meia-noite UTC (`new Date("1995-05-20")`, que o JS sempre interpreta como UTC pra strings de data pura) — formatá-la com `toLocaleDateString("pt-BR")` sem fixar fuso mostrava um dia a menos pra qualquer usuário num fuso atrás de UTC (ex.: Brasil). Corrigido passando `{ timeZone: "UTC" }` no `perfil-form.tsx`. Achado testando no navegador (a data apareceu "19/05" em vez de "20/05"), não por inspeção de código — vale revisar se outro lugar do app um dia formatar uma data-pura (não-timestamp) sem essa opção.

## Bug de dados de teste descoberto (não é bug do produto)

Ao editar o telefone do usuário de teste (`cliente.teste@example.com`) e salvar, os campos `complemento`/`bairro`/`cidade`/`estado` apareceram deslocados um-a-um no banco (ex.: `bairro` recebeu o valor que devia estar em `cidade`). Investigado a fundo: **não é bug em `atualizarPerfil`, `cadastrarUsuario` nem nos formulários** — os atributos `name` de cada campo, tanto em `cadastro/page.tsx` quanto em `perfil-form.tsx`, estão corretos e na ordem certa, confirmado lendo o código-fonte linha a linha. A causa real foi um erro **na minha própria metodologia de teste da Fase 3**: preenchi o formulário de cadastro usando referências de accessibility tree (`ref_N`) assumindo uma correspondência 1:1 com os campos visuais, mas a árvore de acessibilidade pulou o campo opcional "Complemento" (vazio na hora), deslocando por um campo todo o preenchimento a partir dali — sem erro visível, porque cada valor "errado" ainda era uma string válida pro campo seguinte. Corrigido diretamente no banco pro usuário de teste (dados reais de Maringá/PR restaurados). Lição prática pra testes futuros com o Browser tool: **depois de preencher um formulário longo por `ref`, confirmar os valores lendo por `name` via `javascript_tool`** (`form.elements['nomeDoCampo'].value`) antes de submeter, em vez de confiar que a ordem dos `ref_N` bate com a ordem visual — principalmente em formulários com campos opcionais/vazios, que a árvore de acessibilidade pode omitir.
