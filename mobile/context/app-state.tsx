import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

// --- NFT Data Types ---
export type NftId = 'cenote' | 'museo' | 'cafe' | 'hotel' | 'reserva' | 'artesanal'

export interface NftItem {
  id: NftId
  name: string
  collectionName: string
  placeName: string
  image: any
  xpReward: number
  solCost: number
}

// --- Place Data Types ---
export interface Place {
  id: string
  name: string
  type: string
  tier: 1 | 2
  color: string
  solCost: number
  xpReward: number
  nftId?: NftId
}

export interface MintablePoi {
  id: string
  name: string
  description?: string
  category?: string
  reward?: number
  nftReward?: string
}

export interface EarnedSolanaToken {
  id: string
  poiId: string
  name: string
  symbol: string
  collectionName: string
  location: string
  description: string
  reward: number
  mintAddress: string
  transactionSignature: string
  network: 'solana-devnet-simulated'
  mintedAt: string
}

// --- Context Type ---
interface AppState {
  // State
  xp: number
  points: number
  level: string
  passportMinted: boolean
  activeNfts: NftId[]
  earnedTokens: EarnedSolanaToken[]

  // Actions
  addXp: (amount: number) => void
  spendPoints: (amount: number) => boolean
  unlockNft: (id: NftId) => void
  mintPassport: () => void
  mintPoiToken: (poi: MintablePoi) => { token: EarnedSolanaToken; alreadyMinted: boolean }
}

const EARNED_TOKENS_STORAGE_KEY = 'huellazo:earned-solana-tokens:v1'
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function createMockBase58Address(length: number): string {
  return Array.from({ length }, () => BASE58_ALPHABET[Math.floor(Math.random() * BASE58_ALPHABET.length)]).join('')
}

function createSolanaTokenFromPoi(poi: MintablePoi): EarnedSolanaToken {
  const reward = poi.reward ?? 50
  const tokenName = poi.nftReward ?? `${poi.name} Huellazo Token`

  return {
    id: `${poi.id}-${Date.now()}`,
    poiId: poi.id,
    name: tokenName,
    symbol: 'HUELLA',
    collectionName: 'Huellazo Passport',
    location: poi.name,
    description:
      poi.description ??
      `Token de prueba obtenido por validar una visita real en ${poi.name} dentro de Huellazo.`,
    reward,
    mintAddress: createMockBase58Address(44),
    transactionSignature: createMockBase58Address(88),
    network: 'solana-devnet-simulated',
    mintedAt: new Date().toISOString(),
  }
}

// --- NFT Catalog ---
export const NFT_CATALOG: NftItem[] = [
  {
    id: 'cenote',
    name: 'NFT: Agua Pura',
    collectionName: 'Cenote Sagrado',
    placeName: 'Cenote Sagrado',
    image: require('@/assets/images/water.png'),
    xpReward: 300,
    solCost: 0.05,
  },
  {
    id: 'museo',
    name: 'NFT: Cultura Local',
    collectionName: 'Museo Regional',
    placeName: 'Museo Regional',
    image: require('@/assets/images/negocio2.png'),
    xpReward: 100,
    solCost: 0.01,
  },
  {
    id: 'cafe',
    name: 'NFT: Grano de Oro',
    collectionName: 'Café de Especialidad',
    placeName: 'Café Local',
    image: require('@/assets/images/coffee.png'),
    xpReward: 50,
    solCost: 0.005,
  },
  {
    id: 'hotel',
    name: 'NFT: Eco Estancia',
    collectionName: 'Hotel Boutique',
    placeName: 'Hotel Boutique Eco',
    image: require('@/assets/images/hotel.png'),
    xpReward: 200,
    solCost: 0.08,
  },
  {
    id: 'reserva',
    name: 'NFT: Fauna Local',
    collectionName: 'Reserva Biósfera',
    placeName: 'Reserva Biósfera',
    image: require('@/assets/images/negocio1.png'),
    xpReward: 500,
    solCost: 0.1,
  },
  {
    id: 'artesanal',
    name: 'NFT: Artesano',
    collectionName: 'Mercado Artesanal',
    placeName: 'Mercado Artesanal',
    image: require('@/assets/images/negocio3.png'),
    xpReward: 120,
    solCost: 0.02,
  },
]

// --- Places Catalog ---
export const PLACES_CATALOG: Place[] = [
  { id: 'museo', name: 'Museo Regional', type: 'Turístico · Nivel 1', tier: 1, color: '#F2CC8F', solCost: 0.01, xpReward: 100, nftId: 'museo' },
  { id: 'cenote', name: 'Cenote Sagrado', type: 'Ecológico · Nivel 2', tier: 2, color: '#81B29A', solCost: 0.05, xpReward: 300, nftId: 'cenote' },
  { id: 'cafe', name: 'Café Local', type: 'Comercio · Nivel 1', tier: 1, color: '#FFFFFF', solCost: 0.005, xpReward: 50, nftId: 'cafe' },
  { id: 'reserva', name: 'Reserva Biósfera', type: 'Ecológico · Nivel 2', tier: 2, color: '#E07A5F', solCost: 0.1, xpReward: 500, nftId: 'reserva' },
  { id: 'hotel', name: 'Hotel Boutique Eco', type: 'Hospedaje · Nivel 2', tier: 2, color: '#3D405B', solCost: 0.08, xpReward: 200, nftId: 'hotel' },
  { id: 'artesanal', name: 'Mercado Artesanal', type: 'Comercio · Nivel 1', tier: 1, color: '#FFFFFF', solCost: 0.02, xpReward: 120, nftId: 'artesanal' },
]

// --- Level calculation ---
export function calculateLevel(xp: number): string {
  if (xp >= 5000) return 'Oro 🏆'
  if (xp >= 1000) return 'Plata 🥈'
  return 'Bronce 🥉'
}

// --- Context ---
const AppStateContext = createContext<AppState | undefined>(undefined)

// --- Provider ---
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(1200)
  const [points, setPoints] = useState(650)
  const [passportMinted, setPassportMinted] = useState(false)
  const [activeNfts, setActiveNfts] = useState<NftId[]>(['cenote'])
  const [earnedTokens, setEarnedTokens] = useState<EarnedSolanaToken[]>([])
  const [tokensLoaded, setTokensLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    AsyncStorage.getItem(EARNED_TOKENS_STORAGE_KEY)
      .then(value => {
        if (!mounted || !value) return

        const parsed = JSON.parse(value) as EarnedSolanaToken[]
        if (Array.isArray(parsed)) {
          setEarnedTokens(prev => (prev.length > 0 ? prev : parsed))
        }
      })
      .catch(error => {
        console.warn('Could not load earned Huellazo tokens', error)
      })
      .finally(() => {
        if (mounted) setTokensLoaded(true)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!tokensLoaded) return

    AsyncStorage.setItem(EARNED_TOKENS_STORAGE_KEY, JSON.stringify(earnedTokens)).catch(error => {
      console.warn('Could not save earned Huellazo tokens', error)
    })
  }, [earnedTokens, tokensLoaded])

  const addXp = useCallback((amount: number) => {
    setXp(prev => prev + amount)
    setPoints(prev => prev + Math.floor(amount / 2))
  }, [])

  const spendPoints = useCallback((amount: number): boolean => {
    if (points < amount) return false
    setPoints(prev => prev - amount)
    return true
  }, [points])

  const unlockNft = useCallback((id: NftId) => {
    setActiveNfts(prev => prev.includes(id) ? prev : [...prev, id])
  }, [])

  const mintPassport = useCallback(() => {
    setPassportMinted(true)
  }, [])

  const mintPoiToken = useCallback((poi: MintablePoi) => {
    const existingToken = earnedTokens.find(token => token.poiId === poi.id)

    if (existingToken) {
      return { token: existingToken, alreadyMinted: true }
    }

    const token = createSolanaTokenFromPoi(poi)
    setEarnedTokens(prev => [token, ...prev])
    setXp(prev => prev + token.reward * 2)
    setPoints(prev => prev + token.reward)

    return { token, alreadyMinted: false }
  }, [earnedTokens])

  const level = calculateLevel(xp)

  return (
    <AppStateContext.Provider value={{
      xp, points, level, passportMinted, activeNfts, earnedTokens,
      addXp, spendPoints, unlockNft, mintPassport, mintPoiToken,
    }}>
      {children}
    </AppStateContext.Provider>
  )
}

// --- Hook ---
export function useAppState(): AppState {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
