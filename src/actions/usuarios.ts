"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { auth, signIn } from "@/auth";
import { cpfValido, limparCpf } from "@/lib/cpf";
import { prisma } from "@/lib/prisma";
import { telefoneValido } from "@/lib/telefone";

async function exigirAdmin() {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    throw new Error("Não autorizado.");
  }
  return session;
}

const cadastroSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  cpf: z.string().refine(cpfValido, "CPF inválido."),
  dataNascimento: z.string().min(1, "Informe sua data de nascimento."),
  telefone: z.string().refine(telefoneValido, "Telefone inválido."),
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

const edicaoUsuarioSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string().refine(telefoneValido, "Telefone inválido."),
  novaSenha: z
    .string()
    .optional()
    .refine(
      (senha) => !senha || senha.length >= 8,
      "A nova senha precisa ter pelo menos 8 caracteres.",
    ),
});

// Admin edita dados de qualquer usuário — CPF e data de nascimento ficam de
// fora (identificadores, mesma decisão de perfil.ts) e o papel também não é
// editável por aqui (único ADMINISTRADOR é o do seed, ver comentário acima).
// Redefinir senha é opcional: em branco mantém a senha atual.
export async function atualizarUsuario(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await exigirAdmin();

  const parsed = edicaoUsuarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const dados = parsed.data;

  const emailEmUso = await prisma.usuario.findFirst({
    where: { email: dados.email, NOT: { id } },
  });
  if (emailEmUso) {
    return "Esse e-mail já está em uso por outro usuário.";
  }

  await prisma.usuario.update({
    where: { id },
    data: {
      nomeCompleto: dados.nomeCompleto,
      email: dados.email,
      telefone: dados.telefone,
      ...(dados.novaSenha
        ? { senhaHash: await bcrypt.hash(dados.novaSenha, 10) }
        : {}),
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

// Exclusão é bloqueada pela própria integridade referencial do banco
// (usuário com aluguel/assinatura/histórico não pode ser removido) — mesmo
// padrão de excluirLivro em actions/livros.ts.
export async function excluirUsuario(id: string) {
  const session = await exigirAdmin();

  if (session?.user?.id === id) {
    redirect(
      "/admin/usuarios?erro=" +
        encodeURIComponent("Você não pode excluir sua própria conta."),
    );
  }

  try {
    await prisma.usuario.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      redirect(
        "/admin/usuarios?erro=" +
          encodeURIComponent(
            "Esse usuário tem aluguéis ou assinaturas registradas e não pode ser removido.",
          ),
      );
    }
    throw error;
  }

  revalidatePath("/admin/usuarios");
}
