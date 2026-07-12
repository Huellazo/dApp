import { clusterApiUrl } from '@solana/web3.js'
import type { Chain } from '@solana-mobile/mobile-wallet-adapter-protocol'

export type Cluster = {
  id: Chain
  name: string
  endpoint: string
}

export class AppConfig {
  static name = 'Huellazo'
  static uri = 'https://huellazo.app'

  // Blockchain configuration
  static programId = 'CTtGEyhWsub71K9bDKJZbaBDNbqNk54fUuh4pLB8M5sR'

  static clusters: Cluster[] = [
    {
      id: 'solana:devnet',
      name: 'Devnet',
      endpoint: clusterApiUrl('devnet'),
    },
    {
      id: 'solana:testnet',
      name: 'Testnet',
      endpoint: clusterApiUrl('testnet'),
    },
  ]
}
