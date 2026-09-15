"use client";

import Link from "next/link";
import { startTransition, useActionState, useMemo, useState } from "react";

import type { FormaPagamento } from "@prisma/client";

import { criarAluguel } from "@/actions/aluguel";
import { useCarrinho } from "@/components/carrinho-provider";

const PRECO_POR_LIVRO_POR_DIA = 2.5;

const campoClasse = "rounded border border-grafite/40 bg-white px-3 py-2";

const NOMES_FORMA_PAGAMENTO: Record<FormaPagamento, string> = {
  PIX: "Pix",
  BOLETO: "Boleto",
  CARTAO: "Cartão de crédito",
};

export function CheckoutContent() {
  const { itens } = useCarrinho();
  const [dias, setDias] = useState(7);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvv, setCvv] = useState("");

  const valorTotal = useMemo(
    () => itens.length * dias * PRECO_POR_LIVRO_POR_DIA,
    [itens.length, dias],
  );

  const [erro, formAction, pending] = useActionState(criarAluguel, undefined);

  function confirmar() {
    const cartaoFinal4 =
      formaPagamento === "CARTAO"
        ? numeroCartao.replace(/\D/g, "").slice(-4)
        : undefined;

    startTransition(() => {
      formAction({
        livroIds: itens.map((i) => i.livroId),
        dias,
        formaPagamento,
        cartaoFinal4,
      });
    });
  }

  if (itens.length === 0) {
    return (
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-xl">
          <p className="text-grafite">
            Seu carrinho está vazio.{" "}
            <Link href="/" className="text-vinho underline">
              Volte ao catálogo
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 font-heading text-3xl text-vinho">Checkout</h1>
        <p className="mb-4 text-grafite">
          {itens.length} livro{itens.length > 1 ? "s" : ""} no carrinho.
        </p>

        <label className="mb-4 flex flex-col gap-1 text-sm text-tinta">
          Prazo de leitura (dias)
          <input
            type="number"
            min={1}
            max={90}
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className={campoClasse}
          />
        </label>

        <p className="mb-6 text-lg text-vinho">
          Valor total: R$ {valorTotal.toFixed(2).replace(".", ",")}
        </p>

        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="mb-1 text-sm text-tinta">
            Forma de pagamento
          </legend>
          {(Object.keys(NOMES_FORMA_PAGAMENTO) as FormaPagamento[]).map(
            (forma) => (
              <label
                key={forma}
                className="flex items-center gap-2 text-sm text-tinta"
              >
                <input
                  type="radio"
                  name="formaPagamento"
                  checked={formaPagamento === forma}
                  onChange={() => setFormaPagamento(forma)}
                />
                {NOMES_FORMA_PAGAMENTO[forma]}
              </label>
            ),
          )}
        </fieldset>

        {formaPagamento === "CARTAO" && (
          <div className="mb-4 flex flex-col gap-3 rounded border border-grafite/20 p-4">
            <p className="text-xs text-selo italic">
              Pagamento simulado — projeto de portfólio, não insira dados
              financeiros reais.
            </p>
            <input
              placeholder="Número do cartão"
              value={numeroCartao}
              onChange={(e) => setNumeroCartao(e.target.value)}
              className={campoClasse}
            />
            <input
              placeholder="Nome impresso no cartão"
              value={nomeCartao}
              onChange={(e) => setNomeCartao(e.target.value)}
              className={campoClasse}
            />
            <div className="flex gap-2">
              <input
                placeholder="MM/AA"
                value={validadeCartao}
                onChange={(e) => setValidadeCartao(e.target.value)}
                className={`${campoClasse} w-24`}
              />
              <input
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className={`${campoClasse} w-20`}
              />
            </div>
          </div>
        )}

        {formaPagamento !== "CARTAO" && (
          <p className="mb-4 text-xs text-selo italic">
            Pagamento simulado — projeto de portfólio, nenhuma cobrança real é
            feita.
          </p>
        )}

        {erro && <p className="mb-4 text-sm text-selo">{erro}</p>}

        <button
          type="button"
          onClick={confirmar}
          disabled={pending}
          className="rounded bg-vinho px-4 py-2 text-papel disabled:opacity-60"
        >
          {pending ? "Confirmando..." : "Confirmar pagamento"}
        </button>
      </div>
    </main>
  );
}
