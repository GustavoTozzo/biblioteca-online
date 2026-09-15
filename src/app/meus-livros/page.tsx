import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { buscarMeusLivros } from "@/lib/meus-livros";

export default async function MeusLivrosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/meus-livros");

  const livros = await buscarMeusLivros(session.user.id);

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 font-heading text-3xl text-vinho">Meus livros</h1>

        {livros.length === 0 ? (
          <p className="text-grafite">
            Você ainda não tem livros alugados nem uma assinatura ativa.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {livros.map((livro) => (
              <div key={livro.livroId} className="flex flex-col gap-2">
                <div className="aspect-2/3 overflow-hidden rounded bg-grafite/10">
                  {livro.capaUrl && (
                    <Image
                      src={livro.capaUrl}
                      alt=""
                      width={200}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="font-heading text-tinta">{livro.titulo}</span>
                <span className="text-sm text-grafite">
                  {livro.origem === "ASSINATURA"
                    ? "Via assinatura"
                    : `Disponível até ${livro.disponivelAte?.toLocaleDateString("pt-BR")}`}
                </span>
                <span className="text-xs text-grafite italic">
                  Leitor chega na próxima fase
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
