import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { buscarMeusLivros } from "@/lib/meus-livros";
import { paginarTexto } from "@/lib/paginar-texto";
import { prisma } from "@/lib/prisma";

import { LeitorSimulado } from "./leitor-simulado";

export default async function LerLivroPage({
  params,
}: {
  params: Promise<{ livroId: string }>;
}) {
  const { livroId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/meus-livros/${livroId}/ler`);
  }

  // Só pode abrir o leitor quem tem acesso de verdade (aluguel ativo ou
  // assinatura) — nunca confiar só no ID da URL.
  const meusLivros = await buscarMeusLivros(session.user.id);
  const acesso = meusLivros.some((l) => l.livroId === livroId);
  if (!acesso) notFound();

  const livro = await prisma.livro.findUnique({ where: { id: livroId } });
  if (!livro) notFound();

  const progresso = await prisma.progressoLeitura.findUnique({
    where: { usuarioId_livroId: { usuarioId: session.user.id, livroId } },
  });

  const paginas = paginarTexto(livro.descricao);

  return (
    <LeitorSimulado
      livroId={livro.id}
      titulo={livro.titulo}
      paginas={paginas}
      percentualInicial={progresso?.percentual ?? 0}
      openLibraryId={livro.openLibraryId}
    />
  );
}
