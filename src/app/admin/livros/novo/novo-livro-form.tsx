"use client";

import Image from "next/image";
import { useState } from "react";
import { useActionState } from "react";

import { criarLivro } from "@/actions/livros";
import { botaoAcento, botaoPrimario, campoInput, faixaErro, linkDiscreto, rotulo } from "@/lib/ui";

type ResultadoBusca = {
  openLibraryId: string;
  titulo: string;
  autor: string;
  ano: number | null;
  categoriaSugerida: string | null;
  capaUrl: string | null;
};

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
      <h1 className="mb-6 font-heading text-3xl text-vinho">Novo livro</h1>

      <form onSubmit={buscar} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar na Open Library (título, autor...)"
          className={`${campoInput} flex-1`}
        />
        <button type="submit" disabled={buscando} className={botaoAcento}>
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erroBusca && <p className={`${faixaErro} mb-4`}>{erroBusca}</p>}

      {resultados.length > 0 && (
        <ul className="mb-8 flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-grafite/12 bg-white/60 p-2 shadow-sm">
          {resultados.map((r) => (
            <li
              key={r.openLibraryId}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-vinho/5"
            >
              {r.capaUrl ? (
                <Image
                  src={r.capaUrl}
                  alt={`Capa de ${r.titulo}`}
                  width={32}
                  height={48}
                  className="h-12 w-8 rounded object-cover shadow-sm"
                />
              ) : (
                <div className="h-12 w-8 rounded bg-grafite/10" />
              )}
              <span className="flex-1 text-sm">
                {r.titulo} — {r.autor}
                {r.ano ? ` (${r.ano})` : ""}
              </span>
              <button
                type="button"
                onClick={() => usar(r)}
                className={linkDiscreto}
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

        <label className={rotulo}>
          Título
          <input
            name="titulo"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          Autor
          <input
            name="autor"
            required
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          Descrição
          <textarea
            name="descricao"
            required
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={campoInput}
          />
        </label>
        <label className={rotulo}>
          Categoria
          <input
            name="categoria"
            required
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={campoInput}
          />
        </label>

        {erroSalvar && <p className={faixaErro}>{erroSalvar}</p>}

        <button type="submit" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando..." : "Salvar no acervo"}
        </button>
      </form>
    </div>
  );
}
