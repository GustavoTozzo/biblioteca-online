import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

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
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 font-heading text-4xl text-vinho italic">
          Biblioteca Online
        </h1>
        <p className="mb-8 text-grafite">
          Alugue livros digitais ou assine para acesso ilimitado ao acervo.
        </p>

        <form className="mb-8 flex flex-wrap gap-2" action="/">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por título ou autor..."
            className="min-w-[200px] flex-1 rounded border border-grafite/40 bg-white px-3 py-2"
          />
          <select
            name="categoria"
            defaultValue={categoria ?? ""}
            className="rounded border border-grafite/40 bg-white px-3 py-2"
          >
            <option value="">Todas as categorias</option>
            {categoriasBrutas.map((c) => (
              <option key={c.categoria} value={c.categoria}>
                {c.categoria}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded bg-vinho px-4 py-2 text-papel"
          >
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
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {livros.map((livro) => (
              <Link
                key={livro.id}
                href={`/livros/${livro.id}`}
                className="group flex flex-col gap-2"
              >
                <div className="aspect-2/3 overflow-hidden rounded bg-grafite/10">
                  {livro.capaUrl && (
                    <Image
                      src={livro.capaUrl}
                      alt=""
                      width={200}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="font-heading text-tinta group-hover:text-vinho">
                  {livro.titulo}
                </span>
                <span className="text-sm text-grafite">{livro.autor}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
