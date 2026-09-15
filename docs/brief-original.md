# Briefing original — Sua Biblioteca Online

## Time e cenário

Projeto de bloco da Infnet — "Desenvolvimento Back-End": Julia Batista Canalle, Gustavo Tozzo Campos, Sara Vanick da Costa.

> O cliente deseja desenvolver uma plataforma online para aluguel de livros digitais. Os usuários podem realizar o cadastro com dados pessoais e acessar o acervo de livros mediante duas modalidades: aluguel unitário ou assinatura (mensal, semestral ou anual). No aluguel unitário, o usuário escolhe os livros desejados e o prazo de leitura. Já na assinatura, o usuário tem acesso ilimitado durante o período contratado. O sistema conta com um perfil administrativo que gerencia o acervo (adição, edição e exclusão de livros), além de exportação de listas de usuários e livros. As formas de pagamento aceitas são Pix, boleto bancário e cartão de crédito.

## Requisitos funcionais (1–13)

1. Cliente realiza cadastro com dados pessoais
2. Cliente autentica-se no sistema
3. Cliente visualiza o acervo de livros
4. Cliente aluga livros digitalmente de forma unitária
5. Cliente contrata um plano de assinatura (mensal, semestral ou anual)
6. Cliente acessa seus livros alugados ou por assinatura
7. Cliente visualiza e edita seus dados pessoais
8. Administrador cadastra livros no acervo
9. Administrador edita livros do acervo
10. Administrador remove livros do acervo
11. Administrador exporta listas de livros e usuários para CSV
12. Sistema processa pagamentos via Pix, boleto ou cartão
13. Sistema valida CPF para evitar duplicidade

## Respostas do cliente ao questionário do analista (TPS)

**Cadastro** — campos obrigatórios: nome completo, e-mail, senha, CPF, data de nascimento, telefone, endereço completo, dados de pagamento (número do cartão, validade, CVV — não coletados de verdade nesta reconstrução, ver `modelagem-dados.md`).

**Aluguel unitário** — estante virtual → seleciona livro → escolhe prazo de leitura em dias → escolhe forma de pagamento (Pix/Boleto/Cartão) → paga → livro liberado para leitura imediata. Múltiplos usuários podem alugar o mesmo título simultaneamente (é digital, sem exclusividade/fila).

**Assinatura** — área de planos → escolhe Mensal/Semestral/Anual → informa pagamento (Pix ou cartão) → confirma → acesso ilimitado ao acervo durante o período. No cartão, é configurado como cobrança recorrente (nesta reconstrução, apenas informativo — sem cron real).

**"Meus Livros"** — lista os livros disponíveis por aluguel ou assinatura; ficam disponíveis até o vencimento do aluguel/assinatura.

**Leitura** — dentro de "Meus Livros", abre um leitor interno (sem opção de download), com retomada de onde parou.

**Cadastro de livro (admin)** — painel de administração → "Adicionar livro" → título, autor, descrição, categoria (todos os 4 obrigatórios) → salva no acervo.

## Dicionário de dados (classes/entidades)

| Entidade | Atributos | Serviços |
|---|---|---|
| Usuário | nomeCompleto, cpf, email, telefone, endereço, tipoUsuario, formaPagamento, dadosPagamento | Autenticar, Cadastrar, Atualizar dados, Exportar dados |
| Livro | titulo, autor, descricao, categoria | Cadastrar, Editar, Remover, Listar |
| Aluguel | usuario, livro(s), prazoLeitura (dias), dataInicio | Iniciar aluguel, Confirmar pagamento, Liberar leitura |
| Assinatura | usuario, plano (Mensal/Semestral/Anual), dataInicio, dataFim | Criar, Cancelar, Renovar |
| DadosPagamento | formaPagamento (Pix/Boleto/Cartão), detalhesCartao | Validar pagamento, Armazenar informações |

Enums: `TipoUsuario` (CLIENTE, ADMINISTRADOR), `FormaPagamento` (PIX, BOLETO, CARTAO), `PlanoAssinatura` (MENSAL, SEMESTRAL, ANUAL), `PrazoLocacao` (prazos em dias).

## Regra de precificação (do protótipo Java, `AluguelService`)

Valor do aluguel = **R$ 2,50 × número de livros × dias**. Planos de assinatura: Mensal R$ 19,90, Semestral R$ 99,90, Anual R$ 179,90.

## O que existia no protótipo Java e o que faltava

Implementado e funcional: `Usuario`, `Administrador`, `Livro` como entidades JPA persistidas, CRUD de livro, validação de CPF duplicado, exportação CSV de livros/usuários, cálculo do valor de aluguel, fluxo de pagamento simulado (fake, sem gateway) — tudo via console (`Scanner`/`CommandLineRunner`), sem API REST.

Faltando/incompleto: `Assinatura` era uma classe vazia; `Aluguel` não era entidade JPA (não persistia, sem getters); não existiam `AluguelRepository`/`AssinaturaRepository`/`AluguelController`/`AssinaturaController` apesar de estarem descritos no dicionário de pacotes do PDF; não havia autenticação real (login era só digitar o CPF); `Carrinho` era um `@Component` singleton do Spring (inofensivo em app de console single-user, mas seria um bug de escopo grave numa API real multiusuário).

Essas lacunas foram resolvidas na reconstrução em Next.js (ver `modelagem-dados.md`), não no código Java original — que permanece intocado em `biblioteca-infnet-main/` como o artefato acadêmico entregue.
