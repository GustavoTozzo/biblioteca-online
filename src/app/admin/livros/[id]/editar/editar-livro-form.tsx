"use client";

import { useActionState } from "react";

import { atualizarLivro } from "@/actions/livros";

const campoClasse = "rounded border border-grafite/40 bg-white px-3 py-2";
const labelClasse = "flex flex-col gap-1 text-sm text-tinta";

type Livro = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  categoria: string;
  capaUrl: string | null;
};

export function EditarLivroForm({ livro }: { livro: Livro }) {
  const acaoComId = atualizarLivro.bind(null, livro.id);
  const [erro, formAction, salvando] = useActionState(acaoComId, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="capaUrl" value={livro.capaUrl ?? ""} />

      <label className={labelClasse}>
        Título
        <input
          name="titulo"
          required
          defaultValue={livro.titulo}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Autor
        <input
          name="autor"
          required
          defaultValue={livro.autor}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Descrição
        <textarea
          name="descricao"
          required
          rows={4}
          defaultValue={livro.descricao}
          className={campoClasse}
        />
      </label>
      <label className={labelClasse}>
        Categoria
        <input
          name="categoria"
          required
          defaultValue={livro.categoria}
          className={campoClasse}
        />
      </label>

      {erro && <p className="text-sm text-selo">{erro}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
