"use client";

import Link from "next/link";
import { startTransition, useState } from "react";

import { salvarProgresso } from "@/actions/leitura";
import { botaoPrimario, botaoSecundario, cartao, faixaAviso, linkDiscreto } from "@/lib/ui";

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
        <Link href="/meus-livros" className={`${linkDiscreto} mb-4 inline-block`}>
          ← Voltar para Meus Livros
        </Link>

        <p className={`${faixaAviso} mb-6`}>
          ⚠ Simulação de leitor — exibindo a sinopse, não o conteúdo integral
          da obra.
        </p>

        <div className={`${cartao} hover:shadow-sm`}>
          <h1 className="mb-6 font-heading text-2xl text-vinho">{titulo}</h1>

          <p className="mb-8 min-h-32 leading-relaxed whitespace-pre-line font-body text-tinta">
            {paginas[pagina]}
          </p>

          <div className="mb-2 flex gap-1">
            {paginas.map((_, indice) => (
              <div
                key={indice}
                className={`h-1.5 flex-1 rounded-full transition-colors ${indice <= pagina ? "bg-verde" : "bg-grafite/15"}`}
              />
            ))}
          </div>
          <p className="mb-6 text-sm text-grafite">
            {percentual}% — página {pagina + 1} de {paginas.length}
          </p>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => irPara(pagina - 1)}
              disabled={pagina === 0}
              className={botaoSecundario}
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => irPara(pagina + 1)}
              disabled={pagina === paginas.length - 1}
              className={botaoPrimario}
            >
              Próximo →
            </button>
          </div>
        </div>

        {openLibraryId && (
          <a
            href={`https://openlibrary.org/works/${openLibraryId}`}
            target="_blank"
            rel="noreferrer"
            className={`${linkDiscreto} mt-6 inline-block`}
          >
            Ver este livro na Open Library
          </a>
        )}
      </div>
    </main>
  );
}
