// Divide a sinopse do livro em "páginas" curtas pra simular um leitor real —
// ver docs/plano-de-design.md e docs/decisoes-fase-6.md pra decisão de não
// depender de leitura externa (Internet Archive/Open Library).
export function paginarTexto(texto: string, tamanhoAlvo = 240): string[] {
  const paragrafos = texto
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const paginas: string[] = [];
  let atual = "";

  for (const paragrafo of paragrafos) {
    const sentencas = paragrafo.split(/(?<=[.!?])\s+/);
    for (const sentenca of sentencas) {
      if (atual.length > 0 && atual.length + sentenca.length > tamanhoAlvo) {
        paginas.push(atual.trim());
        atual = "";
      }
      atual += (atual ? " " : "") + sentenca;
    }
    if (atual.length >= tamanhoAlvo * 0.6) {
      paginas.push(atual.trim());
      atual = "";
    }
  }
  if (atual.trim()) paginas.push(atual.trim());

  return paginas.length > 0 ? paginas : [texto];
}
