import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { LimparCarrinhoAoMontar } from "./limpar-carrinho-ao-montar";

export const metadata: Metadata = { title: "Pagamento confirmado" };

const RUBRICA_CODIGO: Record<string, string> = {
  PIX: "Chave Pix (simulada):",
  BOLETO: "Linha digitável (simulada):",
  CARTAO: "Código de autorização (simulado):",
};

export default async function SucessoAluguelPage({
  params,
}: {
  params: Promise<{ aluguelId: string }>;
}) {
  const { aluguelId } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  const aluguel = await prisma.aluguel.findUnique({
    where: { id: aluguelId },
    include: { itens: { include: { livro: true } }, transacao: true },
  });

  // Um aluguel só é visível pra quem é dono dele — nunca confiar só no ID da URL.
  if (!aluguel || aluguel.usuarioId !== session.user.id) notFound();

  const qrCodeDataUrl =
    aluguel.formaPagamento === "PIX" && aluguel.transacao
      ? await QRCode.toDataURL(aluguel.transacao.codigoFake)
      : null;

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <LimparCarrinhoAoMontar />

        <h1 className="mb-4 font-heading text-3xl text-verde">
          Pagamento confirmado!
        </h1>
        <p className="mb-2 text-grafite">
          {aluguel.itens.length} livro
          {aluguel.itens.length > 1 ? "s" : ""} alugado
          {aluguel.itens.length > 1 ? "s" : ""} por {aluguel.dias} dia
          {aluguel.dias > 1 ? "s" : ""}, disponíve
          {aluguel.itens.length > 1 ? "is" : "l"} até{" "}
          {aluguel.dataFim.toLocaleDateString("pt-BR")}.
        </p>
        <p className="mb-6 text-lg text-vinho">
          Valor pago: R$ {Number(aluguel.valorTotal).toFixed(2).replace(".", ",")}
        </p>

        {aluguel.transacao && (
          <div className="mb-6 rounded border border-grafite/20 p-4">
            <p className="mb-2 text-sm text-grafite">
              {RUBRICA_CODIGO[aluguel.formaPagamento]}
            </p>
            <p className="font-mono text-sm text-tinta">
              {aluguel.transacao.codigoFake}
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

        <ul className="mb-6 flex flex-col gap-3">
          {aluguel.itens.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="aspect-2/3 w-12 shrink-0 overflow-hidden rounded bg-grafite/10">
                {item.livro.capaUrl && (
                  <Image
                    src={item.livro.capaUrl}
                    alt={`Capa de ${item.livro.titulo}`}
                    width={48}
                    height={72}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="text-tinta">{item.livro.titulo}</span>
            </li>
          ))}
        </ul>

        <Link href="/meus-livros" className="rounded bg-vinho px-4 py-2 text-papel">
          Ver Meus Livros
        </Link>
      </div>
    </main>
  );
}
