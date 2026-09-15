import type { NextConfig } from "next";

// CSP com 'unsafe-inline' em script-src — mesma decisão (e mesmo motivo)
// documentada em farmacia-do-povo/docs/decisoes-fase-2.md: CSP com nonce exige
// renderização dinâmica em toda página que o usa, e o próprio bootstrap do App
// Router (scripts inline de streaming de RSC) quebra em produção com CSP
// 'self' estrito sem 'unsafe-inline'. Replicando aqui sem re-derivar.
//
// style-src também precisa de 'unsafe-inline': achado num build de produção
// real (Fase 8, polish pós-deploy) — o próprio next/image injeta
// `style="color:transparent"` em todo `<img>` (truque interno do framework
// pra evitar o flash do texto alt antes da imagem carregar), o que o CSP
// bloqueava silenciosamente em toda capa de livro da página. Sem alternativa
// suportada pra desligar esse comportamento do next/image mantendo a
// otimização de imagem, então liberamos 'unsafe-inline' aqui também — o
// risco de um `style` inline malicioso é bem menor que o de `script` (não
// executa JS), e este app não renderiza HTML gerado por usuário em lugar
// nenhum que tornaria isso explorável.
const isDev = process.env.NODE_ENV === "development";

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // covers.openlibrary.org: capas de livro buscadas pelo admin na Open Library (Fase 3)
  "img-src 'self' blob: data: https://covers.openlibrary.org",
  "font-src 'self'",
  // openlibrary.org: busca de livros feita por Route Handlers no servidor, não
  // pelo browser — mas listado aqui por transparência com o que o app acessa.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
