import Link from "next/link";

import { excluirLivro } from "@/actions/livros";
import { prisma } from "@/lib/prisma";

export default async function AdminLivrosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const livros = await prisma.livro.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-vinho">Livros</h1>
        <Link
          href="/admin/livros/novo"
          className="rounded bg-vinho px-3 py-1.5 text-sm text-papel"
        >
          Novo livro
        </Link>
      </div>

      {erro && <p className="mb-4 text-sm text-selo">{erro}</p>}

      {livros.length === 0 ? (
        <p className="text-grafite">Nenhum livro cadastrado ainda.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-grafite/20 text-grafite">
              <th className="py-2">Título</th>
              <th>Autor</th>
              <th>Categoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id} className="border-b border-grafite/10">
                <td className="py-2">{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.categoria}</td>
                <td>
                  <div className="flex gap-3 py-2">
                    <Link
                      href={`/admin/livros/${livro.id}/editar`}
                      className="text-vinho underline"
                    >
                      Editar
                    </Link>
                    <form action={excluirLivro.bind(null, livro.id)}>
                      <button type="submit" className="text-selo underline">
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
