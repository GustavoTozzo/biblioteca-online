import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

import { AdicionarCarrinhoButton } from "./adicionar-carrinho-button";

const buscarLivro = cache((id: string) => prisma.livro.findUnique({ where: { id } }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const livro = await buscarLivro(id);
  if (!livro) return {};
  return {
    title: livro.titulo,
    description: livro.descricao.slice(0, 160),
  };
}

export default async function LivroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livro = await buscarLivro(id);
  if (!livro) notFound();

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 sm:flex-row">
        <div className="aspect-2/3 w-48 shrink-0 overflow-hidden rounded bg-grafite/10">
          {livro.capaUrl && (
            <Image
              src={livro.capaUrl}
              alt={`Capa de ${livro.titulo}`}
              width={300}
              height={450}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="font-heading text-3xl text-vinho">{livro.titulo}</h1>
          <p className="mb-4 text-grafite">
            {livro.autor} · {livro.categoria}
          </p>
          <p className="mb-6 whitespace-pre-line text-tinta">{livro.descricao}</p>
          <AdicionarCarrinhoButton
            livro={{
              id: livro.id,
              titulo: livro.titulo,
              autor: livro.autor,
              capaUrl: livro.capaUrl,
            }}
          />
          <p className="mt-4 text-sm text-grafite">
            Prefere acesso ilimitado?{" "}
            <Link href="/planos" className="text-vinho underline">
              Veja os planos de assinatura
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
