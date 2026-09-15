# Plano de design — Biblioteca Online

## Tom e princípios

Biblioteca digital editorial: evoca papel, tipografia de livro e a calma de uma sala de leitura, sem parecer datada nem usar animações de "virar página" que seriam só efeito, sem função. Três princípios:

1. **Tipografia é o protagonista visual** — a paleta é discreta de propósito; quem carrega a identidade é o par de fontes serifadas (abaixo), coerente com "biblioteca".
2. **Sem padrões de manipulação de assinatura** — nada de contagem regressiva falsa, "só restam X vagas", ou pré-seleção do plano mais caro. Os 3 planos aparecem com peso visual igual; o preço fica sempre visível antes de qualquer clique.
3. **Simulação sempre visível como simulação** — todo lugar que toca pagamento ou leitura de livro carrega um aviso curto e honesto (não escondido em rodapé) de que é uma demonstração de portfólio.

Deliberadamente evitado: leitor de e-book "de verdade" (ver `docs/modelagem-dados.md` — decisão de não depender do Internet Archive), skeuomorfismo de capa de livro 3D, dark patterns de assinatura, qualquer coleta real de dados de cartão.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| Vinho Encadernado | `#6B2737` | Cor primária — cabeçalhos de destaque, botões principais, links |
| Tinta Nanquim | `#211A17` | Texto principal, quase-preto quente (não preto puro) |
| Papel Vintage | `#F6EFE4` | Fundo base, tom de papel envelhecido sem ficar amarelado demais |
| Dourado Folha | `#B08D57` | Acentos, selos, ícone de destaque (evoca letras douradas em lombada) |
| Verde Bibliotheca | `#3F5A4D` | Cor secundária — estados de sucesso, badges de "disponível", categoria |
| Cinza Grafite | `#5B5551` | Texto secundário, bordas, placeholders |
| Vermelho Selo | `#9C3B2E` | Erros, avisos de simulação de pagamento (mesma família tonal do vinho, sem introduzir um vermelho genérico de UI) |

Modo escuro (Fase 8, se houver tempo): inverter para fundo `#1B1613` (Tinta Nanquim escurecido) com Papel Vintage como texto — mesma lógica de token usada em `portfolio-gustavo`, não replanejada aqui até a fase de implementação de UI.

## Tipografia

- **Títulos**: [Newsreader](https://fonts.google.com/specimen/Newsreader) — serifada editorial, com itálico expressivo, usada em capitulares e headers grandes. Evita colidir com a Fraunces já usada em `farmacia-do-povo`.
- **Corpo de texto**: [Literata](https://fonts.google.com/specimen/Literata) — serifada desenhada pelo time do Google Play Books especificamente para leitura em tela; escolha temática direta para uma "biblioteca digital" e para a tela do leitor interno simulado.
- **UI/formulários** (botões, labels, inputs): a própria Literata em peso regular/medium é suficiente — não introduzir uma terceira família só para chrome de interface.

Ambas via `next/font/google`, self-hosted pelo build do Next (sem chamada externa em runtime, mesma prática dos projetos-irmãos).

## Wireframes (ASCII, baixa fidelidade)

### Home / catálogo público
```
┌─────────────────────────────────────────────┐
│ Biblioteca Online          [Entrar] [Cadastrar] │
├─────────────────────────────────────────────┤
│ Buscar livro...        [Categoria ▾]          │
├─────────────────────────────────────────────┤
│ [capa]  [capa]  [capa]  [capa]                │
│ título  título  título  título                │
│ autor   autor   autor   autor                 │
├─────────────────────────────────────────────┤
│ [capa]  [capa]  [capa]  [capa]                │
└─────────────────────────────────────────────┘
```

### Detalhe do livro
```
┌───────────┬─────────────────────────────────┐
│           │ Título do livro                  │
│  [capa]   │ Autor · Categoria                 │
│           │ Descrição/sinopse...              │
│           │                                    │
│           │ [Adicionar ao carrinho]           │
└───────────┴─────────────────────────────────┘
```

### Checkout de aluguel
```
┌─────────────────────────────────────────────┐
│ Seu carrinho: 2 livros                        │
│ Prazo de leitura: [7 dias ▾]                  │
│ Valor total: R$ 35,00 (2,50 × 2 × 7)          │
│                                                │
│ Forma de pagamento: ( ) Pix ( ) Boleto ( ) Cartão │
│ ⚠ Pagamento simulado — projeto de portfólio    │
│ [Confirmar pagamento]                         │
└─────────────────────────────────────────────┘
```

### Meus Livros
```
┌─────────────────────────────────────────────┐
│ Meus Livros                                   │
│ [Assinatura ativa até 12/03 — acesso total]   │
├─────────────────────────────────────────────┤
│ [capa] Título · disponível até 20/09  [Ler]   │
│ [capa] Título · via assinatura        [Ler]   │
└─────────────────────────────────────────────┘
```

### Leitor interno simulado
```
┌─────────────────────────────────────────────┐
│ ⚠ Simulação de leitor — exibindo a sinopse,   │
│   não o conteúdo integral da obra             │
├─────────────────────────────────────────────┤
│ Título do livro                               │
│                                                │
│ (texto da sinopse, em blocos paginados)       │
│                                                │
│ ▓▓▓▓▓▓▓▓░░░░░░░░  40%                         │
│ [← Anterior]              [Próximo →]         │
└─────────────────────────────────────────────┘
```

### Painel admin — cadastro de livro
```
┌─────────────────────────────────────────────┐
│ Novo livro                                    │
│ Buscar na Open Library: [____________] [Buscar]│
│ ┌───────────────────────────────────────┐    │
│ │ [capa] Título — Autor (ano)   [Usar]   │    │
│ │ [capa] Título — Autor (ano)   [Usar]   │    │
│ └───────────────────────────────────────┘    │
│ Título:     [______________________]         │
│ Autor:      [______________________]         │
│ Descrição:  [______________________]         │
│ Categoria:  [______________________]         │
│ [Salvar no acervo]                            │
└─────────────────────────────────────────────┘
```

## Layout base

App Router com um `layout.tsx` raiz (fundo Papel Vintage, fontes carregadas), header fixo simples (logo + busca + auth), sem sidebar no site público. `/admin` ganha um layout próprio com navegação lateral curta (Dashboard, Livros, Usuários, Exportar) — separado do layout público para reforçar visualmente que é uma área distinta, e para hospedar o guard de papel do Server Component (ver plano de implementação, seção de autenticação).
