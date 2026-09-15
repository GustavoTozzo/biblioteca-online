# Decisões — Fase 5 (assinatura)

## Assinatura só aceita Pix ou cartão — sem boleto

Diferente do aluguel unitário (Pix/Boleto/Cartão), o briefing (`docs/brief-original.md`, resposta 6 do questionário) só menciona Pix ou cartão pra assinatura. `criarAssinatura` valida isso no Zod (`z.enum(["PIX", "CARTAO"])`), separado do schema do aluguel que aceita as 3 formas.

## Contratar um novo plano cancela a assinatura ativa anterior

O schema já tinha `status: StatusAssinatura` desde a Fase 2, mas nada nele impedia duas assinaturas `ATIVA` simultâneas pro mesmo usuário — o briefing não cobre esse caso (só fala em "Criar assinatura, Cancelar assinatura, Renovar assinatura" como serviços, sem detalhar o fluxo de troca de plano). Decisão: `criarAssinatura` sempre faz `updateMany` marcando qualquer assinatura `ATIVA` existente como `CANCELADA` antes de criar a nova, dentro da mesma transação — testado direto no banco (assinei Mensal, depois Anual, e confirmei que a Mensal ficou `CANCELADA` e só a Anual está `ATIVA`). Evita ambiguidade em "Meus Livros" (que já usava `findFirst` pra assinatura ativa — nunca teria pego duas mesmo antes, mas agora a garantia é estrutural, não um acaso da query).

## "Meus Livros" e a página de Planos não precisaram de nenhuma mudança na lógica de composição

`lib/meus-livros.ts` já tinha a união aluguel-ativo ∪ assinatura-ativa desde a Fase 2/4 (escrita antecipadamente). Só adicionei um helper novo, `buscarAssinaturaAtiva`, pra reaproveitar a mesma query tanto no banner de "Meus Livros" quanto na página `/planos` (mostrar "você já tem uma assinatura ativa" antes de deixar assinar de novo) — sem duplicar a query original de dentro de `buscarMeusLivros`. Testado: depois de assinar, os 3 livros do acervo (os 2 alugados antes + 1 nunca alugado) passaram a aparecer todos como `"Via assinatura"` em Meus Livros — confirma que o dedup por `livro.id` prioriza assinatura sobre aluguel individual, como desenhado.

## Data de fim calculada com dias fixos, não "meses corridos"

Semestral = 180 dias, Anual = 365 dias (não "6 meses corridos" via `setMonth`) — mais simples e determinístico, e o briefing não especifica meses corridos vs. dias fixos. Testado: assinatura Anual criada em 14/09/2026 venceu em 14/09/2027 (365 dias corretamente), Mensal em 14/09 venceu 14/10 (30 dias).

## Rotas de checkout de assinatura já estavam protegidas desde a Fase 2

`src/proxy.ts` já tinha `/planos/mensal/checkout`, `/planos/semestral/checkout` e `/planos/anual/checkout` hardcoded na lista de rotas autenticadas (escrito antecipadamente ali também) — nenhuma mudança necessária, e o prefixo `startsWith` já cobre as páginas de sucesso (`/planos/mensal/checkout/sucesso/[id]`) de graça. `/planos` (a listagem, sem `/checkout`) continua pública, igual ao catálogo de livros.
