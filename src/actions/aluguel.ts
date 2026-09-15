"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { gerarCodigoFake } from "@/lib/pagamento-fake";
import { prisma } from "@/lib/prisma";

const PRECO_POR_LIVRO_POR_DIA = 2.5;

const checkoutSchema = z.object({
  livroIds: z.array(z.string()).min(1, "Seu carrinho está vazio."),
  dias: z
    .number()
    .int()
    .min(1, "Informe pelo menos 1 dia.")
    .max(90, "Prazo máximo de 90 dias."),
  formaPagamento: z.enum(["PIX", "BOLETO", "CARTAO"]),
  cartaoFinal4: z.string().length(4).optional(),
});

export type CheckoutAluguelInput = z.infer<typeof checkoutSchema>;

// O client manda só os IDs dos livros e o prazo — preço, disponibilidade dos
// livros e identidade do usuário são sempre relidos no servidor a partir da
// sessão e do banco, nunca confiados no payload (ver node_modules/next/dist/docs
// server-actions.md, seção de segurança).
export async function criarAluguel(
  _prevState: string | undefined,
  input: CheckoutAluguelInput,
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/carrinho/checkout");
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }
  const dados = parsed.data;

  const livros = await prisma.livro.findMany({
    where: { id: { in: dados.livroIds } },
  });
  if (livros.length === 0) {
    return "Nenhum dos livros do carrinho foi encontrado no acervo.";
  }

  const valorTotal = livros.length * dados.dias * PRECO_POR_LIVRO_POR_DIA;
  const codigoFake = gerarCodigoFake(dados.formaPagamento);

  const dataFim = new Date();
  dataFim.setDate(dataFim.getDate() + dados.dias);

  const aluguel = await prisma.$transaction(async (tx) => {
    const transacao = await tx.transacao.create({
      data: {
        usuarioId: session.user.id,
        formaPagamento: dados.formaPagamento,
        valor: valorTotal,
        codigoFake,
        cartaoFinal4: dados.cartaoFinal4 ?? null,
      },
    });

    return tx.aluguel.create({
      data: {
        usuarioId: session.user.id,
        dias: dados.dias,
        dataFim,
        valorTotal,
        formaPagamento: dados.formaPagamento,
        transacaoId: transacao.id,
        itens: {
          create: livros.map((livro) => ({
            livroId: livro.id,
            valorUnitario: dados.dias * PRECO_POR_LIVRO_POR_DIA,
          })),
        },
      },
    });
  });

  redirect(`/carrinho/checkout/sucesso/${aluguel.id}`);
}
