import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalLivros, totalUsuarios] = await Promise.all([
    prisma.livro.count(),
    prisma.usuario.count(),
  ]);

  return (
    <div>
      <h1 className="mb-4 font-heading text-2xl text-vinho">
        Painel administrativo
      </h1>
      <div className="flex gap-4">
        <Link
          href="/admin/livros"
          className="rounded border border-grafite/20 p-4 hover:border-vinho"
        >
          <p className="text-sm text-grafite">Livros no acervo</p>
          <p className="text-3xl text-vinho">{totalLivros}</p>
        </Link>
        <Link
          href="/admin/usuarios"
          className="rounded border border-grafite/20 p-4 hover:border-vinho"
        >
          <p className="text-sm text-grafite">Usuários cadastrados</p>
          <p className="text-3xl text-vinho">{totalUsuarios}</p>
        </Link>
      </div>
    </div>
  );
}
