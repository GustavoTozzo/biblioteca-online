"use client";

import Link from "next/link";

import { useCarrinho } from "./carrinho-provider";

export function CartBadge() {
  const { itens } = useCarrinho();

  return (
    <Link href="/carrinho" className="hover:text-vinho">
      Carrinho{itens.length > 0 ? ` (${itens.length})` : ""}
    </Link>
  );
}
