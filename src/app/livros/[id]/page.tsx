import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { linkDiscreto } from "@/lib/ui";

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
    <main className="flex-1 px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 sm:flex-row">
        <div className="aspect-2/3 w-48 shrink-0 overflow-hidden rounded-2xl bg-grafite/8 shadow-md ring-1 ring-black/5 sm:w-56">
          {livro.capaUrl && (
            <Image
              src={livro.capaUrl}
              alt={`Capa de ${livro.titulo}`}
              width={400}
              height={600}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <span className="mb-3 inline-block rounded-full bg-dourado/15 px-3 py-1 text-xs font-medium tracking-wide text-dourado uppercase">
            {livro.categoria}
          </span>
          <h1 className="mb-2 font-heading text-4xl text-vinho">{livro.titulo}</h1>
          <p className="mb-6 text-grafite">{livro.autor}</p>
          <p className="mb-8 leading-relaxed whitespace-pre-line text-tinta">
            {livro.descricao}
          </p>
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
            <Link href="/planos" className={linkDiscreto}>
              Veja os planos de assinatura
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
