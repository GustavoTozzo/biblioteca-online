import type { FormaPagamento } from "@prisma/client";

// Pagamento inteiramente simulado — nunca um gateway real, nunca persiste
// PAN/CVV (ver docs/modelagem-dados.md). Sempre confirma na hora, igual ao
// protótipo Java.
export function gerarCodigoFake(formaPagamento: FormaPagamento): string {
  const sufixo = () => Math.random().toString(36).slice(2, 10).toUpperCase();

  switch (formaPagamento) {
    case "PIX":
      return `PIX-SIMULADO-${sufixo()}`;
    case "BOLETO": {
      const grupo = () => Math.floor(10000 + Math.random() * 90000);
      return `${grupo()} ${grupo()} ${grupo()} ${grupo()} ${grupo()}`;
    }
    case "CARTAO":
      return `AUTORIZACAO-SIMULADA-${sufixo()}`;
  }
}
