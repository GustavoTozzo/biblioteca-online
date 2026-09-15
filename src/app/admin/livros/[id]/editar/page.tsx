import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { EditarLivroForm } from "./editar-livro-form";

export default async function EditarLivroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livro = await prisma.livro.findUnique({ where: { id } });
  if (!livro) notFound();

  return (
    <div>
      <h1 className="mb-4 font-heading text-2xl text-vinho">Editar livro</h1>
      <EditarLivroForm livro={livro} />
    </div>
  );
}
