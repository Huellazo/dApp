import { PublicKey } from '@solana/web3.js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useConnection } from '../solana/use-connection'

export function useGetBalanceQueryKey({ address, endpoint }: { address?: PublicKey | null; endpoint: string }) {
  return ['get-balance', { endpoint, address: address?.toString() ?? null }]
}

export function useGetBalance({ address }: { address?: PublicKey | null }) {
  const connection = useConnection()
  const queryKey = useGetBalanceQueryKey({ address, endpoint: connection.rpcEndpoint })

  return useQuery({
    queryKey,
    queryFn: () => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      return connection.getBalance(address)
    },
    enabled: !!address,
  })
}

export function useGetBalanceInvalidate({ address }: { address?: PublicKey | null }) {
  const connection = useConnection()
  const queryKey = useGetBalanceQueryKey({ address, endpoint: connection.rpcEndpoint })
  const client = useQueryClient()

  return () => client.invalidateQueries({ queryKey })
}
