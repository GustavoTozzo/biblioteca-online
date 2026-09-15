import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin: painel" };

export default async function AdminDashboard() {
  const [totalLivros, totalUsuarios] = await Promise.all([
    prisma.livro.count(),
    prisma.usuario.count(),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">
        Painel administrativo
      </h1>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/livros"
          className="rounded-2xl border border-grafite/12 bg-white/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm text-grafite">Livros no acervo</p>
          <p className="text-3xl font-medium text-vinho">{totalLivros}</p>
        </Link>
        <Link
          href="/admin/usuarios"
          className="rounded-2xl border border-grafite/12 bg-white/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm text-grafite">Usuários cadastrados</p>
          <p className="text-3xl font-medium text-vinho">{totalUsuarios}</p>
        </Link>
      </div>
    </div>
  );
}
