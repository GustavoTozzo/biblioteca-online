"use client";

import Image from "next/image";
import Link from "next/link";

import { useCarrinho } from "@/components/carrinho-provider";
import { botaoPrimario, linkDiscreto, linkPerigo } from "@/lib/ui";

export function CarrinhoContent() {
  const { itens, remover } = useCarrinho();

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-heading text-3xl text-vinho">Seu carrinho</h1>

        {itens.length === 0 ? (
          <p className="text-grafite">
            Seu carrinho está vazio.{" "}
            <Link href="/" className={linkDiscreto}>
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
                  className="flex items-center gap-4 rounded-2xl border border-grafite/10 bg-white/50 p-3 shadow-sm"
                >
                  <div className="aspect-2/3 w-16 shrink-0 overflow-hidden rounded-lg bg-grafite/8 shadow-sm ring-1 ring-black/5">
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
                    className={linkPerigo}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/carrinho/checkout" className={botaoPrimario}>
              Continuar para o checkout
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
