"use client";

import Image from "next/image";
import { useState } from "react";
import { useActionState } from "react";

import { criarLivro } from "@/actions/livros";

type ResultadoBusca = {
  openLibraryId: string;
  titulo: string;
  autor: string;
  ano: number | null;
  categoriaSugerida: string | null;
  capaUrl: string | null;
};

const campoClasse = "rounded border border-grafite/40 bg-white px-3 py-2";
const labelClasse = "flex flex-col gap-1 text-sm text-tinta";

export function NovoLivroForm() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [capaUrl, setCapaUrl] = useState("");
  const [openLibraryId, setOpenLibraryId] = useState("");

  const [erroSalvar, formAction, salvando] = useActionState(
    criarLivro,
    undefined,
  );

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setBuscando(true);
    setErroBusca(null);
    try {
      const res = await fetch(
        `/api/admin/open-library/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha na busca");
      setResultados(data.resultados);
    } catch {
      setErroBusca("Não foi possível buscar na Open Library agora.");
    } finally {
      setBuscando(false);
    }
  }

  async function usar(resultado: ResultadoBusca) {
    setTitulo(resultado.titulo);
    setAutor(resultado.autor);
    setCategoria(resultado.categoriaSugerida ?? "");
    setCapaUrl(resultado.capaUrl ?? "");
    setOpenLibraryId(resultado.openLibraryId);
    setDescricao("Carregando descrição...");

    const res = await fetch(
      `/api/admin/open-library/${resultado.openLibraryId}`,
    );
    const data = await res.json();
    setDescricao(data.descricao ?? "");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 font-heading text-2xl text-vinho">Novo livro</h1>

      <form onSubmit={buscar} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar na Open Library (título, autor...)"
          className={`${campoClasse} flex-1`}
        />
        <button
          type="submit"
          disabled={buscando}
          className="rounded bg-verde px-4 py-2 text-papel disabled:opacity-60"
        >
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erroBusca && <p className="mb-4 text-sm text-selo">{erroBusca}</p>}

      {resultados.length > 0 && (
        <ul className="mb-8 flex max-h-72 flex-col gap-2 overflow-y-auto rounded border border-grafite/20 p-2">
          {resultados.map((r) => (
            <li
              key={r.openLibraryId}
              className="flex items-center gap-3 border-b border-grafite/10 pb-2 last:border-0"
            >
              {r.capaUrl ? (
                <Image
                  src={r.capaUrl}
                  alt={`Capa de ${r.titulo}`}
                  width={32}
                  height={48}
                  className="h-12 w-8 object-cover"
                />
              ) : (
                <div className="h-12 w-8 bg-grafite/10" />
              )}
              <span className="flex-1 text-sm">
                {r.titulo} — {r.autor}
                {r.ano ? ` (${r.ano})` : ""}
              </span>
              <button
                type="button"
                onClick={() => usar(r)}
                className="text-sm text-vinho underline"
              >
                Usar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="capaUrl" value={capaUrl} />
        <input type="hidden" name="openLibraryId" value={openLibraryId} />

        <label className={labelClasse}>
          Título
          <input
            name="titulo"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          Autor
          <input
            name="autor"
            required
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          Descrição
          <textarea
            name="descricao"
            required
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className={labelClasse}>
          Categoria
          <input
            name="categoria"
            required
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={campoClasse}
          />
        </label>

        {erroSalvar && <p className="text-sm text-selo">{erroSalvar}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar no acervo"}
        </button>
      </form>
    </div>
  );
}
