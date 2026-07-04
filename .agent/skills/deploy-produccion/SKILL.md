---
name: deploy-produccion
description: Utiliza esta skill cuando el usuario quiera subir cambios al servidor de producción del colegio (200.3.127.46). Incluye los procedimientos para deploy de frontend, backend y migraciones de base de datos.
---

# Deploy a Producción — Servidor del Colegio

**Datos del servidor:**
- IP: `200.3.127.46`
- Puerto SSH/SCP: `22002`
- Usuario: `cuatro`
- Frontend en servidor: `~/public_html/`
- Backend en servidor: `~/servicios/`

> ⚠️ El servidor **solo es accesible desde la red interna del colegio**. Si el SSH da timeout, hay que estar físicamente en el colegio o tener VPN.

---

## PASO 0 — Siempre primero: buildear el frontend

Antes de subir cualquier cosa, generar el bundle de producción desde la raíz del proyecto:

```bash
cd frontend && npm run build
cd ..
```

Esto genera la carpeta `frontend/dist/` con los archivos estáticos listos para Apache.

---

## CASO 1 — Deploy estándar (cambios en frontend y/o backend, sin cambios en la DB)

### 1. Subir el frontend
```bash
scp -P 22002 -r frontend/dist/* cuatro@200.3.127.46:~/public_html/
```

### 2. Subir el backend
```bash
scp -P 22002 backend/server.js backend/package.json cuatro@200.3.127.46:~/servicios/
scp -P 22002 -r backend/src/ cuatro@200.3.127.46:~/servicios/
```

### 3. Entrar al servidor y reiniciar
```bash
ssh cuatro@200.3.127.46 -p 22002
```
Una vez adentro:
```bash
cd ~/servicios && npm install && pm2 restart servicios
```

---

## CASO 2 — Deploy con cambios en el schema de base de datos (schema.prisma)

Hacer todo lo del **CASO 1**, y además:

### 4. Subir el schema de Prisma
```bash
scp -P 22002 backend/prisma/schema.prisma cuatro@200.3.127.46:~/servicios/prisma/
```

### 5. Entrar al servidor y aplicar la migración
```bash
ssh cuatro@200.3.127.46 -p 22002
```
Una vez adentro:
```bash
cd ~/servicios
npx prisma generate
npx prisma db push
pm2 restart servicios
```

---

## Verificación final

Después del deploy, confirmar que el backend levantó correctamente:
```bash
pm2 logs servicios --lines 20
```
Deberías ver:
```
✅ Conectado a la base de datos
🚀 Servidor corriendo en http://localhost:3004
```
