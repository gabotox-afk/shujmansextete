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

⚠️ En Windows, **nunca** mezcles una ruta absoluta con backslashes y un wildcard al final (`scp -r "C:\...\dist"/*`) — el cliente scp de Windows malinterpreta el patrón y puede terminar recorriendo carpetas del sistema (hasta la Papelera de Reciclaje) y subiendo basura al servidor. Hacé `cd` a la carpeta primero y usá ruta relativa:

```bash
cd frontend/dist
scp -P 22002 -r * cuatro@200.3.127.46:~/public_html/
cd ../..
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

También conviene chequear el health check desde afuera (no requiere login, se puede correr desde cualquier lado con curl):
```bash
curl -s -o /dev/null -w "STATUS: %{http_code}\n" "http://200.3.127.46:8002/~cuatro/api/health"
```
Debería dar `STATUS: 200`.

---

## Errores comunes ya diagnosticados (leer antes de asumir nada nuevo)

### 1. Frontend pide a una URL rara (tunel de Cloudflare, `localhost`, etc.) → "Failed to fetch"
**Causa real (ya pasó):** en algún momento se usó un túnel (`trycloudflare.com`, ngrok, etc.) para probar el backend desde afuera durante desarrollo, y esa URL quedó hardcodeada en `frontend/.env` como `VITE_API_URL`. Si ese archivo está trackeado en git, el build de producción la hornea adentro del JS final.

**Cómo se resolvió:** la URL de la API se calcula sola en `frontend/src/api/config.js` según dónde corre la app (usa `import.meta.env.BASE_URL`), en vez de leer una variable de entorno que alguien se puede olvidar de cambiar. La config de dev vive en `frontend/.env.development` (solo aplica con `npm run dev`, nunca con `npm run build`).

**Si vuelve a pasar:** revisar `frontend/.env`, `frontend/.env.production` y `frontend/src/api/config.js` — no debería haber ninguna URL hardcodeada de un entorno temporal. Verificar el bundle final con:
```bash
grep -o "localhost:[0-9]*\|trycloudflare[^\"']*\|ngrok[^\"']*" frontend/dist/assets/*.js
```
Si aparece algo ahí, ese es el problema.

### 2. 404 con body HTML tipo `Cannot GET /algo` (no JSON) → `Unexpected token '<', "<!DOCTYPE"... is not valid JSON`
**Causa real (ya pasó):** el proxy del servidor del colegio mapea `/~usuario/api/*` hacia el backend, pero le **saca el prefijo `/~usuario/api` completo** antes de reenviar — no solo `/~usuario`. Si el backend tiene sus rutas montadas con `app.use('/api', routes)`, nunca matchea nada porque Express nunca ve el `/api`.

**Cómo se resolvió:** montar las rutas del backend en la raíz (`app.use(routes)`, sin `/api`). La URL externa (la que llama el frontend) sigue llevando `/api` en el path — ese segmento es lo que le dice al proxy "esto va para el backend" — pero el propio backend ya no debe esperarlo.

**Cómo diagnosticar rápido:** pegarle directo con curl a través del proxy y mirar el *body* de la respuesta:
```bash
curl -s "http://200.3.127.46:8002/~usuario/api/health"
```
Si el body es HTML con `Cannot GET /algo`, es Express devolviendo 404 (el proxy sí reenvió, pero la ruta interna no matchea — este bug). Si el body es HTML de Apache genérico, el proxy ni siquiera reenvió (problema de ruta/config del lado Apache, no del código).

### 3. Archivos suben bien pero el navegador tira `403 Forbidden` al pedir el JS/CSS
**Causa real (ya pasó):** después de un `scp` (sobre todo desde Windows), los archivos pueden quedar con permisos demasiado restrictivos y Apache (que corre con otro usuario) no puede leerlos.

**Solución:**
```bash
chmod -R a+rX ~/public_html
```

### 4. "Ya lo arreglé pero sigue mal" y en realidad es caché del navegador
Antes de seguir debugueando, probar siempre en una **ventana de incógnito** primero — descarta de un solo paso caché del navegador y service workers viejos. Si en incógnito anda bien, no hay bug, solo hay que limpiar caché (o esperar a que expire) en el navegador normal.
