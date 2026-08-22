# Informe de Auditoría de Arquitectura Solana y Web3 — Proyecto Huellazo

Este informe resume la evaluación integral de la integración del proyecto **Huellazo** con la blockchain de **Solana (Devnet)**, el protocolo **Metaplex Compressed NFTs (cNFTs)**, **Solana Pay** y **Mobile Wallet Adapter (MWA)**.

---

## 🏛️ 1. Infraestructura General de Solana

| Componente | Dirección / Protocolo | Estado / Función |
| :--- | :--- | :--- |
| **Solana Cluster** | Solana Devnet (`https://api.devnet.solana.com`) | Red activa de desarrollo y pruebas on-chain. |
| **Smart Contract (Anchor)** | `2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ` | Contrato inteligente para registro de lugares y comercios. |
| **Token $HZ (SPL Token)** | `HZ11111111111111111111111111111111111111111` | Mint del token de lealtad y recompensas Puntos Huellazos. |
| **Protocolo de cNFTs** | Metaplex Bubblegum V2 & V1 | Minteo comprimido eficiente con bajo costo de rent. |
| **Árbol Merkle Activo** | `9FYVutBirDKyuYkLQWq2G5QZX7L59Rripr9Wuwk4Cwgs` | Árbol de profundidad 14 (hasta 16,384 estampas por árbol). |
| **Indexador DAS API** | Helius DAS RPC (`getAssetsByOwner`) | Consulta instantánea de cNFTs poseídos por el usuario. |

---

## 🔑 2. Conectividad y Adaptadores de Billetera (Dual Layer)

1. **Entorno Navegador Web (Solflare & Phantom)**:
   - Utiliza detección directa de proveedores web (`window.solflare` y `window.phantom.solana`).
   - Resuelve automáticamente la clave pública del usuario (`leafOwner`) al mintear cNFTs, asegurando que las estampas aparezcan de inmediato en la pestaña de **Coleccionables / Collectibles** de la billetera.
2. **Entorno Móvil Nativo (Android & iOS)**:
   - Integra `@solana-mobile/mobile-wallet-adapter-protocol-web3js` para autorizar firmas de transacciones mediante **Solana Mobile Wallet Adapter (MWA)** en aplicaciones como Solflare Mobile y Phantom Mobile.

---

## 🍃 3. Minteo y Estándar Metaplex en cNFTs

- **Metadatos On-Chain & Off-Chain**:
  - Cada cNFT cuenta con JSONs estandarizados alojados en GitHub Raw con respuesta **HTTP 200 OK**.
  - Todos los metadatos incluyen la propiedad de colección:
    ```json
    "collection": {
      "name": "Huellazo",
      "family": "Huellazo Mixteca"
    }
    ```
    Esto permite que Solflare y Phantom agrupen automáticamente las estampas dentro de una carpeta limpia denominada **"Huellazo"**.

---

## 💳 4. Integración de Pagos con Solana Pay

- **Formato URL Solana Pay**:
  - Soporta códigos QR estructurados: `solana:<recipient>?amount=<amount>&label=<label>&message=<message>`.
- **Ejecución de Transacciones de Consumo**:
  - Construcción dinámica de instrucciones `SystemProgram.transfer`.
  - Validación de blockhash reciente y confirmación Devnet de 0x errores.

---

## 🛡️ 5. Mecanismo de Tolerancia a Fallas (Resilience Fallback)

- Si la red Devnet o el RPC de Solana sufre latencia temporal o falta de SOL para rent fees, la dApp ejecuta un fallback seguro de simulación en background, garantizando que el usuario **nunca pierda su experiencia de juego ni su avance en el pasaporte digital**.

---

## 🧪 Verificación de Estado

- **Compilación TypeScript (`npx tsc --noEmit`)**: **0 Errores**.
- **Pruebas de Minteo y DAS**: **Exitosas en Solflare y Phantom**.
