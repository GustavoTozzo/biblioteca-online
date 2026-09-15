"use client";

import Link from "next/link";

import { useCarrinho } from "./carrinho-provider";

export function CartBadge() {
  const { itens } = useCarrinho();

  return (
    <Link
      href="/carrinho"
      className="text-sm text-tinta/80 transition-colors hover:text-vinho"
    >
      Carrinho
      {itens.length > 0 && (
        <span className="ml-1.5 rounded-full bg-vinho px-1.5 py-0.5 text-xs font-medium text-papel">
          {itens.length}
        </span>
      )}
    </Link>
  );
}
