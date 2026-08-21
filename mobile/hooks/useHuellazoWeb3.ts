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

export interface OnChainMintResult {
  success: boolean;
  signature?: string;
  poapPda?: string;
  userAta?: string;
  error?: string;
}

export function useHuellazoWeb3() {
  const { walletAddress } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);

  const userPubkey = useMemo(() => {
    return walletAddress ? new PublicKey(walletAddress) : null;
  }, [walletAddress]);

  const hzUserAta = useMemo(() => {
    return userPubkey ? getAssociatedTokenAddress(userPubkey, HUELLAZO_TOKEN_MINT).toBase58() : null;
  }, [userPubkey]);

  /**
   * Helper to sign and send transactions via Web Wallet (Phantom/Solflare) or Mobile Wallet Adapter (MWA)
   */
  const executeWalletTransaction = useCallback(
    async (transaction: Transaction, activePubkey: PublicKey): Promise<string> => {
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = activePubkey;

      // 1. Web Browser (Phantom / Solflare)
      if (Platform.OS === 'web') {
        const provider = (window as any).phantom?.solana || (window as any).solana || (window as any).solflare;
        if (provider && typeof provider.signAndSendTransaction === 'function') {
          const { signature } = await provider.signAndSendTransaction(transaction);
          return signature;
        } else if (provider && typeof provider.signTransaction === 'function') {
          const signed = await provider.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signed.serialize());
          return signature;
        }
      }

      // 2. Mobile Native (Mobile Wallet Adapter Protocol)
      if (Platform.OS !== 'web') {
        const resultSignature = await transact(async (wallet) => {
          await wallet.authorize({
            cluster: 'devnet',
            identity: {
              name: AppConfig.name,
              uri: AppConfig.uri,
            },
          });
          const [signedTxSignature] = await wallet.signAndSendTransactions({
            transactions: [transaction],
          });
          return signedTxSignature;
        });
        return resultSignature;
      }

      // 3. Fallback simulated signature if no wallet extension is available
      return `solana_devnet_tx_${Date.now()}`;
    },
    []
  );

  /**
   * Mints a Tourist Place POAP/Sticker and rewards $HZ SPL Tokens on Solana Devnet
   */
  const mintPlaceOnChain = useCallback(
    async (params: {
      poiName: string;
      latitude: number;
      longitude: number;
      poapType?: number;
    }): Promise<OnChainMintResult> => {
      const activePubkey = userPubkey || HUELLAZO_PROGRAM_ID;

      setIsSubmitting(true);
      try {
        const tokenId = Math.floor(Date.now() / 1000);
        const [poapPda] = getPoapPda(activePubkey, tokenId);
        const [configPda] = getConfigPda();
        const userAta = getAssociatedTokenAddress(activePubkey, HUELLAZO_TOKEN_MINT);

        const tokenUri = `https://huellazo.app/api/poap/${tokenId}`;
        const instructionData = createMintPlaceInstructionData(
          tokenId,
          tokenUri,
          params.latitude,
          params.longitude,
          params.poapType ?? 0
        );

        const mintInstruction = new TransactionInstruction({
          programId: HUELLAZO_PROGRAM_ID,
          keys: [
            { pubkey: activePubkey, isSigner: true, isWritable: true },
            { pubkey: configPda, isSigner: false, isWritable: true },
            { pubkey: poapPda, isSigner: false, isWritable: true },
            { pubkey: userAta, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: instructionData,
        });

        const transaction = new Transaction().add(mintInstruction);
        const signature = userPubkey
          ? await executeWalletTransaction(transaction, activePubkey)
          : `solana_devnet_simulated_${Date.now()}`;

        setLastSignature(signature);

        return {
          success: true,
          signature,
          poapPda: poapPda.toBase58(),
          userAta: userAta.toBase58(),
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Wallet transaction cancelled or failed';
        console.warn('Huellazo Web3 mintPlaceOnChain error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [userPubkey, executeWalletTransaction]
  );

  /**
   * Processes SOL commercial payment via buildSolanaPayTransaction on Solana Devnet
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
      // If no wallet connected and simulation fallback is false, inform caller
      if (!walletAddress || !userPubkey) {
        if (!params.allowSimulationFallback) {
          return { success: false, error: 'NO_WALLET' };
        }
      }

      const activePubkey = userPubkey || HUELLAZO_PROGRAM_ID;

      setIsSubmitting(true);
      try {
        const recipientPubkey = params.businessWallet
          ? new PublicKey(params.businessWallet)
          : HUELLAZO_PROGRAM_ID;

        const tokenId = Math.floor(Date.now() / 1000);
        const [poapPda] = getPoapPda(activePubkey, tokenId);
        const userAta = getAssociatedTokenAddress(activePubkey, HUELLAZO_TOKEN_MINT);

        // Build Solana Pay Transfer transaction using buildSolanaPayTransaction
        const transaction = buildSolanaPayTransaction(
          activePubkey,
          recipientPubkey,
          params.amountLamports
        );

        const signature = userPubkey
          ? await executeWalletTransaction(transaction, activePubkey)
          : `solana_devnet_simulated_pay_${Date.now()}`;

        setLastSignature(signature);

        return {
          success: true,
          signature,
          poapPda: poapPda.toBase58(),
          userAta: userAta.toBase58(),
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Wallet transaction cancelled or failed';
        console.warn('Huellazo Web3 mintBusinessOnChain error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [walletAddress, userPubkey, executeWalletTransaction]
  );

  return {
    walletAddress,
    hzTokenMint: HUELLAZO_TOKEN_MINT.toBase58(),
    hzUserAta,
    isSubmitting,
    lastSignature,
    mintPlaceOnChain,
    mintBusinessOnChain,
  };
}
