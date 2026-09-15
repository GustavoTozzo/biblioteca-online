"use client";

import Link from "next/link";
import { useActionState } from "react";

import { cadastrarUsuario } from "@/actions/usuarios";
import { botaoPrimario, campoInput, cartao, faixaErro, linkDiscreto, rotulo } from "@/lib/ui";

export function CadastroForm() {
  const [erro, formAction, pending] = useActionState(
    cadastrarUsuario,
    undefined,
  );

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="font-heading text-3xl text-vinho">Criar conta</h1>
      <form
        action={formAction}
        className={`${cartao} grid grid-cols-1 gap-4 sm:grid-cols-2`}
      >
        <label className={`${rotulo} sm:col-span-2`}>
          Nome completo
          <input name="nomeCompleto" required className={campoInput} />
        </label>
        <label className={rotulo}>
          E-mail
          <input name="email" type="email" required className={campoInput} />
        </label>
        <label className={rotulo}>
          Senha
          <input
            name="senha"
            type="password"
            required
            minLength={8}
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          CPF
          <input
            name="cpf"
            required
            placeholder="000.000.000-00"
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          Data de nascimento
          <input
            name="dataNascimento"
            type="date"
            required
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          Telefone
          <input name="telefone" required className={campoInput} />
        </label>
        <label className={rotulo}>
          CEP
          <input name="cep" required className={campoInput} />
        </label>
        <label className={`${rotulo} sm:col-span-2`}>
          Logradouro
          <input name="logradouro" required className={campoInput} />
        </label>
        <label className={rotulo}>
          Número
          <input name="numero" required className={campoInput} />
        </label>
        <label className={rotulo}>
          Complemento
          <input name="complemento" className={campoInput} />
        </label>
        <label className={rotulo}>
          Bairro
          <input name="bairro" required className={campoInput} />
        </label>
        <label className={rotulo}>
          Cidade
          <input name="cidade" required className={campoInput} />
        </label>
        <label className={rotulo}>
          UF
          <input name="estado" required maxLength={2} className={campoInput} />
        </label>

        {erro && <p className={`${faixaErro} sm:col-span-2`}>{erro}</p>}

        <button
          type="submit"
          disabled={pending}
          className={`${botaoPrimario} sm:col-span-2`}
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
      <p className="text-sm text-grafite">
        Já tem conta?{" "}
        <Link href="/login" className={linkDiscreto}>
          Entrar
        </Link>
      </p>
    </main>
  );
}
