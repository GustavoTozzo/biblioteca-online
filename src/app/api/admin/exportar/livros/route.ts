import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { campoCsv, gerarCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const livros = await prisma.livro.findMany({ orderBy: { criadoEm: "asc" } });

  const linhas = livros.map((livro) =>
    [
      livro.id,
      campoCsv(livro.titulo),
      campoCsv(livro.autor),
      campoCsv(livro.descricao),
      campoCsv(livro.categoria),
    ].join(";"),
  );

  const csv = gerarCsv("ID;Título;Autor;Descrição;Categoria", linhas);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="livros.csv"',
    },
  });
}
