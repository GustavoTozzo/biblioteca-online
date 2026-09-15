import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { auth } from "@/auth";
import { nomePlano } from "@/lib/planos";
import { prisma } from "@/lib/prisma";
import { botaoPrimario, cartao } from "@/lib/ui";

export const metadata: Metadata = { title: "Assinatura ativada" };

export default async function SucessoAssinaturaPage({
  params,
}: {
  params: Promise<{ assinaturaId: string }>;
}) {
  const { assinaturaId } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  const assinatura = await prisma.assinatura.findUnique({
    where: { id: assinaturaId },
    include: { transacao: true },
  });

  // Uma assinatura só é visível pra quem é dona dela — nunca confiar só no ID da URL.
  if (!assinatura || assinatura.usuarioId !== session.user.id) notFound();

  const qrCodeDataUrl =
    assinatura.formaPagamento === "PIX" && assinatura.transacao
      ? await QRCode.toDataURL(assinatura.transacao.codigoFake)
      : null;

  return (
    <main className="flex-1 px-6 py-10">
      <div className={`${cartao} mx-auto max-w-xl`}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde/12 text-xl text-verde">
            ✓
          </span>
          <h1 className="font-heading text-3xl text-verde">
            Assinatura ativada!
          </h1>
        </div>
        <p className="mb-2 text-grafite">
          Plano {nomePlano(assinatura.plano)} ativo até{" "}
          {assinatura.dataFim.toLocaleDateString("pt-BR")} — acesso ilimitado
          ao acervo.
        </p>
        <p className="mb-6 text-lg font-medium text-vinho">
          Valor pago: R${" "}
          {Number(assinatura.valor).toFixed(2).replace(".", ",")}
        </p>

        {assinatura.transacao && (
          <div className="mb-6 rounded-xl border border-grafite/15 bg-grafite/4 p-4">
            <p className="mb-2 text-sm text-grafite">
              {assinatura.formaPagamento === "PIX"
                ? "Chave Pix (simulada):"
                : "Código de autorização (simulado):"}
            </p>
            <p className="font-mono text-sm text-tinta">
              {assinatura.transacao.codigoFake}
            </p>
            {qrCodeDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- data: URL gerada em runtime, não passa pelo otimizador de imagem
              <img
                src={qrCodeDataUrl}
                alt="QR Code Pix simulado"
                width={160}
                height={160}
                className="mt-4 rounded-lg shadow-sm"
              />
            )}
          </div>
        )}

        {assinatura.renovacaoAutomatica && (
          <p className="mb-4 text-xs text-grafite italic">
            Renovação automática configurada (simulada) — sem cobrança
            recorrente real.
          </p>
        )}

        <Link href="/meus-livros" className={botaoPrimario}>
          Ver Meus Livros
        </Link>
      </div>
    </main>
  );
}
