import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import {
  getUmiClient,
  obtenerOMintarArbolMerkle,
  mintearCnftEstampa,
  listarCnftsPorOwner,
  esperarIndexacionCnft,
} from '@/services/cnft-service';
import type { CnftStampMetadataInput, MintCnftResult } from '@/services/cnft-service';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi';

export function useHuellazoCnft() {
  const { walletAddress, activeWebWallet, selectedAccount } = useAuth();
  const [isMintingCnft, setIsMintingCnft] = useState(false);
  const [lastCnftResult, setLastCnftResult] = useState<MintCnftResult | null>(null);
  const [cnftError, setCnftError] = useState<string | null>(null);

  const umi = useMemo(() => {
    const umiClient = getUmiClient();

    // Respect active connected wallet provider (Solflare / Phantom)
    if (typeof window !== 'undefined') {
      let provider = activeWebWallet;
      if (!provider) {
        if (selectedAccount?.label === 'Solflare' || (window as any).solflare?.isConnected) {
          provider = (window as any).solflare;
        } else if (selectedAccount?.label === 'Phantom' || (window as any).phantom?.solana?.isConnected) {
          provider = (window as any).phantom?.solana || (window as any).solana;
        } else {
          provider = (window as any).solflare || (window as any).phantom?.solana || (window as any).solana;
        }
      }

      if (provider && provider.publicKey) {
        try {
          umiClient.use(walletAdapterIdentity(provider));
        } catch {
          const keypair = generateSigner(umiClient);
          umiClient.use(signerIdentity(keypair));
        }
      } else {
        const keypair = generateSigner(umiClient);
        umiClient.use(signerIdentity(keypair));
      }
    } else {
      const keypair = generateSigner(umiClient);
      umiClient.use(signerIdentity(keypair));
    }

    return umiClient;
  }, [walletAddress, activeWebWallet, selectedAccount]);

  /**
   * Mints a Compressed NFT (cNFT) stamp on Solana Devnet via Metaplex Bubblegum V2 & Helius DAS API
   */
  const mintCnftStamp = useCallback(
    async (metadata: CnftStampMetadataInput): Promise<MintCnftResult | null> => {
      setIsMintingCnft(true);
      setCnftError(null);

      try {
        // 1. Retrieve or automatically create Merkle Tree on-chain on first mint
        const merkleTree = await obtenerOMintarArbolMerkle(umi);

        // 2. Mint Compressed NFT (cNFT) leaf in the tree, target owner = connected wallet (Solflare/Phantom)
        const providerPk = typeof window !== 'undefined'
          ? (activeWebWallet?.publicKey?.toBase58?.() ||
             (window as any).solflare?.publicKey?.toBase58?.() ||
             (window as any).phantom?.solana?.publicKey?.toBase58?.() ||
             (window as any).solana?.publicKey?.toBase58?.() ||
             (window as any).solflare?.publicKey?.toString?.() ||
             (window as any).phantom?.solana?.publicKey?.toString?.())
          : undefined;

        const targetAddress = walletAddress || providerPk || undefined;
        const result = await mintearCnftEstampa(umi, merkleTree, metadata, targetAddress);

        setLastCnftResult(result);

        // 3. Trigger async DAS indexer check in background
        esperarIndexacionCnft(umi, result.assetId).catch(console.warn);

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error minting Compressed NFT (cNFT)';
        console.warn('cNFT minting notice:', errorMsg);
        setCnftError(errorMsg);
        return null;
      } finally {
        setIsMintingCnft(false);
      }
    },
    [umi]
  );

  /**
   * Fetches all Compressed NFTs (cNFTs) owned by a user from the Helius DAS API
   */
  const fetchUserCnfts = useCallback(async (): Promise<any[]> => {
    if (!walletAddress) return [];
    return await listarCnftsPorOwner(umi, walletAddress);
  }, [umi, walletAddress]);

  return {
    umi,
    isMintingCnft,
    lastCnftResult,
    cnftError,
    mintCnftStamp,
    fetchUserCnfts,
  };
}
