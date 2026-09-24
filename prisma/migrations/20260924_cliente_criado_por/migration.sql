-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "criadoPorId" INTEGER;

-- CreateIndex
CREATE INDEX "clientes_criadoPorId_idx" ON "clientes"("criadoPorId");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

