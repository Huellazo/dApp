# Huellazo dApp 🌿

Huellazo is a gamified and sustainable mobile tourism dApp built on the Solana network. The platform eliminates financial intermediaries and rewards physical exploration. Users utilize a Dynamic NFT Passport (managed via PDAs on Solana) to mint NFTs, earn "Huellazo" tokens, and process direct payments to local merchants via Solana Pay by physically visiting real locations, verified through GPS validation (anti-spoofing).

---

## 📚 Documentation & Technical Guides

- 🧪 **[Web3 & Solana Testing Manual](docs/GUIA_PRUEBAS_WEB3_SOLANA.md)**: Complete step-by-step testing guide for Phantom/Solflare wallets, Solana Pay QRs, cNFT minting, Blinks, and Pokémon P2P Trading.
- 🌐 **[Web3 Integration Guide](docs/WEB3_INTEGRATION.md)**: Detailed technical specifications for Solana Devnet RPC connections, PDAs, instructions (`mint_place`, `mint_business`), and Mobile Wallet Adapter hooks.
- 🪙 **[Tokenomics Strategy & SPL Token Guide](docs/ESTRATEGIA_TOKEN_HUELLAZOS.md)**: Deep-dive into converting $HZ points into native Solana SPL Tokens via Anchor CPIs.
- 🌲 **[Full Architecture & cNFTs Guide](docs/ARQUITECTURA_Y_CNFTS.md)**: Deep-dive into monorepo layers, Metaplex Bubblegum, Merkle Trees, and SPL State Compression for Compressed NFTs.
- 🇲🇽 **[Huajuapan de León Real-World Research](docs/informe_huajuapan_de_leon.md)**: Research report detailing the 23 real POIs, gastronomy (Mole de Caderas, Chileajo), history, menus, and cultural routes.
- 🎨 **[Neo-Brutalist Visual Guidelines](docs/promp_image/neobrutalismo.md)**: Design system rules for "Manchones Mexicanos" branding and artwork.

---

## 🎨 Visual Identity: Mexican Brutalism

The frontend and mobile experience are designed with a **Minimalist Neo-Brutalist approach featuring Mexican influences**. This style combines the structural solidity of brutalism (thick borders and hard shadows) with a warm, organic color palette representative of Mexico's architecture and nature.

### Main Color Palette
- **Warm Cream (`#FAF9F6`)**: Used as the main background, evoking stucco and the organic textures of minimalist architecture.
- **Dark Talavera Blue (`#3D405B`)**: Used for text, thick borders (`border-4`), and the hard shadows characteristic of neo-brutalism (`shadow-[4px_4px_0px_#3D405B]`).
- **Terracotta / Brick (`#E07A5F`)**: Primary accent color (used in headers and attention-grabbing elements), reminiscent of clay tiles and earth.
- **Mustard Yellow (`#F2CC8F`)**: Secondary accent color (action buttons and highlights), bringing vibrancy and energy to the UI.

---

## 🏗️ Monorepo Architecture

The project utilizes a modern monorepo architecture managed via npm workspaces, Docker, and Solana tooling.

```text
huellazo-mobile/
├── anchor/          # Smart Contracts (Rust/Anchor)
├── backend/         # Python API (FastAPI + PostgreSQL + asyncpg)
└── mobile/          # Mobile App (React Native + Expo + Mapbox)
```

### 1. Blockchain (Anchor)
Consolidated and ready to compile in `/anchor/programs`:
- **`huellazo` Program**: Contains the core gamified logic, including the minting of Dynamic NFT Passports and the registration of the global configuration via PDAs (Program Derived Addresses).
- **`vault` Program**: Treasury and vault system to hold deposits and process on-chain transfers (CPIs with the System Program).

### 2. Backend (FastAPI)
A robust Python 3.12 backend handling:
- Cryptographic verification of Ed25519 wallet signatures (passwordless authentication).
- **Geofencing Validation (Anti-Spoofing)** using `Shapely` and exact azimuthal projections to verify if a user's GPS coordinate falls within a merchant's radius.
- Generation of links and references for **Solana Pay**.

### 3. Mobile Frontend (React Native)
Application built with Expo (using `cause-pots` as a baseline) integrating:
- Dynamic maps using `@rnmapbox/maps`.
- Native wallet connection via **Solana Mobile Wallet Adapter (MWA)**.
- Neo-brutalist interactive design.

---

## 🚀 How to Run the Project

### 1. Environment Variables
Copy the example file to configure your environments:
```bash
cp .env.example .env
```
> **Note:** You must fill in your Mapbox tokens (`MAPBOX_ACCESS_TOKEN` and `MAPBOX_DOWNLOADS_TOKEN`) inside the `.env` file for the map to render correctly.

### 2. Initialize Services (Database and API)
The backend and database are fully dockerized. Spin up the infrastructure with:
```bash
npm run docker:up
# To view backend logs:
npm run docker:logs:api
```

### 3. Compile Smart Contracts (Solana)
Make sure you have the Solana toolchain and Anchor CLI (version `0.32.0`) installed.
```bash
npm run anchor:build
npm run anchor:test
```

### 4. Run the Mobile App (Frontend)
The mobile UI has been designed to be fully testable on the Web or via Expo Go without requiring native compilation or Java.

**To run in the Web Browser (Recommended for UI testing):**
```bash
npm install
npm run mobile:web
```

**To run on your phone via Expo Go:**
```bash
npm install
npm run mobile:dev
```

### 5. Native Compilation (Solana Wallet Adapter)
> **Note:** Compiling the native app is **ONLY** necessary when you are ready to test the hardware-specific features of the Solana Mobile Wallet Adapter (MWA) for signing real transactions with apps like Phantom or Solflare.

If you wish to run it natively on an Android Emulator using prebuilds, **Java 17 is strictly required**. If your OS package manager does not provide Java 17 (e.g., Fedora 44+), we highly recommend using [SDKMAN!](https://sdkman.io/) to install it locally without affecting your system packages:

```bash
# 1. Install SDKMAN!
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 2. Install Java 17
sdk install java 17.0.12-tem

# 3. Build the native Android app
sdk use java 17.0.12-tem
npm run mobile:android
```

---

## 🎮 Gamification & Web3 Modules (Hackathon Features)

During the hackathon, we built several dynamic modules that bring the Huellazo economy to life on the frontend:

- **Universal Intelligent QR Scanner (`scan.tsx`):** A unified Neo-Brutalist action button (`📷 ESCANEAR CÓDIGO QR`) and modal that automatically parses and routes live camera streams, uploaded QR photos, or quick test presets from `./qrcodes` to process Solana Pay transactions (`solana:`), cNFT POI mints, Solana Actions/Blinks (`solana-action:`), or P2P trades.
- **P2P Synchronous Trading (Pokémon Style):** Users can offer their Stamps/NFTs by generating a QR Code (`TradeOfferModal`). Scanning it opens `TradeAcceptModal` featuring a **Pokémon Trade Machine Animation**—with energy beams, card crossover, white flash, and Devnet transaction hash signatures with direct Solscan links.
- **Dynamic NFT Passport (`ownedNfts` state):** Managed via `passport.tsx`, your passport displays unlocked cNFT stamps, explorer levels/XP, SOL and Puntos Huellazos ($HZ) balances, and transaction history.
- **Overclocked Radar (Token Utility):** Users can burn 100 `$HUELLAZOS` to "Overclock" their radar for 30 minutes. This visually transforms the UI to neon green and simulates the discovery of hidden POIs and rare drops.
- **Local Blockchain Feed:** The scanner includes a "Local Node Feed" that simulates real-time on-chain activity from nearby explorers (e.g., "User 0x8A... minted a Taco Stamp"), creating a multiplayer Web3 experience.
- **Piñata Loot Engine:** A probabilistic loot system where users can spend points to break a piñata and win random rewards, including ultra-rare "Chromatic" NFTs.

---

## 🌐 Deploying to Vercel (Web Demo)

While Huellazo is a mobile-first app designed around the **Solana Mobile Wallet Adapter (MWA)**, you can deploy the web export to Vercel for demonstration purposes.

> **⚠️ Important Note on Phantom Wallet:** When deployed to the web, the "Connect Wallet" button uses MWA. If you open the Vercel link on a desktop browser, it will not connect to the Phantom Chrome Extension. **To test the wallet connection, you must open the Vercel link on a mobile device (iOS/Android)** so it can deep-link into the Phantom mobile app.
