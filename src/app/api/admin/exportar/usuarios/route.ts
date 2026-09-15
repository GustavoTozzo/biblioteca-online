import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { campoCsv, gerarCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";

const NOME_TIPO_USUARIO = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador",
} as const;

export async function GET() {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const usuarios = await prisma.usuario.findMany({ orderBy: { criadoEm: "asc" } });

  // Mesmo escopo de campos do CSV original: nunca exportar e-mail nem senha
  // (ver docs/modelagem-dados.md).
  const linhas = usuarios.map((usuario) =>
    [
      usuario.id,
      campoCsv(usuario.nomeCompleto),
      campoCsv(usuario.cpf),
      campoCsv(usuario.telefone),
      campoCsv(NOME_TIPO_USUARIO[usuario.papel]),
    ].join(";"),
  );

  const csv = gerarCsv("ID;Nome Completo;CPF;Telefone;Tipo Usuário", linhas);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="usuarios.csv"',
    },
  });
}
