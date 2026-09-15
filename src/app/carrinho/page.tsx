import type { Metadata } from "next";

import { CarrinhoContent } from "./carrinho-content";

export const metadata: Metadata = { title: "Carrinho" };

export default function CarrinhoPage() {
  return <CarrinhoContent />;
}
