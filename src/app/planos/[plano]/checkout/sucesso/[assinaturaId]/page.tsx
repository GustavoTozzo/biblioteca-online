import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { auth } from "@/auth";
import { nomePlano } from "@/lib/planos";
import { prisma } from "@/lib/prisma";

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
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 font-heading text-3xl text-verde">
          Assinatura ativada!
        </h1>
        <p className="mb-2 text-grafite">
          Plano {nomePlano(assinatura.plano)} ativo até{" "}
          {assinatura.dataFim.toLocaleDateString("pt-BR")} — acesso ilimitado
          ao acervo.
        </p>
        <p className="mb-6 text-lg text-vinho">
          Valor pago: R${" "}
          {Number(assinatura.valor).toFixed(2).replace(".", ",")}
        </p>

        {assinatura.transacao && (
          <div className="mb-6 rounded border border-grafite/20 p-4">
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
                className="mt-4"
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

        <Link href="/meus-livros" className="rounded bg-vinho px-4 py-2 text-papel">
          Ver Meus Livros
        </Link>
      </div>
    </main>
  );
}
