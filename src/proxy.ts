import { NextResponse } from "next/server";

import { auth } from "@/auth";

// Guard de primeira linha para rotas autenticadas/admin. Repetido dentro de
// cada Server Component/Route Handler sensível (ver docs/decisoes-fase-2.md)
// porque um matcher errado aqui não deve ser a única defesa.
const ROTAS_ADMIN = "/admin";
const ROTAS_AUTENTICADAS = [
  "/carrinho",
  "/planos/mensal/checkout",
  "/planos/semestral/checkout",
  "/planos/anual/checkout",
  "/meus-livros",
  "/perfil",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // DIAGNÓSTICO TEMPORÁRIO — investigando bug do redirect pra localhost em
  // produção. Só escreve no runtime log privado da Vercel, nada público.
  // Remover assim que o diagnóstico terminar.
  console.log("[diag-auth-url]", {
    AUTH_URL: process.env.AUTH_URL ?? null,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
    nextUrlOrigin: req.nextUrl.origin,
    pathname,
  });
  const estaLogado = !!req.auth;
  const ehAdmin = req.auth?.user?.papel === "ADMINISTRADOR";

  if (pathname.startsWith(ROTAS_ADMIN)) {
    if (!estaLogado || !ehAdmin) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (ROTAS_AUTENTICADAS.some((rota) => pathname.startsWith(rota))) {
    if (!estaLogado) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
