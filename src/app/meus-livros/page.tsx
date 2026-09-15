import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { buscarAssinaturaAtiva, buscarMeusLivros } from "@/lib/meus-livros";
import { nomePlano } from "@/lib/planos";
import { capaLivro, faixaSucesso, linkDiscreto } from "@/lib/ui";

export const metadata: Metadata = { title: "Meus livros" };

export default async function MeusLivrosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/meus-livros");

  const [livros, assinaturaAtiva] = await Promise.all([
    buscarMeusLivros(session.user.id),
    buscarAssinaturaAtiva(session.user.id),
  ]);

  return (
    <main className="flex-1 px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 font-heading text-4xl text-vinho">Meus livros</h1>

        {assinaturaAtiva && (
          <p className={`${faixaSucesso} mb-8`}>
            Assinatura {nomePlano(assinaturaAtiva.plano)} ativa até{" "}
            {assinaturaAtiva.dataFim.toLocaleDateString("pt-BR")} — acesso
            total ao acervo.
          </p>
        )}

        {livros.length === 0 ? (
          <p className="text-grafite">
            Você ainda não tem livros alugados nem uma assinatura ativa.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
            {livros.map((livro) => (
              <div key={livro.livroId} className="flex flex-col gap-3">
                <div className={capaLivro}>
                  {livro.capaUrl && (
                    <Image
                      src={livro.capaUrl}
                      alt={`Capa de ${livro.titulo}`}
                      width={200}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-heading text-tinta">{livro.titulo}</p>
                  <p className="text-sm text-grafite">
                    {livro.origem === "ASSINATURA"
                      ? "Via assinatura"
                      : `Disponível até ${livro.disponivelAte?.toLocaleDateString("pt-BR")}`}
                  </p>
                  <Link
                    href={`/meus-livros/${livro.livroId}/ler`}
                    className={linkDiscreto}
                  >
                    Ler
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
