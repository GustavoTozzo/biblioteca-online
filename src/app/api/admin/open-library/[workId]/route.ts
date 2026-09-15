import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { buscarDescricaoOpenLibrary } from "@/lib/open-library";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workId: string }> },
) {
  const session = await auth();
  if (session?.user?.papel !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { workId } = await params;
  const descricao = await buscarDescricaoOpenLibrary(workId);
  return NextResponse.json({ descricao });
}
