# Guía de Despliegue en Vercel — 18 Variables de Entorno de Huellazo

Esta lista contiene las **18 variables de entorno** exactas preparadas y optimizadas para pegarlas en el panel de **Vercel** ([vercel.com](https://vercel.com)):

---

## 📋 Lista Completa de las 18 Variables para Vercel

```env
# --- Base de Datos PostgreSQL ---
POSTGRES_DB=huellazo
POSTGRES_USER=huellazo_user
POSTGRES_PASSWORD=huellazo_dev_2026
DB_PORT=5432
DATABASE_URL=postgresql+asyncpg://huellazo_user:huellazo_dev_2026@localhost:5432/huellazo

# --- Backend API (FastAPI) ---
ENVIRONMENT=production
CORS_ORIGINS=*

# --- Solana Network & Anchor Smart Contracts (Devnet) ---
SOLANA_RPC_URL=https://api.devnet.solana.com
HUELLAZO_PROGRAM_ID=2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ
VAULT_PROGRAM_ID=HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU
VALIDATOR_RPC_PORT=8899

# --- Mapbox (Servicios de Mapas) ---
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibTRyMTAiLCJhIjoiY2x6eXF4NXR5MDFueDJqcjJ4ZnV6MXRjNiJ9.demo
MAPBOX_DOWNLOADS_TOKEN=sk.eyJ1IjoibTRyMTAiLCJhIjoiY2x6eXF4NXR5MDFueDJqcjJ4ZnV6MXRjNiJ9.demo

# --- Expo Mobile Frontend ---
EXPO_PUBLIC_API_URL=https://huellazo-dapp.vercel.app
EXPO_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
EXPO_PUBLIC_HUELLAZO_PROGRAM_ID=2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ
EXPO_PUBLIC_VAULT_PROGRAM_ID=HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibTRyMTAiLCJhIjoiY2x6eXF4NXR5MDFueDJqcjJ4ZnV6MXRjNiJ9.demo
```

---

## ⚙️ Cómo Agregar las Variables en Vercel
1. En el panel de Vercel, ve a la sección **Environment Variables**.
2. Copia todo el bloque de texto superior de una sola vez.
3. Vercel detectará y separará automáticamente el nombre de la variable y su valor.
4. Haz clic en **Save** o **Deploy**.
