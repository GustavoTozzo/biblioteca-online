import { prisma } from "@/lib/prisma";

export type LivroComOrigem = {
  livroId: string;
  titulo: string;
  autor: string;
  capaUrl: string | null;
  origem: "ALUGUEL" | "ASSINATURA";
  disponivelAte: Date | null; // null quando o acesso vem de assinatura
};

// União: livros com aluguel ainda ativo + (se houver assinatura ativa) o
// catálogo inteiro. Escrita para já funcionar quando a Fase 5 adicionar o
// fluxo de assinatura — a tabela Assinatura já existe desde a Fase 2.
export async function buscarMeusLivros(
  usuarioId: string,
): Promise<LivroComOrigem[]> {
  const agora = new Date();

  const [alugueisAtivos, assinaturaAtiva] = await Promise.all([
    prisma.aluguel.findMany({
      where: { usuarioId, status: "ATIVO", dataFim: { gte: agora } },
      include: { itens: { include: { livro: true } } },
    }),
    prisma.assinatura.findFirst({
      where: { usuarioId, status: "ATIVA", dataFim: { gte: agora } },
    }),
  ]);

  const porLivroId = new Map<string, LivroComOrigem>();

  for (const aluguel of alugueisAtivos) {
    for (const item of aluguel.itens) {
      const existente = porLivroId.get(item.livroId);
      if (!existente || (existente.disponivelAte?.getTime() ?? 0) < aluguel.dataFim.getTime()) {
        porLivroId.set(item.livroId, {
          livroId: item.livroId,
          titulo: item.livro.titulo,
          autor: item.livro.autor,
          capaUrl: item.livro.capaUrl,
          origem: "ALUGUEL",
          disponivelAte: aluguel.dataFim,
        });
      }
    }
  }

  if (assinaturaAtiva) {
    const todosLivros = await prisma.livro.findMany();
    for (const livro of todosLivros) {
      porLivroId.set(livro.id, {
        livroId: livro.id,
        titulo: livro.titulo,
        autor: livro.autor,
        capaUrl: livro.capaUrl,
        origem: "ASSINATURA",
        disponivelAte: null,
      });
    }
  }

  return Array.from(porLivroId.values()).sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "pt-BR"),
  );
}
