import type { PlanoAssinatura } from "@prisma/client";

export type PlanoInfo = {
  id: PlanoAssinatura;
  slug: string;
  nome: string;
  preco: number;
  dias: number;
  descricao: string;
};

// Preços e prazos do protótipo Java (UsuarioController.exibeFormularioFluxoAssinatura).
export const PLANOS: PlanoInfo[] = [
  {
    id: "MENSAL",
    slug: "mensal",
    nome: "Mensal",
    preco: 19.9,
    dias: 30,
    descricao: "Acesso ilimitado ao acervo por 30 dias.",
  },
  {
    id: "SEMESTRAL",
    slug: "semestral",
    nome: "Semestral",
    preco: 99.9,
    dias: 180,
    descricao: "Acesso ilimitado ao acervo por 6 meses.",
  },
  {
    id: "ANUAL",
    slug: "anual",
    nome: "Anual",
    preco: 179.9,
    dias: 365,
    descricao: "Acesso ilimitado ao acervo por 12 meses.",
  },
];

export function buscarPlanoPorSlug(slug: string): PlanoInfo | undefined {
  return PLANOS.find((p) => p.slug === slug);
}

export function nomePlano(plano: PlanoAssinatura): string {
  return PLANOS.find((p) => p.id === plano)?.nome ?? plano;
}
