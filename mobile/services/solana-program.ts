import { Buffer } from 'buffer';
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

import { Connection, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { idlHuellazo } from './idl-huellazo';

// --- Solana Devnet & Program Configuration ---
export const SOLANA_DEVNET_RPC = 'https://api.devnet.solana.com';
export const HUELLAZO_PROGRAM_ID = new PublicKey('4pioWVSCp5oSbxbeRbquccusTkvT6Z9B8jTg7j2XXNVk');

// --- SPL Token Program & HZ Token Mint Configuration ---
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const HUELLAZO_TOKEN_MINT = new PublicKey('HZ11111111111111111111111111111111111111111');

export const connection = new Connection(SOLANA_DEVNET_RPC, 'confirmed');

// Seeds constants matching Rust contract constants.rs
export const CONFIG_SEED = Buffer.from('config');
export const POAP_SEED = Buffer.from('poap');

/**
 * Derives the Config PDA for Huellazo Global State
 */
export function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([CONFIG_SEED], HUELLAZO_PROGRAM_ID);
}

/**
 * Derives the PoapState PDA for a user's specific token ID
 */
export function getPoapPda(userPublicKey: PublicKey, tokenId: number): [PublicKey, number] {
  // Convert token_id to 8-byte little endian buffer matching u64 in Rust
  const tokenIdBuffer = Buffer.alloc(8);
  tokenIdBuffer.writeBigUInt64LE(BigInt(tokenId), 0);

  return PublicKey.findProgramAddressSync(
    [POAP_SEED, userPublicKey.toBuffer(), tokenIdBuffer],
    HUELLAZO_PROGRAM_ID
  );
}

/**
 * Derives the Associated Token Account (ATA) for $HZ SPL Token for a user
 */
export function getAssociatedTokenAddress(
  owner: PublicKey,
  mint: PublicKey = HUELLAZO_TOKEN_MINT
): PublicKey {
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return ata;
}

/**
 * Encodes mint_place instruction data matching Anchor's instruction discriminator and args
 */
export function createMintPlaceInstructionData(
  tokenId: number,
  tokenUri: string,
  latitude: number,
  longitude: number,
  poapType: number
): Buffer {
  const discriminator = Buffer.from([19, 137, 245, 118, 149, 108, 12, 60]);
  
  const tokenIdBuf = Buffer.alloc(8);
  tokenIdBuf.writeBigUInt64LE(BigInt(tokenId), 0);

  const uriBytes = Buffer.from(tokenUri, 'utf-8');
  const uriLenBuf = Buffer.alloc(4);
  uriLenBuf.writeUInt32LE(uriBytes.length, 0);

  const latBuf = Buffer.alloc(8);
  latBuf.writeDoubleLE(latitude, 0);

  const lngBuf = Buffer.alloc(8);
  lngBuf.writeDoubleLE(longitude, 0);

  const typeBuf = Buffer.from([poapType]);

  return Buffer.concat([discriminator, tokenIdBuf, uriLenBuf, uriBytes, latBuf, lngBuf, typeBuf]);
}

/**
 * Encodes mint_business instruction data matching Anchor's instruction discriminator and args
 */
export function createMintBusinessInstructionData(
  tokenId: number,
  tokenUri: string,
  latitude: number,
  longitude: number,
  amountLamports: number
): Buffer {
  const discriminator = Buffer.from([209, 172, 85, 237, 98, 124, 73, 203]);

  const tokenIdBuf = Buffer.alloc(8);
  tokenIdBuf.writeBigUInt64LE(BigInt(tokenId), 0);

  const uriBytes = Buffer.from(tokenUri, 'utf-8');
  const uriLenBuf = Buffer.alloc(4);
  uriLenBuf.writeUInt32LE(uriBytes.length, 0);

  const latBuf = Buffer.alloc(8);
  latBuf.writeDoubleLE(latitude, 0);

  const lngBuf = Buffer.alloc(8);
  lngBuf.writeDoubleLE(longitude, 0);

  const amountBuf = Buffer.alloc(8);
  amountBuf.writeBigUInt64LE(BigInt(amountLamports), 0);

  return Buffer.concat([discriminator, tokenIdBuf, uriLenBuf, uriBytes, latBuf, lngBuf, amountBuf]);
}

export { idlHuellazo };
