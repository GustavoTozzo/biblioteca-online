"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { autenticar } from "@/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [erro, formAction, pending] = useActionState(autenticar, undefined);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="font-heading text-3xl text-vinho">Entrar</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <label className="flex flex-col gap-1 text-sm text-tinta">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="rounded border border-grafite/40 bg-white px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-tinta">
          Senha
          <input
            name="senha"
            type="password"
            required
            className="rounded border border-grafite/40 bg-white px-3 py-2"
          />
        </label>
        {erro && <p className="text-sm text-selo">{erro}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="text-sm text-grafite">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-vinho underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
