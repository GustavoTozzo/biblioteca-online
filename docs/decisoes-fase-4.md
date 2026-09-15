# Decisões — Fase 4 (aluguel unitário)

## Carrinho: `useSyncExternalStore`, não `useEffect`+`setState`

Primeira versão do `CarrinhoProvider` lia o `localStorage` num `useEffect` e chamava `setItens` no corpo do efeito — o `eslint-plugin-react-hooks` (regra `set-state-in-effect`) barrou isso como erro, não só aviso. É a mesma regra que já tinha forçado o toggle de tema hand-rolled em `portfolio-gustavo` a evitar `useEffect`. Reescrito com `useSyncExternalStore` (store módulo-level + `subscribe`/`getSnapshot`/`getServerSnapshot`): é literalmente o hook feito pra sincronizar com um sistema externo como o `localStorage`, resolve o erro do lint e também evita mismatch de hidratação de graça (`getServerSnapshot` sempre retorna array vazio, igual ao que o servidor renderiza).

## Server Action chamada fora de `<form>`, com `useActionState` + `startTransition`

O checkout precisa mandar pro servidor uma lista de IDs de livros que só existe no `CarrinhoProvider` (Context), não em campos de formulário — não dava pra usar `<form action={...}>` (que só entrega `FormData`). Confirmei nos docs do Next 16 empacotados (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`) o padrão oficial pra esse caso: `useActionState(acao, estadoInicial)` continua sendo a forma recomendada de ganhar estado de erro/pendência, mas o `action` retornado pode ser chamado manualmente com **qualquer valor** (não só `FormData`) via `onClick={() => startTransition(() => action(payload))}`. `src/app/carrinho/checkout/page.tsx` usa exatamely isso pra mandar `{ livroIds, dias, formaPagamento, cartaoFinal4 }` como objeto.

## Servidor nunca confia no carrinho do cliente além dos IDs

Confirmado no mesmo doc (seção de segurança dos Server Functions): "the client legitimately tells the server which item to act on... re-read the rest from a trusted source using the session." `criarAluguel` (`src/actions/aluguel.ts`) recebe só `livroId[]` do cliente — o preço (`2,50 × nº de livros × dias`), a existência dos livros e o usuário dono do aluguel são sempre relidos no servidor a partir do banco e da sessão (`auth()`), nunca aceitos do payload.

## Limpeza do carrinho acontece na página de sucesso, não na de checkout

`criarAluguel` termina com `redirect()` no sucesso — isso desmonta o componente de checkout antes de qualquer callback rodar no cliente, então `limpar()` não pode viver lá. Resolvido com um client component sem UI (`LimparCarrinhoAoMontar`) na página de sucesso, que só chama `limpar()` num `useEffect` ao montar — funciona não importa por qual forma de pagamento o usuário passou.

## Pagamento simulado, cartão nunca sai do formulário além dos 4 últimos dígitos

Testado direto no banco (não só lido no código): depois de um checkout com cartão fake `4111 1111 1111 1234`, a linha em `Transacao` tem `cartaoFinal4: "1234"` e nenhum outro campo com número de cartão ou CVV — `cartaoFinal4` é calculado no client (`numeroCartao.replace(/\D/g, "").slice(-4)`) e é só isso que chega no Server Action. Pix gera uma chave fake e um QR code (pacote `qrcode`, `toDataURL` rodando no servidor, imagem `data:` renderizada com `<img>` normal — `next/image` não otimiza `data:` URLs, por isso não foi usado ali). Boleto gera uma linha digitável fake. Todo pagamento confirma na hora, igual ao protótipo Java.

## "Meus Livros" já preparado pra assinatura, mesmo sem ela existir ainda

`lib/meus-livros.ts` (Fase 2/3) já teve a união aluguel-ativo ∪ assinatura-ativa escrita desde o desenho original — testei agora só a metade de aluguel (óbvio, já que Assinatura não tem UI ainda), mas a função não precisa ser tocada de novo na Fase 5, só passa a ter linhas reais na tabela `Assinatura` pra combinar.

## Testado de ponta a ponta, incluindo os dois formatos de pagamento

Fluxo completo no navegador: adicionar livro ao carrinho (badge do header atualiza), ver carrinho, ir pro checkout, prazo padrão de 7 dias calculando R$ 17,50 corretamente (1 livro × 7 dias × R$2,50), confirmar com Pix (QR code real gerado, código fake exibido, redireciona pra página de sucesso, carrinho esvazia), depois repetir com Cartão (código de autorização fake, `cartaoFinal4` confirmado no banco). "Meus Livros" mostrando os dois aluguéis com a data de vencimento correta (hoje + 7 dias).
