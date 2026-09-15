"use client";

import { useCarrinho } from "@/components/carrinho-provider";

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
      className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60"
    >
      {jaNoCarrinho ? "Já está no carrinho" : "Adicionar ao carrinho"}
    </button>
  );
}
