import { PublicKey, TransactionSignature } from '@solana/web3.js'
import { useConnection } from '@/components/solana/use-connection'
import { useMutation } from '@tanstack/react-query'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { createTransaction } from '@/components/account/create-transaction'
import { useGetBalanceInvalidate } from './use-get-balance'
import { useAuthorization } from '@/components/auth/useAuthorization'
import { AppConfig } from '@/constants/app-config'
import { Platform } from 'react-native'

export function useTransferSol({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const { authorization } = useAuthorization()
  const invalidateBalance = useGetBalanceInvalidate({ address })

  return useMutation({
    mutationKey: ['transfer-sol', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash, minContextSlot } = await createTransaction({
          address,
          destination: input.destination,
          amount: input.amount,
          connection,
        })
        
        let signatures: any;
        let webSignature: string | undefined;

        if (Platform.OS === 'web') {
          const savedWallet = typeof window !== 'undefined' ? localStorage.getItem('huellazo_selected_wallet') : null;
          let provider: any = null;

          if (savedWallet === 'solflare' && (window as any).solflare) {
            provider = (window as any).solflare;
          } else if ((window as any).solflare?.isConnected) {
            provider = (window as any).solflare;
          } else {
            provider = (window as any).phantom?.solana || (window as any).solana;
          }

          if (!provider || typeof provider.signAndSendTransaction !== 'function') {
            throw new Error('No active Solana wallet found');
          }

          const { signature: txSig } = await provider.signAndSendTransaction(transaction);
          webSignature = txSig;
        } else {
          if (!authorization?.auth_token) {
            throw new Error('Wallet not authorized')
          }
          // Send transaction and await for signature via MWA
          signatures = await transact(async (wallet) => {
            await wallet.reauthorize({
              auth_token: authorization.auth_token,
              identity: { name: AppConfig.name, uri: AppConfig.uri },
            });

            return await wallet.signAndSendTransactions({
              transactions: [transaction],
              minContextSlot,
            });
          });
        }

        if (webSignature) {
          signature = webSignature;
        } else if (signatures && signatures.length > 0) {
          if (typeof signatures[0] === 'string') {
            signature = signatures[0];
          } else {
            const bs58 = require('bs58')
            signature = bs58.default.encode(signatures[0]);
          }
        }

        if (!signature) {
          throw new Error('No signature returned from wallet');
        }

        // Send transaction and await for signature
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log(signature)
        return signature
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`, signature)

        return
      }
    },
    onSuccess: async (signature) => {
      console.log(signature)
      await invalidateBalance()
    },
    onError: (error) => {
      console.error(`Transaction failed! ${error}`)
    },
  })
}

