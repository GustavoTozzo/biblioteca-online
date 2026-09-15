// Vitrine de domínio público: 4-5 obras reais com download direto e sem
// restrição, verificadas uma a uma no Internet Archive antes de entrar aqui
// (ver docs/decisoes-acervo-gratuito.md) — nunca listar um item só porque a
// Open Library aponta um "ia" pra ele, porque a maioria dos itens do
// Internet Archive é empréstimo controlado (exige conta, tem fila, PDF
// criptografado), não download livre. Cada entrada abaixo foi conferida via
// `https://archive.org/metadata/{id}` (sem access-restricted-item) e o link
// de download testado (HEAD 200) antes de ser adicionada.
//
// Lista estática de propósito — são só alguns exemplos pra mostrar a
// abordagem, não um catálogo administrável; não vale a pena um model no
// banco + CRUD no admin pra 5 itens curados manualmente.
export type LivroGratuito = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  capaUrl: string;
  pdfUrl: string;
  tamanhoMb: number;
};

export const LIVROS_GRATUITOS: LivroGratuito[] = [
  {
    id: "alicesadventures00carruoft",
    titulo: "Alice no País das Maravilhas",
    autor: "Lewis Carroll",
    descricao:
      "Edição digitalizada pela Universidade de Toronto, com as ilustrações originais de John Tenniel.",
    capaUrl: "https://archive.org/services/img/alicesadventures00carruoft",
    pdfUrl:
      "https://archive.org/download/alicesadventures00carruoft/alicesadventures00carruoft.pdf",
    tamanhoMb: 8.4,
  },
  {
    id: "prideprejudice00austuoft",
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    descricao:
      "Edição digitalizada pela Universidade de Toronto — texto completo em inglês.",
    capaUrl: "https://archive.org/services/img/prideprejudice00austuoft",
    pdfUrl:
      "https://archive.org/download/prideprejudice00austuoft/prideprejudice00austuoft.pdf",
    tamanhoMb: 30.8,
  },
  {
    id: "christmascarolin00dick_2",
    titulo: "Um Conto de Natal",
    autor: "Charles Dickens",
    descricao: "Edição digitalizada com as ilustrações originais da publicação.",
    capaUrl: "https://archive.org/services/img/christmascarolin00dick_2",
    pdfUrl:
      "https://archive.org/download/christmascarolin00dick_2/christmascarolin00dick_2.pdf",
    tamanhoMb: 5.6,
  },
  {
    id: "cu31924105428902",
    titulo: "Frankenstein",
    autor: "Mary Shelley",
    descricao: "Edição digitalizada pela Universidade Cornell — texto completo em inglês.",
    capaUrl: "https://archive.org/services/img/cu31924105428902",
    pdfUrl: "https://archive.org/download/cu31924105428902/cu31924105428902.pdf",
    tamanhoMb: 23,
  },
  {
    id: "oguarany00alenuoft",
    titulo: "O Guarani",
    autor: "José de Alencar",
    descricao:
      "Edição digitalizada pela Universidade de Toronto — texto completo em português.",
    capaUrl: "https://archive.org/services/img/oguarany00alenuoft",
    pdfUrl: "https://archive.org/download/oguarany00alenuoft/oguarany00alenuoft.pdf",
    tamanhoMb: 17.3,
  },
];
