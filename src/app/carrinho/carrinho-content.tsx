"use client";

import Image from "next/image";
import Link from "next/link";

import { useCarrinho } from "@/components/carrinho-provider";

export function CarrinhoContent() {
  const { itens, remover } = useCarrinho();

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-heading text-3xl text-vinho">Seu carrinho</h1>

        {itens.length === 0 ? (
          <p className="text-grafite">
            Seu carrinho está vazio.{" "}
            <Link href="/" className="text-vinho underline">
              Volte ao catálogo
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="mb-6 flex flex-col gap-4">
              {itens.map((item) => (
                <li
                  key={item.livroId}
                  className="flex items-center gap-4 border-b border-grafite/10 pb-4"
                >
                  <div className="aspect-2/3 w-16 shrink-0 overflow-hidden rounded bg-grafite/10">
                    {item.capaUrl && (
                      <Image
                        src={item.capaUrl}
                        alt={`Capa de ${item.titulo}`}
                        width={64}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading text-tinta">{item.titulo}</p>
                    <p className="text-sm text-grafite">{item.autor}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remover(item.livroId)}
                    className="text-sm text-selo underline"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/carrinho/checkout"
              className="inline-block rounded bg-vinho px-4 py-2 text-papel"
            >
              Continuar para o checkout
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
