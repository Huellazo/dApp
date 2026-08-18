> [!WARNING]
> **STALE DOCUMENT**
> This document describes an older layout/architecture and is kept for historical purposes. Please véase [estado-proyecto-2026-08-17.md](file:///home/m4r10/Documents/projects/dApp/docs/estado-proyecto-2026-08-17.md) for the current status.

# CodeFlow Analysis Report

**Repository:** p3p3p3k4z/huellazo-solana
**Analyzed:** 7/10/2026, 11:50:21 PM

## Summary

| Metric | Value |
|--------|-------|
| Health Score | 100/100 (A) |
| Files | 50 |
| Functions | 62 |
| Lines of Code | 14,586 |
| Dependencies | 11 |
| Unused Functions | 0 |
| Security Issues | 3 |

## Security Issues

### LOW: Debug Statements
- **File:** `backend/client/test_cliente.ts`
- **Description:** 15 console statements found. Remove before production.

### LOW: Code Comments
- **File:** `backend/client/test_cliente.ts`
- **Description:** 1 TODO/FIXME comments found. Address before release.

### LOW: Debug Statements
- **File:** `backend/tests/anchor.ts`
- **Description:** 13 console statements found. Remove before production.

## Design Patterns

### Context Provider
React Context for global state. Alternative to prop drilling.

**Files:** `client.ts`, `test_cliente.ts`, `deploy.ts`, `anchor.ts`

## Architecture Issues

### 4 Similar Code Blocks
Copy-paste code detected

**Affected:** `getHuellazoClient, getConfigAddress, getMerchantAddress, fund`, `passportAddr, merchantAddr, calcularNivelString`, `App, App`, `onError, onError`

### 4 Architecture Violations
Lower layers importing from higher layers

**Affected:** `test → utils`, `test → components`, `test → components`, `test → components`

## File Details

| File | Folder | Layer | Lines | Functions |
|------|--------|-------|-------|----------|
| `CONTRIBUTING.md` | root | note | 77 | 0 |
| `README.md` | root | note | 62 | 0 |
| `.gitignore` | backend | utils | 8 | 0 |
| `Anchor.toml` | backend | utils | 18 | 0 |
| `Cargo.toml` | backend | utils | 14 | 0 |
| `client.ts` | backend/client | utils | 133 | 8 |
| `test_cliente.ts` | backend/client | test | 144 | 14 |
| `idl.json` | backend | utils | 1 | 0 |
| `deploy.ts` | backend/migrations | data | 13 | 0 |
| `package.json` | backend | utils | 23 | 0 |
| `program-keypair.json` | backend | utils | 1 | 0 |
| `Cargo.toml` | backend/programs/huellazo | utils | 20 | 0 |
| `Xargo.toml` | backend/programs/huellazo | utils | 3 | 0 |
| `lib.rs` | backend/programs/huellazo/src | utils | 188 | 7 |
| `anchor.ts` | backend/tests | test | 126 | 1 |
| `tsconfig.json` | backend | utils | 11 | 0 |
| `architecture.md` | docs | note | 29 | 0 |
| `backend.md` | docs | note | 41 | 0 |
| `frontend.md` | docs | note | 31 | 0 |
| `mobile-migration.md` | docs | note | 77 | 0 |
| `setup.md` | docs | note | 66 | 0 |
| `smart-contract-api.md` | docs | note | 69 | 0 |
| `web3-expert.md` | docs | note | 39 | 0 |
| `.gitignore` | huellazo-app | utils | 29 | 0 |
| `.prettierrc` | huellazo-app | utils | 7 | 0 |
| `README.md` | huellazo-app | note | 119 | 0 |
| `Anchor.toml` | huellazo-app/anchor | utils | 19 | 0 |
| `Cargo.lock` | huellazo-app/anchor | utils | 5675 | 0 |
| `Cargo.toml` | huellazo-app/anchor | utils | 14 | 0 |
| `README.md` | huellazo-app/anchor | note | 77 | 0 |
| `Cargo.toml` | huellazo-app/anchor/programs/vault | utils | 25 | 0 |
| `lib.rs` | huellazo-app/anchor/programs/vault/src | utils | 76 | 2 |
| `tests.rs` | huellazo-app/anchor/programs/vault/src | test | 171 | 6 |
| `codama.json` | huellazo-app | utils | 12 | 0 |
| `eslint.config.js` | huellazo-app | utils | 29 | 0 |
| `index.html` | huellazo-app | utils | 14 | 0 |
| `package-lock.json` | huellazo-app | utils | 6142 | 0 |
| `package.json` | huellazo-app | utils | 57 | 0 |
| `App.tsx` | huellazo-app/src | utils | 37 | 2 |
| `App2.tsx` | huellazo-app/src | utils | 54 | 3 |
| `App_old.tsx` | huellazo-app/src | utils | 94 | 3 |
| `VaultCard.tsx` | huellazo-app/src | utils | 132 | 2 |
| `Sidebar.tsx` | huellazo-app/src/components/Dashboard | components | 54 | 3 |
| `HuellazoDashboard.tsx` | huellazo-app/src/components | components | 169 | 5 |
| `HuellazoDashboard_old.tsx` | huellazo-app/src/components | components | 107 | 1 |
| `HuellazoDemo.tsx` | huellazo-app/src/components | components | 151 | 2 |
| `GameCanvas.tsx` | huellazo-app/src/components/Map | components | 65 | 2 |
| `PoiCard.tsx` | huellazo-app/src/components/Map | components | 63 | 1 |
| `index.css` | huellazo-app/src | utils | 0 | 0 |
| `tsconfig.json` | huellazo-app | utils | 0 | 0 |
