# Huellazo Integration Architecture

This document describes the high-level connection between the three main layers of the Huellazo application: the Mobile App, the FastAPI Backend, and the Anchor Smart Contracts. Its purpose is to explicitly declare the integration points so that code analysis tools can infer the architectural graph.

## Mobile to Backend

The **Mobile App** (`mobile/`) communicates with the **Backend** (`backend/`) via REST API calls.
- The `mobile/api/huellazo.ts` client makes HTTP requests to the FastAPI backend.
- The `backend/app/routers/` handle incoming requests from the mobile app (e.g., retrieving geofenced locations or caching user activities).

## Backend to Anchor

The **Backend** (`backend/`) reads from and occasionally writes to the **Anchor Smart Contracts** (`anchor/`).
- The `backend/app/services/solana.py` service uses the Solana RPC to read the state of the `huellazo` program (`anchor/programs/huellazo/src/lib.rs`).
- The backend verifies transactions and queries the blockchain to keep its local database in sync with on-chain data.

## Mobile to Anchor

The **Mobile App** (`mobile/`) can also interact directly with the **Anchor Smart Contracts** (`anchor/`) for user-signed transactions.
- The `mobile/hooks/use-huellazo-program.ts` hook uses the `@solana/web3.js` and `@project-serum/anchor` libraries to build and send transactions directly to the `huellazo` program.
- Users sign transactions directly on their mobile device to mint passports or interact with places.
