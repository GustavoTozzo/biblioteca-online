import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { buscarAssinaturaAtiva } from "@/lib/meus-livros";
import { nomePlano, PLANOS } from "@/lib/planos";
import { botaoPrimario, botaoSecundario, faixaSucesso } from "@/lib/ui";

export const metadata: Metadata = { title: "Planos de assinatura" };

export default async function PlanosPage() {
  const session = await auth();
  const assinaturaAtiva = session?.user
    ? await buscarAssinaturaAtiva(session.user.id)
    : null;

  return (
    <main className="flex-1 px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium tracking-wide text-dourado uppercase">
          Planos
        </p>
        <h1 className="mb-3 font-heading text-4xl text-vinho italic sm:text-5xl">
          Assinatura Biblioteca Online
        </h1>
        <p className="mb-10 max-w-lg text-lg text-grafite">
          Acesso ilimitado a todo o acervo durante o período contratado.
        </p>

        {assinaturaAtiva && (
          <p className={`${faixaSucesso} mb-10`}>
            Você já tem uma assinatura {nomePlano(assinaturaAtiva.plano)} ativa
            até {assinaturaAtiva.dataFim.toLocaleDateString("pt-BR")}.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANOS.map((plano) => {
            const destaque = plano.slug === "semestral";
            return (
              <div
                key={plano.slug}
                className={`flex flex-col gap-4 rounded-2xl border p-7 shadow-sm transition-all duration-150 hover:shadow-md ${
                  destaque
                    ? "border-vinho/40 bg-white ring-2 ring-vinho/10"
                    : "border-grafite/12 bg-white/60"
                }`}
              >
                {destaque && (
                  <span className="w-fit rounded-full bg-vinho px-3 py-1 text-xs font-medium text-papel">
                    Mais popular
                  </span>
                )}
                <h2 className="font-heading text-2xl text-vinho">{plano.nome}</h2>
                <p className="text-3xl font-medium text-tinta">
                  R$ {plano.preco.toFixed(2).replace(".", ",")}
                </p>
                <p className="flex-1 text-sm text-grafite">{plano.descricao}</p>
                <Link
                  href={`/planos/${plano.slug}/checkout`}
                  className={destaque ? botaoPrimario : botaoSecundario}
                >
                  Assinar
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
