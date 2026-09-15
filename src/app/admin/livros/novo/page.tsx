import type { Metadata } from "next";

import { NovoLivroForm } from "./novo-livro-form";

export const metadata: Metadata = { title: "Admin: novo livro" };

export default function NovoLivroPage() {
  return <NovoLivroForm />;
}
