import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Umi, PublicKey as UmiPublicKey } from '@metaplex-foundation/umi';
import { createUmi as createBaseUmi, generateSigner, publicKey as toUmiPublicKey, none } from '@metaplex-foundation/umi';
import { defaultPlugins } from '@metaplex-foundation/umi-bundle-defaults';
import { base58 } from '@metaplex-foundation/umi/serializers';
import {
  createTreeV2,
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import type { DasApiInterface } from '@metaplex-foundation/digital-asset-standard-api';

// --- Helius Devnet DAS RPC Endpoint read securely from process.env ---
export const HELIUS_DEVNET_DAS_RPC =
  process.env.EXPO_PUBLIC_HELIUS_DAS_RPC || 'https://api.devnet.solana.com';

export const MERKLE_TREE_STORAGE_KEY = 'huellazo:merkle-tree:devnet:v1';

export type UmiDas = Umi & { rpc: Umi['rpc'] & DasApiInterface };

export const DEFAULT_MAX_DEPTH = 14; // 2^14 = 16,384 cNFTs per tree
export const DEFAULT_MAX_BUFFER_SIZE = 64;

export interface CnftStampMetadataInput {
  name: string;
  symbol?: string;
  uri: string;
  location?: string;
  poiId?: string;
  sellerFeeBasisPoints?: number;
}

export interface CreateTreeResult {
  merkleTree: UmiPublicKey;
  signature: string;
}

export interface MintCnftResult {
  assetId: UmiPublicKey;
  leafIndex: number;
  signature: string;
  merkleTree: UmiPublicKey;
}

const sigToString = (signature: Uint8Array): string => base58.deserialize(signature)[0];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Initializes a Umi instance registered with mplBubblegum & dasApi plugins
 */
export function getUmiClient(customRpcUrl?: string): UmiDas {
  const rpcUrl = customRpcUrl || HELIUS_DEVNET_DAS_RPC;
  const umi = createBaseUmi()
    .use(defaultPlugins(rpcUrl))
    .use(mplBubblegum())
    .use(dasApi());
  
  return umi as UmiDas;
}

/**
 * Creates an on-chain Concurrent Merkle Tree for Compressed NFTs (cNFTs)
 */
export async function crearArbolMerkle(
  umi: Umi,
  maxDepth = DEFAULT_MAX_DEPTH,
  maxBufferSize = DEFAULT_MAX_BUFFER_SIZE
): Promise<CreateTreeResult> {
  const merkleTreeSigner = generateSigner(umi);

  const builder = await createTreeV2(umi, {
    merkleTree: merkleTreeSigner,
    maxDepth,
    maxBufferSize,
  });

  const res = await builder.sendAndConfirm(umi);
  const signature = sigToString(res.signature);

  return {
    merkleTree: merkleTreeSigner.publicKey,
    signature,
  };
}

/**
 * Retrieves the persisted Merkle Tree or creates a new one automatically on first mint
 */
export async function obtenerOMintarArbolMerkle(umi: Umi): Promise<UmiPublicKey> {
  try {
    const saved = await AsyncStorage.getItem(MERKLE_TREE_STORAGE_KEY);
    if (saved) {
      return toUmiPublicKey(saved);
    }
  } catch (err) {
    console.warn('Could not read saved Merkle tree:', err);
  }

  console.log('🌲 Automatic cNFT Merkle Tree Initialization on Solana Devnet...');
  const { merkleTree } = await crearArbolMerkle(umi);
  const treeAddrStr = merkleTree.toString();

  try {
    await AsyncStorage.setItem(MERKLE_TREE_STORAGE_KEY, treeAddrStr);
  } catch (err) {
    console.warn('Could not save Merkle tree address:', err);
  }

  return merkleTree;
}

/**
 * Mints a Compressed NFT (cNFT) stamp into the Merkle Tree on Solana Devnet
 */
export async function mintearCnftEstampa(
  umi: Umi,
  merkleTree: UmiPublicKey,
  input: CnftStampMetadataInput,
  targetOwnerAddress?: string
): Promise<MintCnftResult> {
  const leafOwner = targetOwnerAddress ? toUmiPublicKey(targetOwnerAddress) : umi.identity.publicKey;

  const builder = await mintV2(umi, {
    merkleTree,
    leafOwner,
    metadata: {
      name: input.name,
      uri: input.uri,
      sellerFeeBasisPoints: input.sellerFeeBasisPoints ?? 0,
      collection: none(),
      creators: [
        {
          address: umi.identity.publicKey,
          verified: true,
          share: 100,
        },
      ],
    },
  });

  const res = await builder.sendAndConfirm(umi);
  const signature = sigToString(res.signature);

  // Extract assetId and leafIndex directly from mintV2 transaction
  const leaf = await parseLeafFromMintV2Transaction(umi, res.signature);

  return {
    assetId: leaf.id,
    leafIndex: Number(leaf.nonce),
    signature,
    merkleTree,
  };
}

/**
 * Retries querying the DAS API until indexer parses the minted cNFT
 */
export async function esperarIndexacionCnft(
  umi: UmiDas,
  assetId: UmiPublicKey,
  maxRetries = 6,
  delayMs = 2000
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const asset = await umi.rpc.getAsset(assetId);
      if (asset) return asset;
    } catch {
      // Retrying
    }
    await sleep(delayMs);
  }
  return null;
}

/**
 * Lists all Compressed NFTs (cNFTs) owned by a user via the Helius DAS API
 */
export async function listarCnftsPorOwner(
  umi: UmiDas,
  ownerAddress: string
): Promise<any[]> {
  try {
    const ownerPk = toUmiPublicKey(ownerAddress);
    const response = await umi.rpc.getAssetsByOwner({
      owner: ownerPk,
      page: 1,
      limit: 1000,
    });
    return response.items || [];
  } catch (err) {
    console.warn('DAS getAssetsByOwner notice:', err);
    return [];
  }
}
