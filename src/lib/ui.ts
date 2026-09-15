// Classes compartilhadas pra manter botões/campos/cards visualmente
// consistentes em todo o app — sem isso, cada página tinha seu próprio
// className ad hoc (raio de borda, sombra e espaçamento levemente diferentes
// em cada lugar), o que é exatamente o que deixava o site com cara de
// remendo. Não é um componente polimórfico de propósito: várias dessas
// classes precisam funcionar tanto em <button> (Server Actions) quanto em
// <Link> (navegação), então strings de classe são mais simples que um
// componente <Button as="a"|"button">.

export const botaoPrimario =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-vinho px-5 py-2.5 text-sm font-medium text-papel shadow-sm transition-all duration-150 hover:brightness-110 hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const botaoSecundario =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-grafite/25 bg-white px-5 py-2.5 text-sm font-medium text-tinta shadow-sm transition-all duration-150 hover:border-vinho hover:text-vinho hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const botaoAcento =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-verde px-5 py-2.5 text-sm font-medium text-papel shadow-sm transition-all duration-150 hover:brightness-110 hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const linkPerigo =
  "text-sm text-selo underline decoration-selo/40 underline-offset-2 transition-colors hover:decoration-selo";

export const linkDiscreto =
  "text-sm text-vinho underline decoration-vinho/30 underline-offset-2 transition-colors hover:decoration-vinho";

export const campoInput =
  "w-full rounded-xl border border-grafite/25 bg-white px-4 py-2.5 text-sm text-tinta shadow-sm transition-colors placeholder:text-grafite/45 focus:border-vinho focus:outline-none focus:ring-2 focus:ring-vinho/15";

export const campoDesabilitado =
  "w-full rounded-xl border border-grafite/15 bg-grafite/5 px-4 py-2.5 text-sm text-grafite";

export const rotulo = "flex flex-col gap-1.5 text-sm font-medium text-tinta";

export const cartao =
  "rounded-2xl border border-grafite/12 bg-white/70 p-6 shadow-sm transition-all duration-150 hover:shadow-md";

export const cartaoLivro =
  "group flex flex-col gap-3 rounded-2xl p-2 transition-all duration-150 hover:-translate-y-0.5";

export const capaLivro =
  "aspect-2/3 overflow-hidden rounded-xl bg-grafite/8 shadow-sm ring-1 ring-black/5 transition-shadow duration-150 group-hover:shadow-md";

export const faixaAviso =
  "rounded-xl border border-dourado/40 bg-dourado/10 px-4 py-3 text-sm text-tinta";

export const faixaSucesso =
  "rounded-xl border border-verde/30 bg-verde/8 px-4 py-3 text-verde";

export const faixaErro = "text-sm text-selo";
