import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function LivroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const livro = await prisma.livro.findUnique({ where: { id } });
  if (!livro) notFound();

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto flex max-w-3xl gap-8">
        <div className="aspect-2/3 w-48 shrink-0 overflow-hidden rounded bg-grafite/10">
          {livro.capaUrl && (
            <Image
              src={livro.capaUrl}
              alt=""
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
          <p className="whitespace-pre-line text-tinta">{livro.descricao}</p>
          <p className="mt-6 text-sm text-grafite italic">
            Aluguel e assinatura chegam na próxima fase.
          </p>
        </div>
      </div>
    </main>
  );
}
