// Integração com a Open Library API (gratuita, sem chave). Usada só pelo
// admin, para curar o acervo local — ver docs/modelagem-dados.md. O catálogo
// público nunca chama isso; só lê a tabela Livro.

export type ResultadoBuscaLivro = {
  openLibraryId: string;
  titulo: string;
  autor: string;
  ano: number | null;
  categoriaSugerida: string | null;
  capaUrl: string | null;
};

type OpenLibrarySearchDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
};

type OpenLibrarySearchResponse = {
  docs: OpenLibrarySearchDoc[];
};

// "-L" (large, ~500px) em vez de "-M" (~180px) — a capa "-M" ficava borrada/
// esticada quando exibida nos tamanhos usados pelo catálogo e pela página de
// detalhe (até 300px de largura), mesmo com object-cover aplicado.
export function capaUrlPorCoverId(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

export async function buscarLivrosOpenLibrary(
  query: string,
): Promise<ResultadoBuscaLivro[]> {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "20");
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i,subject",
  );

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Open Library respondeu ${res.status}`);
  }

  const data = (await res.json()) as OpenLibrarySearchResponse;

  return data.docs
    .filter((doc) => doc.title)
    .map((doc) => ({
      openLibraryId: doc.key.replace("/works/", ""),
      titulo: doc.title!,
      autor: doc.author_name?.join(", ") ?? "Autor desconhecido",
      ano: doc.first_publish_year ?? null,
      categoriaSugerida: doc.subject?.[0] ?? null,
      capaUrl: doc.cover_i ? capaUrlPorCoverId(doc.cover_i) : null,
    }));
}

type OpenLibraryWorkResponse = {
  description?: string | { type: string; value: string };
};

// A descrição vem ora como string, ora como { type, value } — confirmado
// testando a API ao vivo (ver docs/decisoes-fase-2.md).
export async function buscarDescricaoOpenLibrary(
  openLibraryId: string,
): Promise<string | null> {
  const res = await fetch(
    `https://openlibrary.org/works/${openLibraryId}.json`,
    { next: { revalidate: 0 } },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as OpenLibraryWorkResponse;
  if (!data.description) return null;

  return typeof data.description === "string"
    ? data.description
    : data.description.value;
}
