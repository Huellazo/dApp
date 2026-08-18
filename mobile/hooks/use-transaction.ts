import { useState, useCallback } from 'react'
import { Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { Platform } from 'react-native'
import { useAuthorization } from '@/components/auth/useAuthorization'
import { AppConfig } from '@/constants/app-config'
import { Connection } from '@solana/web3.js'

export function useTransaction() {
  const { authorization } = useAuthorization()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const executeTransaction = useCallback(
    async (transaction: Transaction): Promise<string> => {
      setIsLoading(true)
      setError(null)

      try {
        const connection = new Connection(AppConfig.clusters[0].endpoint, 'confirmed');

        // Get latest blockhash and context slot
        const {
          context: { slot: minContextSlot },
          value: latestBlockhash,
        } = await connection.getLatestBlockhashAndContext()

        // Convert legacy Transaction to VersionedTransaction
        const messageV0 = new TransactionMessage({
          payerKey: transaction.feePayer!,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: transaction.instructions,
        }).compileToLegacyMessage()

        const versionedTransaction = new VersionedTransaction(messageV0)
        
        let signature = '';
        let signatures: any;
        let webSignature: string | undefined;

        if (Platform.OS === 'web') {
          const provider = (window as any).solana;
          if (!provider?.isPhantom) {
            throw new Error('Phantom wallet not found');
          }
          
          const { signature: txSig } = await provider.signAndSendTransaction(versionedTransaction);
          webSignature = txSig;
        } else {
          if (!authorization?.auth_token) {
            throw new Error('Wallet not authorized')
          }
          // Sign and send transaction via MWA
          signatures = await transact(async (wallet) => {
            await wallet.reauthorize({
              auth_token: authorization.auth_token,
              identity: { name: AppConfig.name, uri: AppConfig.uri },
            });

            // Mobile wallet adapter signature requests
            const signedTransactions = await wallet.signAndSendTransactions({
              transactions: [versionedTransaction],
              minContextSlot,
            });
            
            return signedTransactions;
          });
        }

        if (webSignature) {
          signature = webSignature;
        } else if (signatures && signatures.length > 0) {
          if (typeof signatures[0] === 'string') {
            signature = signatures[0];
          } else {
            // signatures is Uint8Array[] representing the 64-byte signature
            const bs58 = require('bs58')
            signature = bs58.default.encode(signatures[0]);
          }
        }

        if (!signature) {
          throw new Error('No signature returned from wallet');
        }

        console.log("SIGNATURE IS:" , signature);
        
        // Confirm transaction
        await connection.confirmTransaction(
          { signature, ...latestBlockhash },
          'confirmed'
        )

        setIsLoading(false)
        return signature
      } catch (err) {
        const error = err as Error
        setError(error)
        setIsLoading(false)
        throw error
      }
    },
    [authorization]
  )

  return {
    executeTransaction,
    isLoading,
    error,
  }
}

