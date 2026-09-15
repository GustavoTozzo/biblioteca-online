import Link from "next/link";

import { sair } from "@/actions/auth";
import { auth } from "@/auth";
import { CartBadge } from "@/components/cart-badge";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-grafite/20 px-6 py-4">
      <Link href="/" className="font-heading text-xl text-vinho italic">
        Biblioteca Online
      </Link>
      <nav className="flex items-center gap-4 text-sm text-tinta">
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
            <span className="text-grafite">{session.user.name}</span>
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
