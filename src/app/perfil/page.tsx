import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { PerfilForm } from "./perfil-form";

export const metadata: Metadata = { title: "Meus dados" };

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/perfil");

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
  });
  if (!usuario) redirect("/login");

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-heading text-3xl text-vinho">Meus dados</h1>
        <PerfilForm usuario={usuario} />
      </div>
    </main>
  );
}
