/*
  Warnings:

  - You are about to drop the `RegistroComida` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegistroComida" DROP CONSTRAINT "RegistroComida_alimentoId_fkey";

-- DropForeignKey
ALTER TABLE "RegistroComida" DROP CONSTRAINT "RegistroComida_usuarioId_fkey";

-- DropTable
DROP TABLE "RegistroComida";

-- CreateTable
CREATE TABLE "Comida" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemComida" (
    "id" SERIAL NOT NULL,
    "comidaId" INTEGER NOT NULL,
    "alimentoId" INTEGER,
    "nombre" TEXT NOT NULL,
    "gramos" DOUBLE PRECISION NOT NULL,
    "kcal" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "grasas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemComida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comida_usuarioId_fecha_idx" ON "Comida"("usuarioId", "fecha");

-- CreateIndex
CREATE INDEX "ItemComida_comidaId_idx" ON "ItemComida"("comidaId");

-- AddForeignKey
ALTER TABLE "Comida" ADD CONSTRAINT "Comida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComida" ADD CONSTRAINT "ItemComida_comidaId_fkey" FOREIGN KEY ("comidaId") REFERENCES "Comida"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComida" ADD CONSTRAINT "ItemComida_alimentoId_fkey" FOREIGN KEY ("alimentoId") REFERENCES "Alimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
