"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { autenticar } from "@/actions/auth";
import { botaoPrimario, campoInput, cartao, faixaErro, linkDiscreto, rotulo } from "@/lib/ui";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [erro, formAction, pending] = useActionState(autenticar, undefined);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="font-heading text-3xl text-vinho">Entrar</h1>
      <form action={formAction} className={`${cartao} flex flex-col gap-4`}>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <label className={rotulo}>
          E-mail
          <input name="email" type="email" required className={campoInput} />
        </label>
        <label className={rotulo}>
          Senha
          <input name="senha" type="password" required className={campoInput} />
        </label>
        {erro && <p className={faixaErro}>{erro}</p>}
        <button type="submit" disabled={pending} className={botaoPrimario}>
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="text-sm text-grafite">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className={linkDiscreto}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
