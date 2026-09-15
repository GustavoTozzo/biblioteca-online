import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { botaoPrimario, botaoSecundario, campoInput, capaLivro, cartaoLivro } from "@/lib/ui";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;

  const [livros, categoriasBrutas] = await Promise.all([
    prisma.livro.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { titulo: { contains: q, mode: "insensitive" } },
                  { autor: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          categoria ? { categoria } : {},
        ],
      },
      orderBy: { criadoEm: "desc" },
    }),
    prisma.livro.findMany({
      distinct: ["categoria"],
      select: { categoria: true },
      orderBy: { categoria: "asc" },
    }),
  ]);

  return (
    <main className="flex-1">
      <section className="border-b border-grafite/10 bg-gradient-to-b from-dourado/8 to-transparent px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-dourado uppercase">
            Sua estante, sem limites
          </p>
          <h1 className="mb-4 max-w-2xl font-heading text-5xl leading-tight text-vinho italic sm:text-6xl">
            Biblioteca Online
          </h1>
          <p className="mb-8 max-w-lg text-lg text-grafite">
            Alugue livros digitais avulsos ou assine um plano para acesso
            ilimitado a todo o acervo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/planos" className={botaoPrimario}>
              Ver planos de assinatura
            </Link>
            <a href="#acervo" className={botaoSecundario}>
              Explorar o acervo
            </a>
          </div>
        </div>
      </section>

      <div id="acervo" className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        <form
          className="mb-10 flex flex-wrap gap-3 rounded-2xl border border-grafite/10 bg-white/50 p-4 shadow-sm"
          action="/"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por título ou autor..."
            className={`${campoInput} min-w-[200px] flex-1`}
          />
          <select
            name="categoria"
            defaultValue={categoria ?? ""}
            className={`${campoInput} w-auto`}
          >
            <option value="">Todas as categorias</option>
            {categoriasBrutas.map((c) => (
              <option key={c.categoria} value={c.categoria}>
                {c.categoria}
              </option>
            ))}
          </select>
          <button type="submit" className={botaoPrimario}>
            Buscar
          </button>
        </form>

        {livros.length === 0 ? (
          <p className="text-grafite">
            {q || categoria
              ? "Nenhum livro encontrado."
              : "Nenhum livro cadastrado ainda — volte em breve."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
            {livros.map((livro) => (
              <Link key={livro.id} href={`/livros/${livro.id}`} className={cartaoLivro}>
                <div className={capaLivro}>
                  {livro.capaUrl && (
                    <Image
                      src={livro.capaUrl}
                      alt={`Capa de ${livro.titulo}`}
                      width={200}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-heading text-tinta transition-colors group-hover:text-vinho">
                    {livro.titulo}
                  </p>
                  <p className="text-sm text-grafite">{livro.autor}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
