import type { Metadata } from "next";
import { Literata, Newsreader } from "next/font/google";
import "./globals.css";

import { CarrinhoProvider } from "@/components/carrinho-provider";
import { Header } from "@/components/header";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s — Biblioteca Online",
    default: "Biblioteca Online",
  },
  description:
    "Biblioteca digital fictícia — aluguel de livros e assinatura, projeto de portfólio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CarrinhoProvider>
          <Header />
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  );
}
