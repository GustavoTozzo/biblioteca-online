import type { Metadata } from "next";

import { botaoPrimario } from "@/lib/ui";

export const metadata: Metadata = { title: "Admin: exportar" };

export default function AdminExportarPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl text-vinho">Exportar</h1>
      <p className="mb-6 text-grafite">
        Baixa o acervo ou a lista de usuários em CSV (separador &quot;;&quot;,
        BOM UTF-8).
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="/api/admin/exportar/livros" className={botaoPrimario}>
          Exportar livros (CSV)
        </a>
        <a href="/api/admin/exportar/usuarios" className={botaoPrimario}>
          Exportar usuários (CSV)
        </a>
      </div>
    </div>
  );
}
