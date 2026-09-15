import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

import { EditarUsuarioForm } from "./editar-usuario-form";

const buscarUsuario = cache((id: string) =>
  prisma.usuario.findUnique({ where: { id } }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const usuario = await buscarUsuario(id);
  return usuario ? { title: `Admin: editar ${usuario.nomeCompleto}` } : {};
}

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await buscarUsuario(id);
  if (!usuario) notFound();

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">Editar usuário</h1>
      <EditarUsuarioForm usuario={usuario} />
    </div>
  );
}
