# Guía de Despliegue en Vercel — Huellazo dApp & Solana Blinks

Esta guía explica paso a paso cómo desplegar la API de Solana Actions & Blinks en **Vercel** de forma gratuita:

---

## 📋 Archivos Creados para Vercel
1. **[vercel.json](file:///home/m4r10/Documents/projects/dApp/vercel.json)** (en la raíz del proyecto):
   Configura el runtime `@vercel/python` enrutando `/actions.json` y `/api/v1/blinks/**` hacia `backend/app/main.py`.
2. **[backend/requirements.txt](file:///home/m4r10/Documents/projects/dApp/backend/requirements.txt)**:
   Incluye las dependencias `fastapi`, `solders`, `solana` y `uvicorn`.

---

## 🚀 Pasos para Desplegar en Vercel (Gratis)

### Opción 1: Desde la Terminal (CLI)
1. Instala el CLI de Vercel (si no lo tienes):
   ```bash
   npm install -g vercel
   ```
2. Ejecuta desde la raíz del proyecto:
   ```bash
   vercel
   ```
3. Responde a las preguntas de Vercel:
   - **Set up and deploy?**: `y`
   - **Which scope?**: Tu usuario/equipo de Vercel.
   - **Link to existing project?**: `n`
   - **What's your project's name?**: `huellazo-dapp`
   - **In which directory is your code located?**: `./`
4. Para desplegar a producción:
   ```bash
   vercel --prod
   ```

---

### Opción 2: Desde el Panel Web de Vercel (GitHub Integration)
1. Haz commit y push de tus cambios a GitHub:
   ```bash
   git add .
   git commit -m "feat: add vercel.json for Solana Blinks deployment"
   git push origin main
   ```
2. Ve a [vercel.com/new](https://vercel.com/new).
3. Importa tu repositorio `Huellazo/dApp`.
4. Haz clic en **Deploy**. Vercel detectará el archivo `vercel.json` y compilará la API en Python automáticamente.

---

## 🔗 Cómo Probar tu Solana Blink en Dialect Devnet (`dial.to`)

Una vez desplegado en Vercel, obtendrás una URL de producción (e.g. `https://huellazo-dapp.vercel.app`).

Prueba tu estampa interactiva en Dialect Devnet introduciendo:
```text
https://dial.to/devnet?action=solana-action:https://huellazo-dapp.vercel.app/api/v1/blinks/claim-stamp?poiId=cerro_minas
```

### ✅ Resultado:
- **Respuesta 200 OK**: Cero error 503.
- **Transacción Devnet**: Conecta Phantom o Solflare, firma la transacción y registra tu estampa directamente en **Solana Devnet**.
