# Documentación de Integración Web3 & Solana Devnet 🌿

Este documento describe la arquitectura, servicios, hooks e instrucciones en Solana que componen la capa Web3 de la dApp **Huellazo**.

---

## 🏛️ 1. Resumen de Smart Contracts (Anchor)

Los contratos fueron escritos en **Rust** utilizando el framework **Anchor v0.32.0** y se encuentran desplegados en **Solana Devnet**.

| Programa | Program ID (Devnet) | Ubicación en el Monorepo | Descripción |
| :--- | :--- | :--- | :--- |
| **`huellazo`** | `4pioWVSCp5oSbxbeRbquccusTkvT6Z9B8jTg7j2XXNVk` | `/anchor/programs/huellazo` | Lógica principal de minteo de POAPs, pasaportes dinámicos y pagos |
| **`vault`** | `HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU` | `/anchor/programs/vault` | Tesorería y bóveda de depósitos on-chain |

### Cuentas y Cuentas Derivadas de Programa (PDAs)
- **`ConfigState`**: Derivada de los seeds `[b"config"]`. Almacena la autoridad del sistema y el contador global de tokens minteados (`total_minted`).
- **`PoapState`**: Derivada de los seeds `[b"poap", owner_wallet, token_id_u64_le]`. Almacena los datos on-chain de la estampa:
  - `token_id` (`u64`): Identificador único del POAP.
  - `owner_wallet` (`Pubkey`): Billetera del turista que posee la estampa.
  - `token_uri` (`String`): Enlace a metadatos off-chain.
  - `latitude` / `longitude` (`f64`): Ubicación geográfica del minteo.
  - `poap_type` (`u8`): `0` = Lugar Turístico, `1` = Comercio Aliado.

---

## 🌐 2. Capa de Servicios Frontend (`mobile/services/solana-program.ts`)

El archivo [mobile/services/solana-program.ts](file:///home/m4r10/Documents/projects/dApp/mobile/services/solana-program.ts) gestiona la conexión con el nodo RPC de Solana y serializa las instrucciones de Anchor en formato binario.

### Funciones Principales:
```typescript
// 1. Derivación de la PDA de Configuración Global
export function getConfigPda(): [PublicKey, number]

// 2. Derivación determinista de la PDA de una Estampa/POAP
export function getPoapPda(userPublicKey: PublicKey, tokenId: number): [PublicKey, number]

// 3. Serialización de la instrucción `mint_place` (Vista Turista)
export function createMintPlaceInstructionData(
  tokenId: number, tokenUri: string, latitude: number, longitude: number, poapType: number
): Buffer

// 4. Serialización de la instrucción `mint_business` (Vista Comercio)
export function createMintBusinessInstructionData(
  tokenId: number, tokenUri: string, latitude: number, longitude: number, amountLamports: number
): Buffer
```

---

## 🎣 3. Hook Personalizado Web3 (`mobile/hooks/useHuellazoWeb3.ts`)

El hook [mobile/hooks/useHuellazoWeb3.ts](file:///home/m4r10/Documents/projects/dApp/mobile/hooks/useHuellazoWeb3.ts) abstrae la complejidad de la blockchain para las pantallas de la aplicación.

### Métodos Expuestos:

#### A. `mintPlaceOnChain(...)`
- **Propósito**: Ejecutar el minteo on-chain de una estampa turística al escanear un lugar en el Radar.
- **Flujo**:
  1. Deriva la PDA del POAP para la wallet actual.
  2. Construye la transacción `mint_place`.
  3. Solicita la firma a la billetera (vía **Mobile Wallet Adapter** o Phantom).
  4. Envía y confirma la transacción en Solana Devnet.

#### B. `mintBusinessOnChain(...)`
- **Propósito**: Realizar un pago atómico en SOL del producto de un negocio y mintear la estampa en una sola transacción.
- **Flujo**:
  1. Construye una instrucción `mint_business` con los lamports a transferir.
  2. Ejecuta en una sola transacción atómica el envío de SOL al negocio y la creación del `PoapState`.

#### C. Fallback Híbrido No-Destructivo (Graceful Fallback)
- Si el usuario no tiene una billetera conectada o el RPC de Solana no responde, el hook captura el evento sin lanzar excepciones críticas, manteniendo la app 100% funcional en modo simulado.

---

## 📱 4. Integración en Pantallas

### 1. Radar de Escaneo (`mobile/app/(tabs)/scan.tsx`)
- Al escanear un atractivo turístico (ej. *Cerro de las Minas*, *Catedral*), invoca `mintPlaceOnChain(...)` registrando la visita on-chain.

### 2. Detalle de Comercio (`mobile/app/business/[id].tsx`)
- Al canjear una oferta o comprar en el menú, invoca `mintBusinessOnChain(...)` procesando la transferencia de SOL y el minteo atómico.

### 3. Pasaporte de Viaje (`mobile/app/(tabs)/passport.tsx`)
- Conexión con Phantom/Solflare mediante `useAuth()` e inspección en tiempo real del saldo SOL vía el hook `useGetBalance()`.

---

## ⚡ 5. Integración con MagicBlock Ephemeral Rollups

El smart contract en Rust ([anchor/programs/huellazo/src/lib.rs](file:///home/m4r10/Documents/projects/dApp/anchor/programs/huellazo/src/lib.rs)) implementa el SDK `ephemeral-rollups-sdk`:
- **Instrucción `delegate`**: Transfiere la propiedad de la PDA a un Ephemeral Rollup L2 de MagicBlock.
- **Beneficio**: Permite que el turista realice escaneos instantáneos con latencia milimétrica y **sin pagar costo de gas** por transacción.
