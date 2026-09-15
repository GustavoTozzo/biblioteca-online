"use client";

import Link from "next/link";
import { startTransition, useState } from "react";

import { salvarProgresso } from "@/actions/leitura";

type LeitorSimuladoProps = {
  livroId: string;
  titulo: string;
  paginas: string[];
  percentualInicial: number;
  openLibraryId: string | null;
};

export function LeitorSimulado({
  livroId,
  titulo,
  paginas,
  percentualInicial,
  openLibraryId,
}: LeitorSimuladoProps) {
  const paginaInicial = Math.min(
    paginas.length - 1,
    Math.floor((percentualInicial / 100) * paginas.length),
  );
  const [pagina, setPagina] = useState(paginaInicial);

  const percentual = Math.round(((pagina + 1) / paginas.length) * 100);

  function irPara(novaPagina: number) {
    const alvo = Math.max(0, Math.min(paginas.length - 1, novaPagina));
    setPagina(alvo);
    const novoPercentual = Math.round(((alvo + 1) / paginas.length) * 100);
    startTransition(() => {
      salvarProgresso(livroId, novoPercentual);
    });
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/meus-livros" className="mb-4 inline-block text-sm text-vinho underline">
          ← Voltar para Meus Livros
        </Link>

        <p className="mb-6 rounded border border-dourado/40 bg-dourado/10 px-4 py-2 text-sm text-tinta">
          ⚠ Simulação de leitor — exibindo a sinopse, não o conteúdo integral
          da obra.
        </p>

        <h1 className="mb-6 font-heading text-2xl text-vinho">{titulo}</h1>

        <p className="mb-8 min-h-32 whitespace-pre-line font-body text-tinta">
          {paginas[pagina]}
        </p>

        <div className="mb-2 flex gap-1">
          {paginas.map((_, indice) => (
            <div
              key={indice}
              className={`h-2 flex-1 rounded ${indice <= pagina ? "bg-verde" : "bg-grafite/20"}`}
            />
          ))}
        </div>
        <p className="mb-6 text-sm text-grafite">
          {percentual}% — página {pagina + 1} de {paginas.length}
        </p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => irPara(pagina - 1)}
            disabled={pagina === 0}
            className="rounded border border-grafite/40 px-4 py-2 text-tinta disabled:opacity-40"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={() => irPara(pagina + 1)}
            disabled={pagina === paginas.length - 1}
            className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-40"
          >
            Próximo →
          </button>
        </div>

        {openLibraryId && (
          <a
            href={`https://openlibrary.org/works/${openLibraryId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block text-sm text-vinho underline"
          >
            Ver este livro na Open Library
          </a>
        )}
      </div>
    </main>
  );
}
