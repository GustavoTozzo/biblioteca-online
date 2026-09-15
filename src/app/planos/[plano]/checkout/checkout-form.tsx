"use client";

import { startTransition, useActionState, useState } from "react";

import type { FormaPagamento } from "@prisma/client";

import { criarAssinatura } from "@/actions/assinatura";
import type { PlanoInfo } from "@/lib/planos";
import { botaoPrimario, campoInput, cartao, faixaAviso, faixaErro } from "@/lib/ui";

type FormaPagamentoAssinatura = Extract<FormaPagamento, "PIX" | "CARTAO">;

export function CheckoutAssinaturaForm({ plano }: { plano: PlanoInfo }) {
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamentoAssinatura>("PIX");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvv, setCvv] = useState("");

  const [erro, formAction, pending] = useActionState(criarAssinatura, undefined);

  function confirmar() {
    const cartaoFinal4 =
      formaPagamento === "CARTAO"
        ? numeroCartao.replace(/\D/g, "").slice(-4)
        : undefined;

    startTransition(() => {
      formAction({ planoSlug: plano.slug, formaPagamento, cartaoFinal4 });
    });
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className={`${cartao} mx-auto max-w-xl`}>
        <h1 className="mb-4 font-heading text-3xl text-vinho">
          Assinar plano {plano.nome}
        </h1>
        <p className="mb-6 text-lg font-medium text-vinho">
          R$ {plano.preco.toFixed(2).replace(".", ",")}
        </p>

        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium text-tinta">
            Forma de pagamento
          </legend>
          <label className="flex items-center gap-2 text-sm text-tinta">
            <input
              type="radio"
              name="formaPagamento"
              checked={formaPagamento === "PIX"}
              onChange={() => setFormaPagamento("PIX")}
              className="accent-vinho"
            />
            Pix
          </label>
          <label className="flex items-center gap-2 text-sm text-tinta">
            <input
              type="radio"
              name="formaPagamento"
              checked={formaPagamento === "CARTAO"}
              onChange={() => setFormaPagamento("CARTAO")}
              className="accent-vinho"
            />
            Cartão de crédito (renovação automática)
          </label>
        </fieldset>

        {formaPagamento === "CARTAO" && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-grafite/15 bg-grafite/4 p-4">
            <p className={faixaAviso}>
              Pagamento simulado — projeto de portfólio, não insira dados
              financeiros reais.
            </p>
            <input
              placeholder="Número do cartão"
              value={numeroCartao}
              onChange={(e) => setNumeroCartao(e.target.value)}
              className={campoInput}
            />
            <input
              placeholder="Nome impresso no cartão"
              value={nomeCartao}
              onChange={(e) => setNomeCartao(e.target.value)}
              className={campoInput}
            />
            <div className="flex gap-2">
              <input
                placeholder="MM/AA"
                value={validadeCartao}
                onChange={(e) => setValidadeCartao(e.target.value)}
                className={`${campoInput} w-24`}
              />
              <input
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className={`${campoInput} w-20`}
              />
            </div>
          </div>
        )}

        {formaPagamento === "PIX" && (
          <p className={`${faixaAviso} mb-4`}>
            Pagamento simulado — projeto de portfólio, nenhuma cobrança real é
            feita.
          </p>
        )}

        {erro && <p className={`${faixaErro} mb-4`}>{erro}</p>}

        <button
          type="button"
          onClick={confirmar}
          disabled={pending}
          className={botaoPrimario}
        >
          {pending ? "Confirmando..." : "Confirmar assinatura"}
        </button>
      </div>
    </main>
  );
}
