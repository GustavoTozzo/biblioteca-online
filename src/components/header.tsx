import Link from "next/link";

import { sair } from "@/actions/auth";
import { auth } from "@/auth";
import { CartBadge } from "@/components/cart-badge";

const linkNav =
  "text-sm text-tinta/80 transition-colors hover:text-vinho";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-grafite/12 bg-papel/85 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8">
      <Link href="/" className="font-heading text-xl text-vinho italic">
        Biblioteca Online
      </Link>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <Link href="/planos" className={linkNav}>
          Planos
        </Link>
        <CartBadge />
        {session?.user ? (
          <>
            {session.user.papel === "ADMINISTRADOR" && (
              <Link href="/admin" className={linkNav}>
                Painel admin
              </Link>
            )}
            <Link href="/meus-livros" className={linkNav}>
              Meus livros
            </Link>
            <Link href="/perfil" className="text-sm text-grafite transition-colors hover:text-vinho">
              {session.user.name}
            </Link>
            <form action={sair}>
              <button type="submit" className={linkNav}>
                Sair
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className={linkNav}>
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-xl bg-vinho px-4 py-2 text-sm font-medium text-papel shadow-sm transition-all hover:brightness-110 hover:shadow-md"
            >
              Cadastrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
