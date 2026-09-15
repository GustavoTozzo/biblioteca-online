"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Chamada silenciosa em background a cada página virada — sem estado de
// erro/pendência visível, por isso não usa useActionState.
export async function salvarProgresso(livroId: string, percentual: number) {
  const session = await auth();
  if (!session?.user) return;

  const percentualValido = Math.max(0, Math.min(100, Math.round(percentual)));

  await prisma.progressoLeitura.upsert({
    where: { usuarioId_livroId: { usuarioId: session.user.id, livroId } },
    create: { usuarioId: session.user.id, livroId, percentual: percentualValido },
    update: { percentual: percentualValido },
  });
}
