"use client";

import { useActionState } from "react";

import { atualizarUsuario } from "@/actions/usuarios";
import { botaoPrimario, campoDesabilitado, campoInput, faixaErro, rotulo } from "@/lib/ui";

type Usuario = {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf: string;
};

export function EditarUsuarioForm({ usuario }: { usuario: Usuario }) {
  const acaoComId = atualizarUsuario.bind(null, usuario.id);
  const [erro, formAction, salvando] = useActionState(acaoComId, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <label className={rotulo}>
        CPF (não editável)
        <input value={usuario.cpf} disabled className={campoDesabilitado} />
      </label>
      <label className={rotulo}>
        Nome completo
        <input
          name="nomeCompleto"
          required
          minLength={3}
          defaultValue={usuario.nomeCompleto}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        E-mail
        <input
          name="email"
          type="email"
          required
          defaultValue={usuario.email}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Telefone
        <input
          name="telefone"
          required
          defaultValue={usuario.telefone}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Nova senha (opcional)
        <input
          name="novaSenha"
          type="password"
          minLength={8}
          placeholder="Deixe em branco para manter a senha atual"
          className={campoInput}
        />
      </label>

      {erro && <p className={faixaErro}>{erro}</p>}

      <button type="submit" disabled={salvando} className={botaoPrimario}>
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
