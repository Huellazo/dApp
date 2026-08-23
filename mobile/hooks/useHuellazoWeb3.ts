import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useAuth } from '@/components/auth/auth-provider';
import { AppConfig } from '@/constants/app-config';
import {
  connection,
  HUELLAZO_PROGRAM_ID,
  HUELLAZO_TOKEN_MINT,
  getConfigPda,
  getPoapPda,
  getAssociatedTokenAddress,
  createMintPlaceInstructionData,
  buildSolanaPayTransaction,
} from '@/services/solana-program';
import { useHuellazoCnft } from '@/hooks/useHuellazoCnft';

export interface OnChainMintResult {
  success: boolean;
  signature?: string;
  poapPda?: string;
  userAta?: string;
  cnftAssetId?: string;
  cnftMerkleTree?: string;
  error?: string;
}

export function useHuellazoWeb3() {
  const { walletAddress, activeWebWallet, authorization, selectedAccount } = useAuth();
  const { mintCnftStamp } = useHuellazoCnft();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);

  const userPubkey = useMemo(() => {
    return walletAddress ? new PublicKey(walletAddress) : null;
  }, [walletAddress]);

  const hzUserAta = useMemo(() => {
    return userPubkey ? getAssociatedTokenAddress(userPubkey, HUELLAZO_TOKEN_MINT).toBase58() : null;
  }, [userPubkey]);

  /**
   * Helper to sign and send transactions maintaining exact persistent wallet selection (Solflare / Phantom)
   */
  const executeWalletTransaction = useCallback(
    async (transaction: Transaction, activePubkey: PublicKey): Promise<string> => {
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = activePubkey;

      // 1. Web Browser (Uses persistent activeWebWallet or connected Solflare / Phantom provider)
      if (Platform.OS === 'web') {
        let provider = activeWebWallet;

        if (!provider && typeof window !== 'undefined') {
          if (selectedAccount?.label === 'Solflare' || (window as any).solflare?.isConnected) {
            provider = (window as any).solflare;
          } else if (selectedAccount?.label === 'Phantom' || (window as any).phantom?.solana?.isConnected) {
            provider = (window as any).phantom?.solana || (window as any).solana;
          } else {
            provider = (window as any).solflare || (window as any).phantom?.solana || (window as any).solana;
          }
        }

        if (provider && typeof provider.signAndSendTransaction === 'function') {
          const { signature } = await provider.signAndSendTransaction(transaction);
          return signature;
        } else if (provider && typeof provider.signTransaction === 'function') {
          const signed = await provider.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signed.serialize());
          return signature;
        }
      }

      // 2. Mobile Native (Mobile Wallet Adapter Protocol with persistent auth_token)
      if (Platform.OS !== 'web') {
        const resultSignature = await transact(async (wallet) => {
          if (authorization?.auth_token) {
            await wallet.reauthorize({
              auth_token: authorization.auth_token,
              identity: {
                name: AppConfig.name,
                uri: AppConfig.uri,
              },
            });
          } else {
            await wallet.authorize({
              cluster: 'devnet',
              identity: {
                name: AppConfig.name,
                uri: AppConfig.uri,
              },
            });
          }

          const [signedTx] = await wallet.signTransactions({
            transactions: [transaction],
          });

          const txSig = await connection.sendRawTransaction(signedTx.serialize());
          return txSig;
        });

        return resultSignature;
      }

      throw new Error('NO_WALLET');
    },
    [activeWebWallet, authorization, selectedAccount]
  );

  /**
   * Mints a Tourist POAP stamp on-chain and mints a Metaplex Bubblegum V2 Compressed NFT (cNFT)
   */
  const mintPlaceOnChain = useCallback(
    async (params: {
      tokenId: number;
      tokenUri: string;
      latitude: number;
      longitude: number;
      placeName?: string;
      allowSimulationFallback?: boolean;
    }): Promise<OnChainMintResult> => {
      setIsSubmitting(true);
      let cnftRes: any = null;

      // Also mint a Compressed NFT (cNFT) stamp into the Merkle tree via Bubblegum V2
      try {
        cnftRes = await mintCnftStamp({
          name: params.placeName || `Estampa #${params.tokenId}`,
          uri: params.tokenUri,
          sellerFeeBasisPoints: 0,
        });
      } catch (e) {
        console.warn('cNFT minting notice:', e);
      }

      if (!userPubkey) {
        if (params.allowSimulationFallback) {
          const simulatedSig = `simulated_devnet_tx_${Date.now()}`;
          const [poapPdaPk] = getPoapPda(new PublicKey('11111111111111111111111111111111'), params.tokenId);
          setLastSignature(simulatedSig);
          setIsSubmitting(false);
          return {
            success: true,
            signature: simulatedSig,
            poapPda: poapPdaPk.toBase58(),
            cnftAssetId: cnftRes?.assetId?.toString(),
            cnftMerkleTree: cnftRes?.merkleTree?.toString(),
          };
        }
        setIsSubmitting(false);
        return { success: false, error: 'NO_WALLET' };
      }

      try {
        const [configPdaPk] = getConfigPda();
        const [poapPdaPk] = getPoapPda(userPubkey, params.tokenId);

        const data = createMintPlaceInstructionData(
          params.tokenId,
          params.tokenUri,
          params.latitude,
          params.longitude,
          0 // 0 = Tourism POAP
        );

        const instruction = new TransactionInstruction({
          keys: [
            { pubkey: configPdaPk, isSigner: false, isWritable: true },
            { pubkey: poapPdaPk, isSigner: false, isWritable: true },
            { pubkey: userPubkey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId: HUELLAZO_PROGRAM_ID,
          data,
        });

        const tx = new Transaction().add(instruction);
        const signature = await executeWalletTransaction(tx, userPubkey);
        setLastSignature(signature);

        return {
          success: true,
          signature,
          poapPda: poapPdaPk.toBase58(),
          cnftAssetId: cnftRes?.assetId?.toString(),
          cnftMerkleTree: cnftRes?.merkleTree?.toString(),
        };
      } catch (err) {
        if (params.allowSimulationFallback) {
          const simulatedSig = `devnet_fallback_tx_${Date.now()}`;
          const [poapPdaPk] = getPoapPda(userPubkey, params.tokenId);
          setLastSignature(simulatedSig);
          return {
            success: true,
            signature: simulatedSig,
            poapPda: poapPdaPk.toBase58(),
            cnftAssetId: cnftRes?.assetId?.toString(),
            cnftMerkleTree: cnftRes?.merkleTree?.toString(),
          };
        }
        const errorMsg = err instanceof Error ? err.message : 'Error al mintear POAP en Solana Devnet';
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [userPubkey, executeWalletTransaction, mintCnftStamp]
  );

  /**
   * Mints a Commercial Business POAP and transfers SOL payment to merchant
   */
  const mintBusinessOnChain = useCallback(
    async (params: {
      businessWallet?: string;
      amountLamports: number;
      businessName: string;
      latitude: number;
      longitude: number;
      allowSimulationFallback?: boolean;
    }): Promise<OnChainMintResult> => {
      setIsSubmitting(true);
      const recipientStr = params.businessWallet || '8XbN77QkP11111111111111111111111111111111111';
      let recipientPubkey: PublicKey;

      try {
        recipientPubkey = new PublicKey(recipientStr);
      } catch {
        recipientPubkey = new PublicKey('8XbN77QkP11111111111111111111111111111111111');
      }

      if (!userPubkey) {
        if (params.allowSimulationFallback) {
          const simulatedSig = `solana_pay_simulated_${Date.now()}`;
          setLastSignature(simulatedSig);
          setIsSubmitting(false);
          return { success: true, signature: simulatedSig };
        }
        setIsSubmitting(false);
        return { success: false, error: 'NO_WALLET' };
      }

      try {
        const solanaPayTx = buildSolanaPayTransaction(
          userPubkey,
          recipientPubkey,
          params.amountLamports
        );

        const signature = await executeWalletTransaction(solanaPayTx, userPubkey);
        setLastSignature(signature);

        return { success: true, signature };
      } catch (err) {
        if (params.allowSimulationFallback) {
          const simulatedSig = `solana_pay_fallback_${Date.now()}`;
          setLastSignature(simulatedSig);
          return { success: true, signature: simulatedSig };
        }
        const errorMsg = err instanceof Error ? err.message : 'Error en el pago de Solana Pay';
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [userPubkey, executeWalletTransaction]
  );

  return {
    walletAddress,
    userPubkey,
    hzUserAta,
    isSubmitting,
    lastSignature,
    mintPlaceOnChain,
    mintBusinessOnChain,
  };
}
