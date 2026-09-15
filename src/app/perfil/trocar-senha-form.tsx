"use client";

import { useActionState } from "react";

import { trocarSenha, type EstadoPerfil } from "@/actions/perfil";
import { botaoSecundario, campoInput, cartao, faixaErro, faixaSucesso, rotulo } from "@/lib/ui";

const ESTADO_INICIAL: EstadoPerfil = {};

export function TrocarSenhaForm() {
  const [estado, formAction, pending] = useActionState(
    trocarSenha,
    ESTADO_INICIAL,
  );

  return (
    <form action={formAction} className={`${cartao} flex flex-col gap-4`}>
      <h2 className="font-heading text-xl text-vinho">Trocar senha</h2>
      <label className={rotulo}>
        Senha atual
        <input
          name="senhaAtual"
          type="password"
          required
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Nova senha
        <input
          name="novaSenha"
          type="password"
          required
          minLength={8}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Confirmar nova senha
        <input
          name="confirmarSenha"
          type="password"
          required
          minLength={8}
          className={campoInput}
        />
      </label>

      {estado.erro && <p className={faixaErro}>{estado.erro}</p>}
      {estado.sucesso && (
        <p className={faixaSucesso}>Senha alterada com sucesso.</p>
      )}

      <button type="submit" disabled={pending} className={botaoSecundario}>
        {pending ? "Salvando..." : "Trocar senha"}
      </button>
    </form>
  );
}
