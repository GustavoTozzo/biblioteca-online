import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

const linkSidebar =
  "rounded-lg px-3 py-2 text-tinta/80 transition-colors hover:bg-vinho/8 hover:text-vinho";

// Defesa em profundidade: proxy.ts já bloqueia /admin/** para quem não é
// ADMINISTRADOR, mas repetimos a checagem aqui (ver docs/decisoes-fase-2.md).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex flex-1">
      <aside className="flex w-52 flex-col gap-1 border-r border-grafite/10 bg-white/40 p-4 text-sm">
        <Link href="/admin" className={linkSidebar}>
          Dashboard
        </Link>
        <Link href="/admin/livros" className={linkSidebar}>
          Livros
        </Link>
        <Link href="/admin/usuarios" className={linkSidebar}>
          Usuários
        </Link>
        <Link href="/admin/exportar" className={linkSidebar}>
          Exportar
        </Link>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
