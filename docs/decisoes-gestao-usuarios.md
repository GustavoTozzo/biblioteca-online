# Decisões — gestão de usuários (troca de senha, editar/excluir no admin)

Motivado por uma necessidade prática: não havia nenhuma forma de trocar a senha do único `ADMINISTRADOR` (criado pelo script de seed) sem acesso direto ao banco — e nenhuma forma de o admin corrigir ou remover uma conta de cliente pelo próprio site.

## 1. Trocar senha (autoatendimento, `/perfil`)

Novo card em "Meus dados" com senha atual + nova senha + confirmação (`trocarSenha` em `actions/perfil.ts`). Disponível pra qualquer usuário logado, inclusive o `ADMINISTRADOR` — é a única forma de trocar a senha seedada em produção sem editar o banco direto. Exige a senha atual (via `bcrypt.compare`) antes de aceitar a nova, mesmo raciocínio de qualquer fluxo de troca de senha padrão.

## 2. Editar e excluir usuários (`/admin/usuarios`)

Mesmo padrão já usado pra livros (`actions/livros.ts`): `exigirAdmin()` no topo de cada action, formulário com `useActionState`, exclusão via `<form action={excluirUsuario.bind(null, id)}>`.

- **Editar** (`/admin/usuarios/[id]/editar`): nome, e-mail e telefone ficam editáveis; CPF e data de nascimento continuam bloqueados (identificadores, mesma decisão de `perfil.ts`). O papel (`CLIENTE`/`ADMINISTRADOR`) também não é editável por aqui — segue a decisão original de que o único administrador é o do seed, evitar promover/rebaixar usuário pela UI não era parte do pedido. E-mail agora exige checagem de unicidade (excluindo o próprio registro) já que virou editável. Campo opcional de "nova senha" deixa o admin resetar a senha de qualquer usuário (ex: cliente esqueceu a senha) sem forçar troca a cada edição.
- **Excluir**: dois travamentos, nessa ordem — (1) admin não pode excluir a própria conta (evita se autobanir/perder sessão coerente no meio da ação), (2) a própria integridade referencial do Postgres bloqueia exclusão de usuário com aluguel/assinatura/transação associada (erro `P2003`, capturado e traduzido pra mensagem amigável — mesmo padrão de `excluirLivro`).

## 3. Validação de telefone

Antes era só `min(8)` (comprimento mínimo qualquer). Criado `src/lib/telefone.ts` no mesmo espírito de `lib/cpf.ts`: limpa não-dígitos e exige 10 (fixo, DDD+8) ou 11 (celular, DDD+9) dígitos. Aplicado em `cadastro`, `perfil` e agora também na edição de usuário pelo admin — validação consistente nos três lugares que coletam telefone.

## Verificação

Testado manualmente com o servidor local (que usa o mesmo Neon de produção — não há banco separado de dev): login como admin, troca de senha (senha atual errada → erro; senha certa → sucesso, confirmado com logout/login usando a senha nova), edição de um cliente de teste (nome alterado e persistido), tentativa de autoexclusão (bloqueada), tentativa de excluir um cliente com aluguel/assinatura existente (bloqueada com mensagem amigável). `pnpm typecheck`, `pnpm lint` e `pnpm build` limpos.
