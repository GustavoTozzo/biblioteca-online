import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

// Único jeito de existir um ADMINISTRADOR no sistema — o formulário público
// de /cadastro sempre grava papel: "CLIENTE" (ver src/actions/usuarios.ts).
async function main() {
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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
