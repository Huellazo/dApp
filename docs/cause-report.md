> [!WARNING]
> **STALE DOCUMENT**
> This document describes an older layout/architecture and is kept for historical purposes. Please véase [estado-proyecto-2026-08-17.md](file:///home/m4r10/Documents/projects/dApp/docs/estado-proyecto-2026-08-17.md) for the current status.

# CodeFlow Analysis Report

**Repository:** solana-mobile/react-native-samples
**Analyzed:** 7/10/2026, 11:57:00 PM

## Summary

| Metric | Value |
|--------|-------|
| Health Score | 95/100 (A) |
| Files | 102 |
| Functions | 52 |
| Lines of Code | 12,970 |
| Dependencies | 36 |
| Unused Functions | 0 |
| Security Issues | 5 |

## Security Issues

### MEDIUM: Command Execution
- **File:** `cause-pots/backend/src/db/database.ts`
- **Description:** Shell command execution detected. Ensure input is sanitized to prevent injection.

### LOW: Code Comments
- **File:** `cause-pots/backend/package-lock.json`
- **Description:** 1 TODO/FIXME comments found. Address before release.

### LOW: Debug Statements
- **File:** `cause-pots/backend/scripts/seed.ts`
- **Description:** 13 console statements found. Remove before production.

### LOW: Debug Statements
- **File:** `cause-pots/backend/src/index.ts`
- **Description:** 6 console statements found. Remove before production.

### LOW: Debug Statements
- **File:** `cause-pots/contract/tests/contract.ts`
- **Description:** 20 console statements found. Remove before production.

## Design Patterns

### Factory
Creates objects without specifying exact class. Enables loose coupling and extensibility.

**Files:** `database.ts`, `README.md`, `contract.ts`, `TECHNICAL-GUIDE.md`, `pots.ts`

### Observer/Event
Defines a subscription mechanism for event-driven architecture. Great for decoupling.

**Files:** `index.ts`

### Custom Hooks
React hooks for reusable stateful logic. Promotes code reuse and separation of concerns.

**Files:** `TECHNICAL-GUIDE.md`

### Context Provider
React Context for global state. Alternative to prop drilling.

**Files:** `deploy.ts`, `contract.ts`, `TECHNICAL-GUIDE.md`

## Anti-Patterns

### Long File
Files over 500 lines are harder to maintain. Consider breaking into smaller modules.

**Affected files:** `pots.ts`, `contract.ts`

## Architecture Issues

### 1 Highly Coupled
Files imported by 8+ others

**Affected:** `TECHNICAL-GUIDE.md (20 imports)`

### 1 Circular Dependencies
Files that import each other

**Affected:** `README.md ↔ TECHNICAL-GUIDE.md`

### 4 Similar Code Blocks
Copy-paste code detected

**Affected:** `get, all, start`, `beginTransaction, commit, rollback, close, initializeDatabase`, `getPotPDA, getContributorPDA, addContributorToPot`, `updateFriend, createPot, updatePot, getUserById, getUserByAddress, getAllUsers`

### 3 High Complexity Files
Files with complexity score >30

**Affected:** `pots.ts (106)`, `users.ts (52)`, `friends.ts (41)`

## File Details

| File | Folder | Layer | Lines | Functions |
|------|--------|-------|-------|----------|
| `pull_request_template.md` | .github | note | 89 | 0 |
| `README.md` | root | note | 36 | 0 |
| `README.md` | cause-pots | note | 140 | 0 |
| `TODO.txt` | cause-pots | utils | 13 | 0 |
| `.env` | cause-pots/backend | utils | 13 | 0 |
| `.gitignore` | cause-pots/backend | utils | 33 | 0 |
| `README.md` | cause-pots/backend | note | 133 | 0 |
| `package-lock.json` | cause-pots/backend | utils | 4289 | 0 |
| `package.json` | cause-pots/backend | utils | 40 | 0 |
| `seed.ts` | cause-pots/backend/scripts | utils | 73 | 1 |
| `database.ts` | cause-pots/backend/src/db | data | 174 | 9 |
| `init.ts` | cause-pots/backend/src/db | utils | 20 | 1 |
| `schema.sql` | cause-pots/backend/src/db | data | 107 | 0 |
| `index.ts` | cause-pots/backend/src | utils | 92 | 1 |
| `activities.ts` | cause-pots/backend/src/routes | utils | 96 | 0 |
| `friends.ts` | cause-pots/backend/src/routes | utils | 246 | 0 |
| `pots.ts` | cause-pots/backend/src/routes | utils | 629 | 1 |
| `users.ts` | cause-pots/backend/src/routes | utils | 300 | 0 |
| `index.ts` | cause-pots/backend/src/types | utils | 114 | 0 |
| `domain.ts` | cause-pots/backend/src/utils | utils | 71 | 3 |
| `tsconfig.json` | cause-pots/backend | utils | 25 | 0 |
| `.gitignore` | cause-pots/contract | utils | 8 | 0 |
| `Anchor.toml` | cause-pots/contract | utils | 20 | 0 |
| `Cargo.lock` | cause-pots/contract | utils | 1573 | 0 |
| `Cargo.toml` | cause-pots/contract | utils | 15 | 0 |
| `README.md` | cause-pots/contract | note | 344 | 0 |
| `deploy.ts` | cause-pots/contract/migrations | data | 13 | 0 |
| `package.json` | cause-pots/contract | utils | 21 | 0 |
| `Cargo.toml` | cause-pots/contract/programs/contract | utils | 29 | 0 |
| `lib.rs` | cause-pots/contract/programs/contract/src | utils | 425 | 5 |
| `rust-toolchain.toml` | cause-pots/contract | utils | 5 | 0 |
| `contract.ts` | cause-pots/contract/tests | test | 928 | 4 |
| `tsconfig.json` | cause-pots/contract | utils | 11 | 0 |
| `yarn.lock` | cause-pots/contract | utils | 1145 | 0 |
| `.env` | cause-pots/frontend | utils | 5 | 0 |
| `.gitignore` | cause-pots/frontend | utils | 42 | 0 |
| `.prettierrc` | cause-pots/frontend | utils | 8 | 0 |
| `settings.json` | cause-pots/frontend/.vscode | config | 8 | 0 |
| `README.md` | cause-pots/frontend | note | 131 | 0 |
| `TECHNICAL-GUIDE.md` | cause-pots/frontend | note | 930 | 0 |
| `README.md` | cause-pots/frontend/api | note | 59 | 0 |
| `activities.ts` | cause-pots/frontend/api | services | 44 | 4 |
| `friends.ts` | cause-pots/frontend/api | services | 82 | 6 |
| `index.ts` | cause-pots/frontend/api | services | 6 | 0 |
| `pots.ts` | cause-pots/frontend/api | services | 168 | 12 |
| `types.ts` | cause-pots/frontend/api | services | 131 | 0 |
| `users.ts` | cause-pots/frontend/api | services | 86 | 5 |
| `app.json` | cause-pots/frontend | utils | 0 | 0 |
| `BACKEND_INTEGRATION.md` | cause-pots/frontend/docs | note | 0 | 0 |
| `eas.json` | cause-pots/frontend | utils | 0 | 0 |
| `contract.json` | cause-pots/frontend/idl | utils | 0 | 0 |
| `mise.toml` | cause-pots/frontend | utils | 0 | 0 |
| `package-lock.json` | cause-pots/frontend | utils | 0 | 0 |
| `package.json` | cause-pots/frontend | utils | 0 | 0 |
| `tsconfig.json` | cause-pots/frontend | utils | 0 | 0 |
| `README-TEMPLATE.md` | contributing | note | 0 | 0 |
| `README.md` | contributing | note | 0 | 0 |
| `ROOT-README-TEMPLATE.md` | contributing | note | 0 | 0 |
| `SAMPLE-APP-GUIDE.md` | contributing | note | 0 | 0 |
| `SUBMODULE-README-TEMPLATE.md` | contributing | note | 0 | 0 |
| `README.md` | settle | note | 0 | 0 |
| `.env` | settle/backend | utils | 0 | 0 |
| `.gitignore` | settle/backend | utils | 0 | 0 |
| `README.md` | settle/backend | note | 0 | 0 |
| `package-lock.json` | settle/backend | utils | 0 | 0 |
| `package.json` | settle/backend | utils | 0 | 0 |
| `schema.sql` | settle/backend/src/db | data | 0 | 0 |
| `.env` | settle/frontend | utils | 0 | 0 |
| `.gitignore` | settle/frontend | utils | 0 | 0 |
| `README.md` | settle/frontend | note | 0 | 0 |
| `TECHNICAL-GUIDE.md` | settle/frontend | note | 0 | 0 |
| `README.md` | settle/frontend/apis | note | 0 | 0 |
| `app.json` | settle/frontend | utils | 0 | 0 |
| `eas.json` | settle/frontend | utils | 0 | 0 |
| `package-lock.json` | settle/frontend | utils | 0 | 0 |
| `package.json` | settle/frontend | utils | 0 | 0 |
| `tsconfig.json` | settle/frontend | utils | 0 | 0 |
| `README.md` | skr-address-resolution | note | 0 | 0 |
| `.gitignore` | skr-address-resolution/backend | utils | 0 | 0 |
| `README.md` | skr-address-resolution/backend | note | 0 | 0 |
| `package-lock.json` | skr-address-resolution/backend | utils | 0 | 0 |
| `package.json` | skr-address-resolution/backend | utils | 0 | 0 |
| `tsconfig.json` | skr-address-resolution/backend | utils | 0 | 0 |
| `.gitignore` | skr-address-resolution/frontend | utils | 0 | 0 |
| `.prettierrc` | skr-address-resolution/frontend | utils | 0 | 0 |
| `README.md` | skr-address-resolution/frontend | note | 0 | 0 |
| `app.json` | skr-address-resolution/frontend | utils | 0 | 0 |
| `arrow-transition-original.json` | skr-address-resolution/frontend/assets/lottie | utils | 0 | 0 |
| `arrow-transition.json` | skr-address-resolution/frontend/assets/lottie | utils | 0 | 0 |
| `eas.json` | skr-address-resolution/frontend | utils | 0 | 0 |
| `package-lock.json` | skr-address-resolution/frontend | utils | 0 | 0 |
| `package.json` | skr-address-resolution/frontend | utils | 0 | 0 |
| `tsconfig.json` | skr-address-resolution/frontend | utils | 0 | 0 |
| `.env.example` | skr-staking | utils | 0 | 0 |
| `.gitignore` | skr-staking | utils | 0 | 0 |
| `.prettierrc` | skr-staking | utils | 0 | 0 |
| `README.md` | skr-staking | note | 0 | 0 |
| `app.json` | skr-staking | utils | 0 | 0 |
| `package.json` | skr-staking | utils | 0 | 0 |
| `idl.json` | skr-staking/program | utils | 0 | 0 |

*...and 2 more files*
