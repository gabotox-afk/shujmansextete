-- CreateTable
CREATE TABLE "Alimento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "kcalPor100g" DOUBLE PRECISION NOT NULL,
    "proteinasPor100g" DOUBLE PRECISION NOT NULL,
    "grasasPor100g" DOUBLE PRECISION NOT NULL,
    "carbohidratosPor100g" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroComida" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "alimentoId" INTEGER,
    "nombre" TEXT NOT NULL,
    "gramos" DOUBLE PRECISION NOT NULL,
    "kcal" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "grasas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroComida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alimento_usuarioId_idx" ON "Alimento"("usuarioId");

-- CreateIndex
CREATE INDEX "RegistroComida_usuarioId_fecha_idx" ON "RegistroComida"("usuarioId", "fecha");

-- AddForeignKey
ALTER TABLE "Alimento" ADD CONSTRAINT "Alimento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroComida" ADD CONSTRAINT "RegistroComida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroComida" ADD CONSTRAINT "RegistroComida_alimentoId_fkey" FOREIGN KEY ("alimentoId") REFERENCES "Alimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
