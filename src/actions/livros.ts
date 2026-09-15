"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

async function exigirAdmin() {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    throw new Error("Não autorizado.");
  }
}

const livroSchema = z.object({
  titulo: z.string().min(1, "Informe o título."),
  autor: z.string().min(1, "Informe o autor."),
  descricao: z.string().min(1, "Informe a descrição."),
  categoria: z.string().min(1, "Informe a categoria."),
  capaUrl: z.string().optional(),
  openLibraryId: z.string().optional(),
});

export async function criarLivro(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await exigirAdmin();
  const parsed = livroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const dados = parsed.data;
  await prisma.livro.create({
    data: {
      titulo: dados.titulo,
      autor: dados.autor,
      descricao: dados.descricao,
      categoria: dados.categoria,
      capaUrl: dados.capaUrl || null,
      openLibraryId: dados.openLibraryId || null,
    },
  });

  revalidatePath("/");
  redirect("/admin/livros");
}

export async function atualizarLivro(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await exigirAdmin();
  const parsed = livroSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  const dados = parsed.data;
  await prisma.livro.update({
    where: { id },
    data: {
      titulo: dados.titulo,
      autor: dados.autor,
      descricao: dados.descricao,
      categoria: dados.categoria,
      capaUrl: dados.capaUrl || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/livros/${id}`);
  redirect("/admin/livros");
}

export async function excluirLivro(id: string) {
  await exigirAdmin();

  try {
    await prisma.livro.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      redirect(
        "/admin/livros?erro=" +
          encodeURIComponent(
            "Esse livro já foi alugado por algum cliente e não pode ser removido.",
          ),
      );
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/livros");
}
