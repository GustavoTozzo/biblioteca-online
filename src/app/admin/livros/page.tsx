import type { Metadata } from "next";
import Link from "next/link";

import { excluirLivro } from "@/actions/livros";
import { prisma } from "@/lib/prisma";
import { botaoPrimario, faixaErro, linkDiscreto, linkPerigo } from "@/lib/ui";

export const metadata: Metadata = { title: "Admin: livros" };

export default async function AdminLivrosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const livros = await prisma.livro.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-vinho">Livros</h1>
        <Link href="/admin/livros/novo" className={botaoPrimario}>
          Novo livro
        </Link>
      </div>

      {erro && <p className={`${faixaErro} mb-4`}>{erro}</p>}

      {livros.length === 0 ? (
        <p className="text-grafite">Nenhum livro cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-grafite/12 bg-white/60 shadow-sm">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-grafite/12 text-grafite">
                <th className="px-5 py-3">Título</th>
                <th className="px-3 py-3">Autor</th>
                <th className="px-3 py-3">Categoria</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr
                  key={livro.id}
                  className="border-b border-grafite/8 last:border-0"
                >
                  <td className="px-5 py-3">{livro.titulo}</td>
                  <td className="px-3 py-3">{livro.autor}</td>
                  <td className="px-3 py-3">{livro.categoria}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/livros/${livro.id}/editar`}
                        className={linkDiscreto}
                      >
                        Editar
                      </Link>
                      <form action={excluirLivro.bind(null, livro.id)}>
                        <button type="submit" className={linkPerigo}>
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
