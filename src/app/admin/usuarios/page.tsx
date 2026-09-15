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
      <h1 className="mb-4 font-heading text-2xl text-vinho">Usuários</h1>

      {usuarios.length === 0 ? (
        <p className="text-grafite">Nenhum usuário cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-grafite/20 text-grafite">
                <th className="py-2">Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Tipo</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-grafite/10">
                  <td className="py-2">{usuario.nomeCompleto}</td>
                  <td>{usuario.email}</td>
                  <td>{formatarCpf(usuario.cpf)}</td>
                  <td>{usuario.telefone}</td>
                  <td>{NOME_TIPO_USUARIO[usuario.papel]}</td>
                  <td>{usuario.criadoEm.toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
