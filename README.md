# Huellazo dApp 🌿

Huellazo is a gamified and sustainable mobile tourism dApp built on the Solana network. The platform eliminates financial intermediaries and rewards physical exploration. Users utilize a Dynamic NFT Passport (managed via PDAs on Solana) to mint NFTs, earn "Huellazo" tokens, and process direct payments to local merchants via Solana Pay by physically visiting real locations, verified through GPS validation (anti-spoofing).

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
npm run mobile:android
```
