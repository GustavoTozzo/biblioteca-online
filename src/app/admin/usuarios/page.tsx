import type { Metadata } from "next";

import { formatarCpf } from "@/lib/cpf";
import { prisma } from "@/lib/prisma";

const NOME_TIPO_USUARIO = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador",
} as const;

export const metadata: Metadata = { title: "Admin: usuários" };

export default async function AdminUsuariosPage() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">Usuários</h1>

      {usuarios.length === 0 ? (
        <p className="text-grafite">Nenhum usuário cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-grafite/12 bg-white/60 shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-grafite/12 text-grafite">
                <th className="px-5 py-3">Nome</th>
                <th className="px-3 py-3">E-mail</th>
                <th className="px-3 py-3">CPF</th>
                <th className="px-3 py-3">Telefone</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b border-grafite/8 last:border-0"
                >
                  <td className="px-5 py-3">{usuario.nomeCompleto}</td>
                  <td className="px-3 py-3">{usuario.email}</td>
                  <td className="px-3 py-3">{formatarCpf(usuario.cpf)}</td>
                  <td className="px-3 py-3">{usuario.telefone}</td>
                  <td className="px-3 py-3">
                    {NOME_TIPO_USUARIO[usuario.papel]}
                  </td>
                  <td className="px-3 py-3">
                    {usuario.criadoEm.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
