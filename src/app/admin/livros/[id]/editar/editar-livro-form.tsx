"use client";

import { useActionState } from "react";

import { atualizarLivro } from "@/actions/livros";
import { botaoPrimario, campoInput, faixaErro, rotulo } from "@/lib/ui";

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

      <label className={rotulo}>
        Título
        <input
          name="titulo"
          required
          defaultValue={livro.titulo}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Autor
        <input
          name="autor"
          required
          defaultValue={livro.autor}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Descrição
        <textarea
          name="descricao"
          required
          rows={4}
          defaultValue={livro.descricao}
          className={campoInput}
        />
      </label>
      <label className={rotulo}>
        Categoria
        <input
          name="categoria"
          required
          defaultValue={livro.categoria}
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
