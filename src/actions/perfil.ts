"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const perfilSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe seu nome completo."),
  telefone: z.string().min(8, "Telefone inválido."),
  cep: z.string().min(8, "CEP inválido."),
  logradouro: z.string().min(1, "Informe o logradouro."),
  numero: z.string().min(1, "Informe o número."),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Informe o bairro."),
  cidade: z.string().min(1, "Informe a cidade."),
  estado: z.string().length(2, "UF deve ter 2 letras."),
});

export type EstadoPerfil = {
  erro?: string;
  sucesso?: boolean;
};

// Requisito 7: cliente visualiza e edita seus dados pessoais. E-mail e CPF
// não são editáveis por aqui — são identificadores, mudá-los é fora de
// escopo (exigiria reverificação, fora do que o briefing pede).
export async function atualizarPerfil(
  _prevState: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/perfil");
  }

  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const dados = parsed.data;
  await prisma.usuario.update({
    where: { id: session.user.id },
    data: {
      nomeCompleto: dados.nomeCompleto,
      telefone: dados.telefone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento || null,
      bairro: dados.bairro,
      cidade: dados.cidade,
      estado: dados.estado.toUpperCase(),
    },
  });

  revalidatePath("/perfil");
  return { sucesso: true };
}
