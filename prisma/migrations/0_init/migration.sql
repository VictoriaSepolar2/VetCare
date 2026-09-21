-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "crmv" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "veterinarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "veterinarioId" INTEGER NOT NULL,
    "dataConsulta" TIMESTAMP(3) NOT NULL,
    "statusConsulta" TEXT NOT NULL DEFAULT 'Agendada',

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prontuarios" (
    "id" SERIAL NOT NULL,
    "consultaId" INTEGER NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "medicamentosPrescritos" TEXT NOT NULL,
    "dataRetorno" TIMESTAMP(3),

    CONSTRAINT "prontuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarios_crmv_key" ON "veterinarios"("crmv");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarios_email_key" ON "veterinarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prontuarios_consultaId_key" ON "prontuarios"("consultaId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_veterinarioId_fkey" FOREIGN KEY ("veterinarioId") REFERENCES "veterinarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuarios" ADD CONSTRAINT "prontuarios_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

