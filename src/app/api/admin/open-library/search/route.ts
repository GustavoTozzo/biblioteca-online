import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { buscarLivrosOpenLibrary } from "@/lib/open-library";

export async function GET(request: Request) {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ resultados: [] });
  }

  try {
    const resultados = await buscarLivrosOpenLibrary(q);
    return NextResponse.json({ resultados });
  } catch {
    return NextResponse.json(
      { error: "Falha ao buscar na Open Library" },
      { status: 502 },
    );
  }
}
