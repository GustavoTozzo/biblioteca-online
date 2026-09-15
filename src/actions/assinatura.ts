"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { buscarPlanoPorSlug } from "@/lib/planos";
import { gerarCodigoFake } from "@/lib/pagamento-fake";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  planoSlug: z.string(),
  // Assinatura só aceita Pix ou cartão (regra do briefing) — boleto é só pro aluguel unitário.
  formaPagamento: z.enum(["PIX", "CARTAO"]),
  cartaoFinal4: z.string().length(4).optional(),
});

export type CheckoutAssinaturaInput = z.infer<typeof checkoutSchema>;

export async function criarAssinatura(
  _prevState: string | undefined,
  input: CheckoutAssinaturaInput,
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/planos");
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos.";
  }

  // O plano (preço/prazo) é sempre relido do catálogo fixo no servidor a
  // partir do slug — nunca aceito do cliente diretamente.
  const plano = buscarPlanoPorSlug(parsed.data.planoSlug);
  if (!plano) return "Plano inválido.";

  const dataFim = new Date();
  dataFim.setDate(dataFim.getDate() + plano.dias);

  const codigoFake = gerarCodigoFake(parsed.data.formaPagamento);

  const assinatura = await prisma.$transaction(async (tx) => {
    // Não faz sentido ter duas assinaturas ativas ao mesmo tempo — contratar
    // um novo plano substitui (cancela) qualquer assinatura ativa anterior.
    await tx.assinatura.updateMany({
      where: { usuarioId: session.user.id, status: "ATIVA" },
      data: { status: "CANCELADA" },
    });

    const transacao = await tx.transacao.create({
      data: {
        usuarioId: session.user.id,
        formaPagamento: parsed.data.formaPagamento,
        valor: plano.preco,
        codigoFake,
        cartaoFinal4: parsed.data.cartaoFinal4 ?? null,
      },
    });

    return tx.assinatura.create({
      data: {
        usuarioId: session.user.id,
        plano: plano.id,
        dataFim,
        valor: plano.preco,
        formaPagamento: parsed.data.formaPagamento,
        renovacaoAutomatica: parsed.data.formaPagamento === "CARTAO",
        transacaoId: transacao.id,
      },
    });
  });

  redirect(`/planos/${plano.slug}/checkout/sucesso/${assinatura.id}`);
}
