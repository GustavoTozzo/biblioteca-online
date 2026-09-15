"use client";

import { useEffect } from "react";

import { useCarrinho } from "@/components/carrinho-provider";

// A limpeza do carrinho acontece aqui (não no server action) porque
// criarAluguel termina com redirect() — o componente da página de checkout
// desmonta antes de qualquer callback de sucesso rodar no cliente.
export function LimparCarrinhoAoMontar() {
  const { limpar } = useCarrinho();

  useEffect(() => {
    limpar();
  }, [limpar]);

  return null;
}
