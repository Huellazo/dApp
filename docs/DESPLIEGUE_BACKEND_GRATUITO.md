# Guía de Despliegue Gratuito de Backend API (Docker, Render, Fly.io, Vercel)

Esta guía detalla las opciones **gratuitas** para desplegar el backend API en contenedores **Docker** o servicios Serverless para interactuar sin costo con inspectores como **Dialect (`dial.to`)** y la red de **Solana Devnet**:

---

## 🐋 Opción 1: Despliegue Gratuito con Docker en Render.com

Render permite desplegar proyectos Docker gratis desde tu repositorio de GitHub:

1. Crea una cuenta gratuita en [render.com](https://render.com).
2. Conecta tu repositorio de GitHub `Huellazo/dApp`.
3. Selecciona **New Web Service** ➔ **Docker**.
4. Especifica el Root Directory como `backend` y el comando de arranque:
   `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. ¡Listo! Render emitirá una URL HTTPS pública gratuita (e.g. `https://huellazo-api.onrender.com`).
6. Tu enlace interactivo de Solana Blink en Dialect será:
   ```text
   https://dial.to/devnet?action=solana-action:https://huellazo-api.onrender.com/api/v1/blinks/claim-stamp?poiId=cerro_minas
   ```

---

## ✈️ Opción 2: Despliegue Gratuito con Fly.io (Docker CLI)

Fly.io te permite desplegar contenedores Docker directamente desde la terminal:

1. Instala el CLI de Fly.io:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. Ejecuta desde la carpeta `backend/`:
   ```bash
   cd backend
   fly launch
   ```
3. Fly.io detectará el `Dockerfile`, compilará y desplegará tu API con una URL HTTPS pública gratuita.

---

## ⚡ Opción 3: Despliegue Serverless en Vercel

Vercel permite alojar APIs Python Serverless sin costo:

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Ejecuta en la raíz del proyecto:
   ```bash
   vercel --prod
   ```

---

## 💻 Opción 4: Túnel HTTPS Temporal en Local (0 Costo)

Si deseas probar Dialect en vivo desde tu máquina local sin subir a ninguna nube:

1. Arranca tu API de FastAPI:
   ```bash
   python -m uvicorn backend.app.main:app --port 8000
   ```
2. Inicia un túnel HTTPS gratuito:
   ```bash
   npx localtunnel --port 8000
   ```
   o
   ```bash
   npx ngrok http 8000
   ```
3. Copia la URL HTTPS en Dialect `dial.to`.

---

## 📱 Opción 5: Ejecución 100% Autónoma en el Móvil (Sin Servidor)

Recuerda que la aplicación móvil React Native (`scan.tsx`, `useHuellazoCnft.ts`, `useHuellazoWeb3.ts`) **no necesita ningún servidor backend** para funcionar:
- Ejecuta los comandos `npm run claim:blink-devnet` o escanea los QRs con `huellazo:pinata?id=...` para reclamar Puntos $HZ y mintear cNFTs directamente desde el dispositivo del usuario en Solana Devnet.
