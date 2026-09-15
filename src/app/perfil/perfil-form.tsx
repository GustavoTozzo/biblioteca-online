"use client";

import type { Usuario } from "@prisma/client";
import { useActionState } from "react";

import { atualizarPerfil, type EstadoPerfil } from "@/actions/perfil";
import { botaoPrimario, campoDesabilitado, campoInput, cartao, faixaErro, rotulo } from "@/lib/ui";

const ESTADO_INICIAL: EstadoPerfil = {};

export function PerfilForm({ usuario }: { usuario: Usuario }) {
  const [estado, formAction, pending] = useActionState(
    atualizarPerfil,
    ESTADO_INICIAL,
  );

  return (
    <form
      action={formAction}
      className={`${cartao} grid grid-cols-1 gap-4 sm:grid-cols-2`}
    >
      <label className={`${rotulo} sm:col-span-2`}>
        E-mail (não editável)
        <input
          value={usuario.email}
          disabled
          className={campoDesabilitado}
        />
      </label>
      <label className={rotulo}>
        CPF (não editável)
        <input value={usuario.cpf} disabled className={campoDesabilitado} />
      </label>
      <label className={rotulo}>
        Data de nascimento
        <input
          value={usuario.dataNascimento.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          disabled
          className={campoDesabilitado}
        />
      </label>

      <label className={`${rotulo} sm:col-span-2`}>
        Nome completo
        <input
          name="nomeCompleto"
          required
          defaultValue={usuario.nomeCompleto}
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
        CEP
        <input
          name="cep"
          required
          defaultValue={usuario.cep}
          className={campoInput}
        />
      </label>
      <label className={`${rotulo} sm:col-span-2`}>
        Logradouro
        <input
          name="logradouro"
          required
          defaultValue={usuario.logradouro}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Número
        <input
          name="numero"
          required
          defaultValue={usuario.numero}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Complemento
        <input
          name="complemento"
          defaultValue={usuario.complemento ?? ""}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Bairro
        <input
          name="bairro"
          required
          defaultValue={usuario.bairro}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Cidade
        <input
          name="cidade"
          required
          defaultValue={usuario.cidade}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        UF
        <input
          name="estado"
          required
          maxLength={2}
          defaultValue={usuario.estado}
          className={campoInput}
        />
      </label>

      {estado.erro && <p className={`${faixaErro} sm:col-span-2`}>{estado.erro}</p>}
      {estado.sucesso && (
        <p className="text-sm text-verde sm:col-span-2">
          Dados atualizados com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${botaoPrimario} sm:col-span-2`}
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
