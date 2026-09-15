-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CLIENTE', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('PIX', 'BOLETO', 'CARTAO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('CONFIRMADO', 'FALHOU');

-- CreateEnum
CREATE TYPE "StatusAluguel" AS ENUM ('ATIVO', 'EXPIRADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PlanoAssinatura" AS ENUM ('MENSAL', 'SEMESTRAL', 'ANUAL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "papel" "TipoUsuario" NOT NULL DEFAULT 'CLIENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livros" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "capaUrl" TEXT,
    "openLibraryId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alugueis" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "dias" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusAluguel" NOT NULL DEFAULT 'ATIVO',
    "transacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alugueis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_aluguel" (
    "id" TEXT NOT NULL,
    "aluguelId" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    "valorUnitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "itens_aluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "plano" "PlanoAssinatura" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusAssinatura" NOT NULL DEFAULT 'ATIVA',
    "renovacaoAutomatica" BOOLEAN NOT NULL DEFAULT false,
    "transacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'CONFIRMADO',
    "codigoFake" TEXT NOT NULL,
    "cartaoFinal4" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_leitura" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    "percentual" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progresso_leitura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "livros_openLibraryId_key" ON "livros"("openLibraryId");

-- CreateIndex
CREATE INDEX "livros_categoria_idx" ON "livros"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "alugueis_transacaoId_key" ON "alugueis"("transacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "itens_aluguel_aluguelId_livroId_key" ON "itens_aluguel"("aluguelId", "livroId");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_transacaoId_key" ON "assinaturas"("transacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "progresso_leitura_usuarioId_livroId_key" ON "progresso_leitura"("usuarioId", "livroId");

-- AddForeignKey
ALTER TABLE "alugueis" ADD CONSTRAINT "alugueis_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alugueis" ADD CONSTRAINT "alugueis_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "transacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_aluguel" ADD CONSTRAINT "itens_aluguel_aluguelId_fkey" FOREIGN KEY ("aluguelId") REFERENCES "alugueis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_aluguel" ADD CONSTRAINT "itens_aluguel_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "transacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_leitura" ADD CONSTRAINT "progresso_leitura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_leitura" ADD CONSTRAINT "progresso_leitura_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "livros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
