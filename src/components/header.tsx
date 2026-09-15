import Link from "next/link";

import { sair } from "@/actions/auth";
import { auth } from "@/auth";
import { CartBadge } from "@/components/cart-badge";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex flex-col gap-3 border-b border-grafite/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
      <Link href="/" className="font-heading text-xl text-vinho italic">
        Biblioteca Online
      </Link>
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-tinta">
        <Link href="/planos" className="hover:text-vinho">
          Planos
        </Link>
        <CartBadge />
        {session?.user ? (
          <>
            {session.user.papel === "ADMINISTRADOR" && (
              <Link href="/admin" className="hover:text-vinho">
                Painel admin
              </Link>
            )}
            <Link href="/meus-livros" className="hover:text-vinho">
              Meus livros
            </Link>
            <Link href="/perfil" className="text-grafite hover:text-vinho">
              {session.user.name}
            </Link>
            <form action={sair}>
              <button type="submit" className="hover:text-vinho">
                Sair
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-vinho">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded bg-vinho px-3 py-1.5 text-papel"
            >
              Cadastrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
