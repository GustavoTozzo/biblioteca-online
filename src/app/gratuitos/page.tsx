import type { Metadata } from "next";
import Image from "next/image";

import { LIVROS_GRATUITOS } from "@/lib/gratuitos";
import { botaoSecundario, capaLivro } from "@/lib/ui";

export const metadata: Metadata = { title: "Domínio público" };

export default function GratuitosPage() {
  return (
    <main className="flex-1 px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium tracking-wide text-dourado uppercase">
          Domínio público
        </p>
        <h1 className="mb-4 max-w-2xl font-heading text-4xl text-vinho italic sm:text-5xl">
          Acervo gratuito
        </h1>
        <p className="mb-10 max-w-xl text-lg text-grafite">
          Uma pequena vitrine de obras em domínio público, com download
          direto e sem restrição, hospedadas no{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-grafite/40 underline-offset-2"
          >
            Internet Archive
          </a>
          . Sem cadastro, sem aluguel — cada livro aqui foi conferido
          manualmente pra garantir que o PDF é de verdade livre pra baixar
          (a maioria dos itens do Internet Archive é só empréstimo, não
          download).
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LIVROS_GRATUITOS.map((livro) => (
            <div
              key={livro.id}
              className="flex gap-4 rounded-2xl border border-grafite/12 bg-white/60 p-4 shadow-sm transition-all duration-150 hover:shadow-md"
            >
              <div className={`${capaLivro} w-20 shrink-0`}>
                <Image
                  src={livro.capaUrl}
                  alt={`Capa de ${livro.titulo}`}
                  width={160}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-heading text-tinta">{livro.titulo}</p>
                <p className="mb-2 text-sm text-grafite">{livro.autor}</p>
                <p className="mb-3 flex-1 text-xs text-grafite">
                  {livro.descricao}
                </p>
                <a
                  href={livro.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${botaoSecundario} w-fit text-xs`}
                >
                  Baixar PDF ({livro.tamanhoMb} MB)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
