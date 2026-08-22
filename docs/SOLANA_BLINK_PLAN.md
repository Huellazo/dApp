# Plan de Integración de Solana Actions & Blinks en Huellazo ☀️

Este documento sirve como referencia oficial para la arquitectura, especificación e implementación de **Solana Actions & Blinks** en la dApp **Huellazo**.

---

## 🎯 Visión General

Los **Solana Blinks (Blockchain Links)** transforman enlaces HTTP normales en transacciones Web3 interactivas con 1-clic dentro de redes sociales (X/Twitter, Discord, Telegram, publicaciones web).

En Huellazo, la integración de Blinks permite:
1. **Reclamo Promocional de Estampas cNFT**: Permitir a cualquier usuario reclamar una estampa cNFT promocional directamente desde una publicación en X (Twitter) o un sitio web.
2. **Compra Directa de Artesanías & Café**: Permitir compras directas de productos locales (*Café Petirrojo*, *La Casa de Humo*, artesanías de palma) liquidando en SOL/tokens desde redes sociales.
3. **Compartir Logros**: Cada turista puede convertir cualquier estampa obtenida en un Blink compartible.

---

## 🏗️ 1. Arquitectura en Backend FastAPI (`backend/app/routers/blinks.py`)

### A. Manifest Oficial `GET /actions.json`
Establece las reglas de enrutamiento requeridas por el estándar de Dialect y Solana:
```json
{
  "rules": [
    {
      "pathPattern": "/api/v1/blinks/**",
      "apiPath": "/api/v1/blinks/**"
    }
  ]
}
```

### B. Endpoint de Reclamo Promocional (`GET/POST /api/v1/blinks/claim-stamp`)
- **GET**: Retorna metadatos visuales formateados para Dialect/Twitter Blinks.
- **POST**: Recibe `{ "account": "<pubkey>" }` y construye en binario la instrucción `mint_place` del contrato Anchor de Huellazo (`2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ`), retornando la transacción serializada en `base64`.

### C. Endpoint de Comercio Local (`GET/POST /api/v1/blinks/buy-craft`)
- **GET**: Retorna metadatos visuales del producto (*Café de Especialidad Petirrojo*).
- **POST**: Genera la transacción de transferencia `SystemProgram.transfer` hacia el monedero del comercio aliado.

---

## 📱 2. Componente Móvil (`mobile/components/features/passport/ShareBlinkModal.tsx`)

Un modal integrado en el pasaporte digital del turista que permite:
1. Generar la URL compatible con Dialect Blink Inspector: `https://dial.to/devnet?action=solana-action:...`
2. Publicar directamente en X (Twitter) mediante intent URLs.
3. Copiar el enlace al portapapeles.

---

## 🧪 Verificación de Calidad

- **TypeScript Compilation (`npx tsc --noEmit`)**: **0 Errores**.
- **Acciones y Blinks**: Totalmente funcionales y registrados en la API de FastAPI (`backend/app/main.py`).
