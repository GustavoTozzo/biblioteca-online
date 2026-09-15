"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type ItemCarrinho = {
  livroId: string;
  titulo: string;
  autor: string;
  capaUrl: string | null;
};

type CarrinhoContextType = {
  itens: ItemCarrinho[];
  adicionar: (item: ItemCarrinho) => void;
  remover: (livroId: string) => void;
  limpar: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

const CHAVE_STORAGE = "biblioteca-online:carrinho";
const VAZIO: ItemCarrinho[] = [];

// Carrinho vive só no navegador (localStorage, apenas IDs+preview) — só vira
// registro no banco no momento do checkout (ver docs/modelagem-dados.md).
// useSyncExternalStore em vez de useEffect+setState pra ler o localStorage no
// mount: é exatamente o caso de uso que o hook existe pra resolver, e evita o
// erro do eslint-plugin-react-hooks (set-state-in-effect) que um useEffect
// lendo e chamando setState causaria — mesma decisão já tomada no toggle de
// tema do portfolio-gustavo.
let itensAtual: ItemCarrinho[] = VAZIO;
let hidratado = false;
const listeners = new Set<() => void>();

function lerDoStorage(): ItemCarrinho[] {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    return bruto ? JSON.parse(bruto) : VAZIO;
  } catch {
    return VAZIO;
  }
}

function salvarNoStorage(itens: ItemCarrinho[]) {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
  } catch {
    // localStorage indisponível (modo privado etc.) — carrinho só em memória
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hidratado) {
    itensAtual = lerDoStorage();
    hidratado = true;
  }
  return itensAtual;
}

function getServerSnapshot() {
  return VAZIO;
}

function atualizarItens(atualizar: (atual: ItemCarrinho[]) => ItemCarrinho[]) {
  itensAtual = atualizar(itensAtual);
  salvarNoStorage(itensAtual);
  for (const listener of listeners) listener();
}

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const itens = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const adicionar = useCallback((item: ItemCarrinho) => {
    atualizarItens((atual) =>
      atual.some((i) => i.livroId === item.livroId) ? atual : [...atual, item],
    );
  }, []);

  const remover = useCallback((livroId: string) => {
    atualizarItens((atual) => atual.filter((i) => i.livroId !== livroId));
  }, []);

  const limpar = useCallback(() => atualizarItens(() => VAZIO), []);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, limpar }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) {
    throw new Error("useCarrinho precisa ser usado dentro de <CarrinhoProvider>");
  }
  return ctx;
}
