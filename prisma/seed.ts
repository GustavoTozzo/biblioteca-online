import "dotenv/config";

import bcrypt from "bcryptjs";

import {
  buscarDescricaoOpenLibrary,
  buscarLivrosOpenLibrary,
} from "../src/lib/open-library";
import { prisma } from "../src/lib/prisma";

// Único jeito de existir um ADMINISTRADOR no sistema — o formulário público
// de /cadastro sempre grava papel: "CLIENTE" (ver src/actions/usuarios.ts).
async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const senha = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !senha) {
    console.error(
      "Defina ADMIN_SEED_EMAIL e ADMIN_SEED_PASSWORD no .env antes de rodar o seed.",
    );
    process.exit(1);
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    console.log(`Usuário administrador ${email} já existe.`);
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  await prisma.usuario.create({
    data: {
      nomeCompleto: "Administrador",
      email,
      senhaHash,
      cpf: "00000000000",
      dataNascimento: new Date("1990-01-01"),
      telefone: "00000000000",
      cep: "00000000",
      logradouro: "N/A",
      numero: "0",
      bairro: "N/A",
      cidade: "N/A",
      estado: "SP",
      papel: "ADMINISTRADOR",
    },
  });

  console.log(`Usuário administrador ${email} criado.`);
}

// Clássicos de domínio público, reais, buscados na Open Library — mesmo
// mecanismo que o admin usa manualmente em /admin/livros/novo (ver
// docs/decisoes-fase-3.md). Idempotente: pula título já existente no acervo.
const TITULOS_SEED = [
  "Dom Casmurro",
  "O Cortiço",
  "Memórias Póstumas de Brás Cubas",
  "O Guarani",
  "Iracema",
  "Senhora",
  "Quincas Borba",
  "A Moreninha",
  "Vidas Secas",
  "Triste Fim de Policarpo Quaresma",
  "Pride and Prejudice",
  "Frankenstein",
  "Dracula",
  "Alice's Adventures in Wonderland",
  "The Adventures of Sherlock Holmes",
  "A Christmas Carol",
  "The Picture of Dorian Gray",
  "Moby Dick",
  "War and Peace",
  "Crime and Punishment",
  "The Odyssey",
  "Don Quixote",
];

async function seedLivros() {
  for (const titulo of TITULOS_SEED) {
    const jaExiste = await prisma.livro.findFirst({
      where: { titulo: { equals: titulo, mode: "insensitive" } },
    });
    if (jaExiste) {
      console.log(`Livro "${titulo}" já está no acervo, pulando.`);
      continue;
    }

    const resultados = await buscarLivrosOpenLibrary(titulo);
    const primeiro = resultados[0];
    if (!primeiro) {
      console.warn(`Nenhum resultado na Open Library para "${titulo}".`);
      continue;
    }

    const descricao =
      (await buscarDescricaoOpenLibrary(primeiro.openLibraryId)) ??
      "Sem descrição disponível.";

    await prisma.livro.create({
      data: {
        titulo: primeiro.titulo,
        autor: primeiro.autor,
        descricao,
        categoria: primeiro.categoriaSugerida ?? "Clássico",
        capaUrl: primeiro.capaUrl,
        openLibraryId: primeiro.openLibraryId,
      },
    });
    console.log(`Livro criado: ${primeiro.titulo}`);
  }
}

async function main() {
  await seedAdmin();
  await seedLivros();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
