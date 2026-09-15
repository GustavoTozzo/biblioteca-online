// Réplica do formato do protótipo Java (ExportadorCsvService): separador
// ";", campos entre aspas, BOM UTF-8. Diferente do original, aqui as aspas
// internas são escapadas (`"` -> `""`) — o Java não fazia isso, então uma
// descrição de livro com aspas geraria um CSV corrompido; corrigido aqui já
// que é barato e não muda o formato visível.
export function campoCsv(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

export function gerarCsv(cabecalho: string, linhas: string[]): string {
  return "﻿" + [cabecalho, ...linhas].join("\r\n");
}
