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
        <div className="rounded border border-grafite/20 p-4">
          <p className="text-sm text-grafite">Livros no acervo</p>
          <p className="text-3xl text-vinho">{totalLivros}</p>
        </div>
        <div className="rounded border border-grafite/20 p-4">
          <p className="text-sm text-grafite">Usuários cadastrados</p>
          <p className="text-3xl text-vinho">{totalUsuarios}</p>
        </div>
      </div>
    </div>
  );
}
