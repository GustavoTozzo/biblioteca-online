import type { Metadata } from "next";
import Link from "next/link";

import { excluirUsuario } from "@/actions/usuarios";
import { formatarCpf } from "@/lib/cpf";
import { formatarTelefone } from "@/lib/telefone";
import { prisma } from "@/lib/prisma";
import { faixaErro, linkDiscreto, linkPerigo } from "@/lib/ui";

const NOME_TIPO_USUARIO = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador",
} as const;

export const metadata: Metadata = { title: "Admin: usuários" };

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">Usuários</h1>

      {erro && <p className={`${faixaErro} mb-4`}>{erro}</p>}

      {usuarios.length === 0 ? (
        <p className="text-grafite">Nenhum usuário cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-grafite/12 bg-white/60 shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-grafite/12 text-grafite">
                <th className="px-5 py-3">Nome</th>
                <th className="px-3 py-3">E-mail</th>
                <th className="px-3 py-3">CPF</th>
                <th className="px-3 py-3">Telefone</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Cadastrado em</th>
                <th className="px-3 py-3"></th>
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
                  <td className="px-3 py-3">
                    {formatarTelefone(usuario.telefone)}
                  </td>
                  <td className="px-3 py-3">
                    {NOME_TIPO_USUARIO[usuario.papel]}
                  </td>
                  <td className="px-3 py-3">
                    {usuario.criadoEm.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/usuarios/${usuario.id}/editar`}
                        className={linkDiscreto}
                      >
                        Editar
                      </Link>
                      <form action={excluirUsuario.bind(null, usuario.id)}>
                        <button type="submit" className={linkPerigo}>
                          Excluir
                        </button>
                      </form>
                    </div>
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
