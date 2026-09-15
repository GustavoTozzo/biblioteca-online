"use client";

import type { Usuario } from "@prisma/client";
import { useActionState } from "react";

import { atualizarPerfil, type EstadoPerfil } from "@/actions/perfil";

const campoClasse = "rounded border border-grafite/40 bg-white px-3 py-2";
const campoDesabilitadoClasse =
  "rounded border border-grafite/20 bg-grafite/10 px-3 py-2 text-grafite";
const labelClasse = "flex flex-col gap-1 text-sm text-tinta";

const ESTADO_INICIAL: EstadoPerfil = {};

export function PerfilForm({ usuario }: { usuario: Usuario }) {
  const [estado, formAction, pending] = useActionState(
    atualizarPerfil,
    ESTADO_INICIAL,
  );

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className={`${labelClasse} sm:col-span-2`}>
        E-mail (não editável)
        <input
          value={usuario.email}
          disabled
          className={campoDesabilitadoClasse}
        />
      </label>
      <label className={labelClasse}>
        CPF (não editável)
        <input value={usuario.cpf} disabled className={campoDesabilitadoClasse} />
      </label>
      <label className={labelClasse}>
        Data de nascimento
        <input
          value={usuario.dataNascimento.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          disabled
          className={campoDesabilitadoClasse}
        />
      </label>

      <label className={`${labelClasse} sm:col-span-2`}>
        Nome completo
        <input
          name="nomeCompleto"
          required
          defaultValue={usuario.nomeCompleto}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Telefone
        <input
          name="telefone"
          required
          defaultValue={usuario.telefone}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        CEP
        <input
          name="cep"
          required
          defaultValue={usuario.cep}
          className={campoClasse}
        />
      </label>
      <label className={`${labelClasse} sm:col-span-2`}>
        Logradouro
        <input
          name="logradouro"
          required
          defaultValue={usuario.logradouro}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Número
        <input
          name="numero"
          required
          defaultValue={usuario.numero}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Complemento
        <input
          name="complemento"
          defaultValue={usuario.complemento ?? ""}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Bairro
        <input
          name="bairro"
          required
          defaultValue={usuario.bairro}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Cidade
        <input
          name="cidade"
          required
          defaultValue={usuario.cidade}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        UF
        <input
          name="estado"
          required
          maxLength={2}
          defaultValue={usuario.estado}
          className={campoClasse}
        />
      </label>

      {estado.erro && (
        <p className="text-sm text-selo sm:col-span-2">{estado.erro}</p>
      )}
      {estado.sucesso && (
        <p className="text-sm text-verde sm:col-span-2">
          Dados atualizados com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
