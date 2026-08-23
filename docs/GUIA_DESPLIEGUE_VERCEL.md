# Guía de Ajustes de Construcción en Vercel — Huellazo dApp

Esta guía detalla la **configuración exacta de construcción (Build Settings)** necesaria en el panel de Vercel para asegurar un despliegue exitoso sin errores:

---

## ⚙️ Configuración del Proyecto en Vercel (Project Settings)

Al importar tu repositorio `Huellazo/dApp` en [vercel.com](https://vercel.com):

1. **Framework Preset**: Selecciona **`Other`** (Vercel utilizará las reglas definidas en `vercel.json`).
2. **Root Directory**: **`./`** (déjalo por defecto en la raíz).
3. **Build Command**: Déjalo deshabilitado / vacío (`Override` en **OFF**). Vercel ejecutará automáticamente la compilación de Python definida en `@vercel/python`.
4. **Output Directory**: Déjalo deshabilitado / vacío.
5. **Install Command**: Déjalo deshabilitado / vacío. Vercel instalará automáticamente las dependencias registradas en `requirements.txt`.

---

## 📋 Archivos Creados para Vercel
- **[vercel.json](file:///home/m4r10/Documents/projects/dApp/vercel.json)**:
  - Runtime: `@vercel/python` apuntando a `backend/app/main.py`.
  - Cabeceras Globales CORS: `X-Action-Version: 2.1.3`, `X-Blockchain-Ids: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`, `Access-Control-Allow-Origin: *`.
- **[requirements.txt](file:///home/m4r10/Documents/projects/dApp/requirements.txt)**:
  - Situado en la raíz del proyecto para autodetección inmediata por Vercel.

---

## 🚀 Pasos para Desplegar (Paso a Paso)

### Opción A: Vercel Web Dashboard (Recomendada)
1. Haz commit y push de tus cambios a GitHub:
   ```bash
   git add .
   git commit -m "feat: add vercel build settings and CORS headers"
   git push origin main
   ```
2. Ve a [vercel.com/new](https://vercel.com/new) e importa `Huellazo/dApp`.
3. Verifica que en **Build and Output Settings** todas las opciones estén por defecto (sin override).
4. Haz clic en **Deploy**.

### Opción B: Vercel CLI
```bash
vercel --prod
```

---

## 🔗 Probar tu Solana Blink en Dialect Devnet (`dial.to`)

Abre en tu navegador la URL que genera Vercel (e.g. `https://huellazo-dapp.vercel.app`):
```text
https://dial.to/devnet?action=solana-action:https://huellazo-dapp.vercel.app/api/v1/blinks/claim-stamp?poiId=cerro_minas
```

### ✅ Resultado Esperado:
- **Respuesta 200 OK** (CERO error 503).
- Carga instantánea de la imagen en alta definición hospedada en GitHub.
- Firma y ejecución de la transacción en **Solana Devnet**.
