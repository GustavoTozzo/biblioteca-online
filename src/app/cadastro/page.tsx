"use client";

import Link from "next/link";
import { useActionState } from "react";

import { cadastrarUsuario } from "@/actions/usuarios";

const campoClasse = "rounded border border-grafite/40 bg-white px-3 py-2";
const labelClasse = "flex flex-col gap-1 text-sm text-tinta";

export default function CadastroPage() {
  const [erro, formAction, pending] = useActionState(
    cadastrarUsuario,
    undefined,
  );

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="font-heading text-3xl text-vinho">Criar conta</h1>
      <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={`${labelClasse} sm:col-span-2`}>
          Nome completo
          <input name="nomeCompleto" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          E-mail
          <input name="email" type="email" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          Senha
          <input
            name="senha"
            type="password"
            required
            minLength={8}
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          CPF
          <input
            name="cpf"
            required
            placeholder="000.000.000-00"
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          Data de nascimento
          <input
            name="dataNascimento"
            type="date"
            required
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          Telefone
          <input name="telefone" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          CEP
          <input name="cep" required className={campoClasse} />
        </label>
        <label className={`${labelClasse} sm:col-span-2`}>
          Logradouro
          <input name="logradouro" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          Número
          <input name="numero" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          Complemento
          <input name="complemento" className={campoClasse} />
        </label>
        <label className={labelClasse}>
          Bairro
          <input name="bairro" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          Cidade
          <input name="cidade" required className={campoClasse} />
        </label>
        <label className={labelClasse}>
          UF
          <input name="estado" required maxLength={2} className={campoClasse} />
        </label>

        {erro && (
          <p className="text-sm text-selo sm:col-span-2">{erro}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60 sm:col-span-2"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
      <p className="text-sm text-grafite">
        Já tem conta?{" "}
        <Link href="/login" className="text-vinho underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
