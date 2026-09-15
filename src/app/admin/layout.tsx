import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

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
      <aside className="flex w-48 flex-col gap-2 border-r border-grafite/20 p-4 text-sm">
        <Link href="/admin" className="hover:text-vinho">
          Dashboard
        </Link>
        <Link href="/admin/livros" className="hover:text-vinho">
          Livros
        </Link>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
