// Validação de telefone: mesmo padrão do CPF em lib/cpf.ts (limpar dígitos +
// checar formato). Aceita fixo (10 dígitos, DDD+8) ou celular (11 dígitos,
// DDD+9) — não valida DDD específico, só o tamanho, pra não travar cadastro
// por causa de uma lista de DDDs desatualizada.
export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

export function telefoneValido(telefoneBruto: string): boolean {
  const telefone = limparTelefone(telefoneBruto);
  return telefone.length === 10 || telefone.length === 11;
}

export function formatarTelefone(telefoneBruto: string): string {
  const telefone = limparTelefone(telefoneBruto);
  if (telefone.length === 11) {
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
  }
  if (telefone.length === 10) {
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`;
  }
  return telefoneBruto;
}
