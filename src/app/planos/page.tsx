import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { buscarAssinaturaAtiva } from "@/lib/meus-livros";
import { nomePlano, PLANOS } from "@/lib/planos";

export const metadata: Metadata = { title: "Planos de assinatura" };

export default async function PlanosPage() {
  const session = await auth();
  const assinaturaAtiva = session?.user
    ? await buscarAssinaturaAtiva(session.user.id)
    : null;

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 font-heading text-4xl text-vinho italic">
          Planos de assinatura
        </h1>
        <p className="mb-8 text-grafite">
          Acesso ilimitado a todo o acervo durante o período contratado.
        </p>

        {assinaturaAtiva && (
          <p className="mb-8 rounded border border-verde/40 bg-verde/10 px-4 py-3 text-verde">
            Você já tem uma assinatura {nomePlano(assinaturaAtiva.plano)} ativa
            até {assinaturaAtiva.dataFim.toLocaleDateString("pt-BR")}.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANOS.map((plano) => (
            <div
              key={plano.slug}
              className="flex flex-col gap-3 rounded border border-grafite/20 p-6"
            >
              <h2 className="font-heading text-2xl text-vinho">{plano.nome}</h2>
              <p className="text-3xl text-tinta">
                R$ {plano.preco.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-sm text-grafite">{plano.descricao}</p>
              <Link
                href={`/planos/${plano.slug}/checkout`}
                className="mt-auto rounded bg-vinho px-4 py-2 text-center text-papel"
              >
                Assinar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
