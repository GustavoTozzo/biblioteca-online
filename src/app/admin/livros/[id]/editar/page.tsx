import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

import { EditarLivroForm } from "./editar-livro-form";

const buscarLivro = cache((id: string) => prisma.livro.findUnique({ where: { id } }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const livro = await buscarLivro(id);
  return livro ? { title: `Admin: editar ${livro.titulo}` } : {};
}

export default async function EditarLivroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livro = await buscarLivro(id);
  if (!livro) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">Editar livro</h1>
      <EditarLivroForm livro={livro} />
    </div>
  );
}
