# Documentación de Integración Web3 & Solana Devnet 🌿

Este documento describe la arquitectura, servicios, hooks e instrucciones en Solana que componen la capa Web3 de la dApp **Huellazo**.

---

## 📌 0. Política de Terminología Web3 (Terminology Policy)

Por estándar del proyecto, se establece la siguiente regla estricta de lenguaje:

1. **Scripts, Backend, Smart Contracts & Developer Logs**:
   - Se deben usar obligatoriamente **términos técnicos en inglés** (ejemplo: `Token Mint`, `Associated Token Account (ATA)`, `Program Derived Address (PDA)`, `Keypair`, `Cross-Program Invocation (CPI)`, `SPL Token`, `Devnet RPC Endpoint`, `Airdrop`, `Transaction Signature`).
2. **Frontend UI & Texto orientados al Usuario Final**:
   - Se debe mantener un lenguaje simple en **español mexicano** sin jerga cripto que pueda confundir al turista o comerciante (ejemplo: `Puntos Huellazos ($HZ)`, `Estampas de Pasaporte`, `Código de Autenticidad`, `Monedero`).

---

## 🏛️ 1. Resumen de Smart Contracts (Anchor)

Los contratos fueron escritos en **Rust** utilizando el framework **Anchor v0.32.0** y se encuentran desplegados en **Solana Devnet**.

| Programa | Program ID (Devnet) | Ubicación en el Monorepo | Descripción |
| :--- | :--- | :--- | :--- |
| **`huellazo`** | `2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ` | `/anchor/programs/huellazo` | Lógica principal de minteo de POAPs, pasaportes dinámicos y pagos |
| **`vault`** | `HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU` | `/anchor/programs/vault` | Tesorería y bóveda de depósitos on-chain |

### 🚀 Registro de Despliegue Exitoso en Solana Devnet

- **Red / Cluster**: Solana Devnet
- **Devnet RPC Endpoint**: `https://devnet.helius-rpc.com/?api-key=TU_API_KEY_HELIUS`
- **Program ID en Devnet**: `2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ`
- **Solana Explorer URL (Programa)**: [https://explorer.solana.com/address/2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ?cluster=devnet](https://explorer.solana.com/address/2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ?cluster=devnet)
- **Transaction Signature**: `2QGezHCspgQfbEtRYJ3GsmzyLj6E27bdyH28LkKB8uLt27TYnjTgbysV25aLpSykUH6xr5HaQGDhcdNJFJwCaFKb`
- **Solana Explorer URL (Transacción)**: [https://explorer.solana.com/tx/2QGezHCspgQfbEtRYJ3GsmzyLj6E27bdyH28LkKB8uLt27TYnjTgbysV25aLpSykUH6xr5HaQGDhcdNJFJwCaFKb?cluster=devnet](https://explorer.solana.com/tx/2QGezHCspgQfbEtRYJ3GsmzyLj6E27bdyH28LkKB8uLt27TYnjTgbysV25aLpSykUH6xr5HaQGDhcdNJFJwCaFKb?cluster=devnet)

#### Verificación On-Chain:
```bash
Program Id: 2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Data Length: 400,360 bytes
Status: Active on Devnet Slot 486286645
Authority: ABt3mfoS61TH2DKg97hiznWWnhwYmfbUo3R8ii7epZ2U
```

#### Variables de Entorno Actualizadas:
Se actualizó tanto en `mobile/.env` como en `mobile/.env.example` y `backend/app/core/config.py`:
```env
EXPO_PUBLIC_HUELLAZO_PROGRAM_ID=2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ
EXPO_PUBLIC_HELIUS_DAS_RPC=https://devnet.helius-rpc.com/?api-key=TU_API_KEY_HELIUS
```

### Cuentas y Cuentas Derivadas de Programa (PDAs)
- **`ConfigState`**: Derivada de los seeds `[b"config"]`. Almacena la autoridad del sistema y el contador global de tokens minteados (`total_minted`).
- **`PoapState`**: Derivada de los seeds `[b"poap", owner_wallet, token_id_u64_le]`. Almacena los datos on-chain de la estampa:
  - `token_id` (`u64`): Identificador único del POAP.
  - `owner_wallet` (`Pubkey`): Billetera del turista que posee la estampa.
  - `token_uri` (`String`): Enlace a metadatos off-chain.
  - `latitude` / `longitude` (`f64`): Ubicación geográfica del minteo.
  - `poap_type` (`u8`): `0` = Lugar Turístico, `1` = Comercio Aliado.

---

## 🪙 2. Despliegue de SPL Token Mint ($HZ)

Para crear o actualizar la menta del token fungible `$HZ` en Solana Devnet, el monorepo incluye un script automatizado:

```bash
npm run create-token
```

- **Script Source**: [scripts/create-spl-token.js](file:///home/m4r10/Documents/projects/dApp/scripts/create-spl-token.js)
- **Persistent Keypair**: [scripts/payer-keypair.json](file:///home/m4r10/Documents/projects/dApp/scripts/payer-keypair.json) (`42XmeSGwx2w8WZ5ghVSBiLnKVfbmASYNMCVJJBJEZP3C`)
- **Acciones**:
  1. Se conecta a `https://api.devnet.solana.com`.
  2. Verifica saldo SOL del desplegador o solicita Airdrop en Devnet.
  3. Ejecuta `createMint(...)` con 6 decimales.
  4. Actualiza automáticamente la constante `HUELLAZO_TOKEN_MINT` en [mobile/services/solana-program.ts](file:///home/m4r10/Documents/projects/dApp/mobile/services/solana-program.ts).

---

## 🌐 3. Capa de Servicios Frontend (`mobile/services/solana-program.ts`)

El archivo [mobile/services/solana-program.ts](file:///home/m4r10/Documents/projects/dApp/mobile/services/solana-program.ts) gestiona la conexión con el nodo RPC de Solana y serializa las instrucciones de Anchor en formato binario.

### Funciones Principales:
```typescript
// 1. Derivación de la PDA de Configuración Global
export function getConfigPda(): [PublicKey, number]

// 2. Derivación determinista de la PDA de una Estampa/POAP
export function getPoapPda(userPublicKey: PublicKey, tokenId: number): [PublicKey, number]

// 3. Derivación de la Associated Token Account (ATA) para $HZ
export function getAssociatedTokenAddress(owner: PublicKey, mint?: PublicKey): PublicKey

// 4. Serialización de la instrucción `mint_place` (Vista Turista)
export function createMintPlaceInstructionData(
  tokenId: number, tokenUri: string, latitude: number, longitude: number, poapType: number
): Buffer

// 5. Serialización de la instrucción `mint_business` (Vista Comercio)
export function createMintBusinessInstructionData(
  tokenId: number, tokenUri: string, latitude: number, longitude: number, amountLamports: number
): Buffer
```

---

## 🎣 4. Hook Personalizado Web3 (`mobile/hooks/useHuellazoWeb3.ts`)

El hook [mobile/hooks/useHuellazoWeb3.ts](file:///home/m4r10/Documents/projects/dApp/mobile/hooks/useHuellazoWeb3.ts) abstrae la complejidad de la blockchain para las pantallas de la aplicación.

### Métodos y Propiedades Expuestos:
- **`hzTokenMint`**: Dirección pública Base58 del Token Mint de `$HZ`.
- **`hzUserAta`**: Associated Token Account (ATA) del usuario conectado.
- **`mintPlaceOnChain(...)`**: Minteo de estampas turísticas y recompensa de tokens `$HZ`.
- **`mintBusinessOnChain(...)`**: Pago atómico de SOL y minteo de estampa en comercios aliados.

---

## ⚡ 5. Integración con MagicBlock Ephemeral Rollups

El smart contract en Rust ([anchor/programs/huellazo/src/lib.rs](file:///home/m4r10/Documents/projects/dApp/anchor/programs/huellazo/src/lib.rs)) implementa el SDK `ephemeral-rollups-sdk`:
- **Instrucción `delegate`**: Transfiere la propiedad de la PDA a un Ephemeral Rollup L2 de MagicBlock.
- **Beneficio**: Permite que el turista realice escaneos instantáneos con latencia milimétrica y **sin pagar costo de gas** por transacción.
