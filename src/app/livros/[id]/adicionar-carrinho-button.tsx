"use client";

import { useCarrinho } from "@/components/carrinho-provider";
import { botaoPrimario } from "@/lib/ui";

type LivroResumo = {
  id: string;
  titulo: string;
  autor: string;
  capaUrl: string | null;
};

export function AdicionarCarrinhoButton({ livro }: { livro: LivroResumo }) {
  const { itens, adicionar } = useCarrinho();
  const jaNoCarrinho = itens.some((i) => i.livroId === livro.id);

  return (
    <button
      type="button"
      onClick={() =>
        adicionar({
          livroId: livro.id,
          titulo: livro.titulo,
          autor: livro.autor,
          capaUrl: livro.capaUrl,
        })
      }
      disabled={jaNoCarrinho}
      className={botaoPrimario}
    >
      {jaNoCarrinho ? "Já está no carrinho" : "Adicionar ao carrinho"}
    </button>
  );
}
