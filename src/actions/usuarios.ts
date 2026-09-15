"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { signIn } from "@/auth";
import { cpfValido, limparCpf } from "@/lib/cpf";
import { prisma } from "@/lib/prisma";

const cadastroSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  cpf: z.string().refine(cpfValido, "CPF inválido."),
  dataNascimento: z.string().min(1, "Informe sua data de nascimento."),
  telefone: z.string().min(8, "Telefone inválido."),
  cep: z.string().min(8, "CEP inválido."),
  logradouro: z.string().min(1, "Informe o logradouro."),
  numero: z.string().min(1, "Informe o número."),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Informe o bairro."),
  cidade: z.string().min(1, "Informe a cidade."),
  estado: z.string().length(2, "UF deve ter 2 letras."),
});

// Papel é sempre CLIENTE aqui — nunca aceito do formulário. O único
// ADMINISTRADOR do sistema é criado pelo script de seed (prisma/seed.ts).
export async function cadastrarUsuario(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const parsed = cadastroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const dados = parsed.data;
  const cpfLimpo = limparCpf(dados.cpf);

  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email: dados.email }, { cpf: cpfLimpo }] },
  });
  if (existente) {
    return existente.email === dados.email
      ? "Esse e-mail já está cadastrado."
      : "Esse CPF já está cadastrado.";
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  await prisma.usuario.create({
    data: {
      nomeCompleto: dados.nomeCompleto,
      email: dados.email,
      senhaHash,
      cpf: cpfLimpo,
      dataNascimento: new Date(dados.dataNascimento),
      telefone: dados.telefone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento || null,
      bairro: dados.bairro,
      cidade: dados.cidade,
      estado: dados.estado.toUpperCase(),
      papel: "CLIENTE",
    },
  });

  const formLogin = new FormData();
  formLogin.set("email", dados.email);
  formLogin.set("senha", dados.senha);
  formLogin.set("redirectTo", "/");
  await signIn("credentials", formLogin);
}
