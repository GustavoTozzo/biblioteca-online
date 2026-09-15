// Validação de CPF: formato + dígitos verificadores (algoritmo público padrão).
// O protótipo Java só checava duplicidade — aqui também validamos o CPF em si,
// já que é barato e evita lixo óbvio no banco (requisito 13 do briefing).
export function limparCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function cpfValido(cpfBruto: string): boolean {
  const cpf = limparCpf(cpfBruto);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos os dígitos iguais

  const calcularDigito = (base: string, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.slice(0, 9), 10);
  const digito2 = calcularDigito(cpf.slice(0, 10), 11);

  return digito1 === Number(cpf[9]) && digito2 === Number(cpf[10]);
}

export function formatarCpf(cpfBruto: string): string {
  const cpf = limparCpf(cpfBruto);
  if (cpf.length !== 11) return cpfBruto;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}
