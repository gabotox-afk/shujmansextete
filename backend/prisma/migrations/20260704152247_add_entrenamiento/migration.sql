-- CreateTable
CREATE TABLE "Ejercicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "grupoMuscular" TEXT NOT NULL,
    "descripcion" TEXT,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rutina" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RutinaDia" (
    "id" SERIAL NOT NULL,
    "rutinaId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RutinaDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RutinaDiaEjercicio" (
    "id" SERIAL NOT NULL,
    "rutinaDiaId" INTEGER NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "seriesObj" INTEGER NOT NULL,
    "repsObj" TEXT NOT NULL,
    "rirObj" INTEGER,
    "notas" TEXT,

    CONSTRAINT "RutinaDiaEjercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "rutinaDiaId" INTEGER,
    "rutinaId" INTEGER,

    CONSTRAINT "Calendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarioOverride" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fechaSemana" TIMESTAMP(3) NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "rutinaDiaId" INTEGER,
    "rutinaId" INTEGER,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarioOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rutinaDiaId" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duracionMin" INTEGER,
    "notas" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SerieRegistrada" (
    "id" SERIAL NOT NULL,
    "sesionId" INTEGER NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "numeroSerie" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "rir" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SerieRegistrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ejercicio_usuarioId_idx" ON "Ejercicio"("usuarioId");

-- CreateIndex
CREATE INDEX "Ejercicio_grupoMuscular_idx" ON "Ejercicio"("grupoMuscular");

-- CreateIndex
CREATE INDEX "Rutina_usuarioId_idx" ON "Rutina"("usuarioId");

-- CreateIndex
CREATE INDEX "RutinaDia_rutinaId_idx" ON "RutinaDia"("rutinaId");

-- CreateIndex
CREATE INDEX "RutinaDiaEjercicio_rutinaDiaId_idx" ON "RutinaDiaEjercicio"("rutinaDiaId");

-- CreateIndex
CREATE INDEX "Calendario_usuarioId_idx" ON "Calendario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Calendario_usuarioId_diaSemana_key" ON "Calendario"("usuarioId", "diaSemana");

-- CreateIndex
CREATE INDEX "CalendarioOverride_usuarioId_fechaSemana_idx" ON "CalendarioOverride"("usuarioId", "fechaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarioOverride_usuarioId_fechaSemana_diaSemana_key" ON "CalendarioOverride"("usuarioId", "fechaSemana", "diaSemana");

-- CreateIndex
CREATE INDEX "Sesion_usuarioId_fecha_idx" ON "Sesion"("usuarioId", "fecha");

-- CreateIndex
CREATE INDEX "SerieRegistrada_sesionId_idx" ON "SerieRegistrada"("sesionId");

-- CreateIndex
CREATE INDEX "SerieRegistrada_ejercicioId_idx" ON "SerieRegistrada"("ejercicioId");

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaDia" ADD CONSTRAINT "RutinaDia_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaDiaEjercicio" ADD CONSTRAINT "RutinaDiaEjercicio_rutinaDiaId_fkey" FOREIGN KEY ("rutinaDiaId") REFERENCES "RutinaDia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaDiaEjercicio" ADD CONSTRAINT "RutinaDiaEjercicio_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "Ejercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendario" ADD CONSTRAINT "Calendario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendario" ADD CONSTRAINT "Calendario_rutinaDiaId_fkey" FOREIGN KEY ("rutinaDiaId") REFERENCES "RutinaDia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendario" ADD CONSTRAINT "Calendario_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarioOverride" ADD CONSTRAINT "CalendarioOverride_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarioOverride" ADD CONSTRAINT "CalendarioOverride_rutinaDiaId_fkey" FOREIGN KEY ("rutinaDiaId") REFERENCES "RutinaDia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarioOverride" ADD CONSTRAINT "CalendarioOverride_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_rutinaDiaId_fkey" FOREIGN KEY ("rutinaDiaId") REFERENCES "RutinaDia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieRegistrada" ADD CONSTRAINT "SerieRegistrada_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "Sesion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieRegistrada" ADD CONSTRAINT "SerieRegistrada_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "Ejercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
