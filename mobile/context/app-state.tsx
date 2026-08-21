import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { MOCK_USER } from '@/mocks/db'

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
  image?: any
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

export type UserStatus = 'normal' | 'wanted' | 'dusty' | 'premium';
export type Faction = 'Ajolotes' | 'Eagles' | 'Jaguars' | null;

export interface Transaction {
  id: string;
  type: 'earn' | 'burn' | 'penalty';
  amount: number;
  description: string;
  timestamp: string;
}

export type InventoryItemType = 'token' | 'nft' | 'coupon' | 'trash' | 'cosmetic';

export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  name: string;
  image?: any;
  value?: number;
  description?: string;
  obtainedAt: string;
  style?: string;
}

export interface LootItem {
  type: InventoryItemType;
  name: string;
  image?: any;
  value?: number;
  description?: string;
  style?: string;
}

// --- Context Type ---
export interface HuellazoAppState {
  // State
  xp: number
  points: number
  level: string
  passportMinted: boolean
  activeNfts: NftId[]
  earnedTokens: EarnedSolanaToken[]
  status: UserStatus
  faction: Faction
  transactions: Transaction[]
  inventory: InventoryItem[]
  ownedNfts: any[]

  // Actions
  addXp: (amount: number) => void
  earnPoints: (amount: number, description: string) => void
  spendPoints: (amount: number) => boolean
  unlockNft: (id: NftId) => void
  mintPassport: () => void
  mintPoiToken: (poi: MintablePoi) => { token: EarnedSolanaToken; alreadyMinted: boolean }
  burnTokens: (amount: number, description: string, type?: 'burn' | 'penalty') => boolean
  applyPenalty: (amount: number, reason: string) => void
  openPinata: () => LootItem | null
  joinFaction: (faction: Faction) => void
  executeTrade: (givenNftId: string, receivedNft: any) => void
  isRadarBoosted: boolean
  activateRadarBoost: (cost: number) => boolean
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
      `Test token earned by validating a physical visit at ${poi.name} within Huellazo.`,
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
    name: 'NFT: Pure Water',
    collectionName: 'Sacred Cenote',
    placeName: 'Sacred Cenote',
    image: require('@/assets/images/water.png'),
    xpReward: 300,
    solCost: 0.05,
  },
  {
    id: 'museo',
    name: 'NFT: Local Culture',
    collectionName: 'Regional Museum',
    placeName: 'Regional Museum',
    image: require('@/assets/images/negocio2.png'),
    xpReward: 100,
    solCost: 0.01,
  },
  {
    id: 'cafe',
    name: 'NFT: Organic Coffee',
    collectionName: 'Local Coffee Shop',
    placeName: 'Local Coffee Shop',
    image: require('@/assets/images/negocio1.png'),
    xpReward: 50,
    solCost: 0.005,
  },
  {
    id: 'reserva',
    name: 'NFT: Biodiversity',
    collectionName: 'Biosphere Reserve',
    placeName: 'Biosphere Reserve',
    image: require('@/assets/images/nfts/tourism_pyramid.png'),
    xpReward: 500,
    solCost: 0.1,
  },
  {
    id: 'hotel',
    name: 'NFT: Sustainable Lodging',
    collectionName: 'Boutique Eco Hotel',
    placeName: 'Boutique Eco Hotel',
    image: require('@/assets/images/hotel.png'),
    xpReward: 200,
    solCost: 0.08,
  },
  {
    id: 'artesanal',
    name: 'NFT: Local Craftsmanship',
    collectionName: 'Artisan Market',
    placeName: 'Artisan Market',
    image: require('@/assets/images/workshop_pottery.png'),
    xpReward: 120,
    solCost: 0.02,
  },
]

// --- Places Catalog ---
export const PLACES_CATALOG: Place[] = [
  { id: 'museo', name: 'Regional Museum', type: 'Tourism · Tier 1', tier: 1, color: '#F2CC8F', solCost: 0.01, xpReward: 100, nftId: 'museo' },
  { id: 'cenote', name: 'Sacred Cenote', type: 'Eco · Tier 2', tier: 2, color: '#81B29A', solCost: 0.05, xpReward: 300, nftId: 'cenote' },
  { id: 'cafe', name: 'Local Coffee Shop', type: 'Commerce · Tier 1', tier: 1, color: '#FFFFFF', solCost: 0.005, xpReward: 50, nftId: 'cafe' },
  { id: 'reserva', name: 'Biosphere Reserve', type: 'Eco · Tier 2', tier: 2, color: '#E07A5F', solCost: 0.1, xpReward: 500, nftId: 'reserva' },
  { id: 'hotel', name: 'Boutique Eco Hotel', type: 'Lodging · Tier 2', tier: 2, color: '#3D405B', solCost: 0.08, xpReward: 200, nftId: 'hotel' },
  { id: 'artesanal', name: 'Artisan Market', type: 'Commerce · Tier 1', tier: 1, color: '#FFFFFF', solCost: 0.02, xpReward: 120, nftId: 'artesanal' },
]

// --- Level calculation ---
export function calculateLevel(xp: number): string {
  if (xp >= 5000) return 'Oro'
  if (xp >= 1000) return 'Plata'
  return 'Bronce'
}

// --- Context ---
const AppStateContext = createContext<HuellazoAppState | undefined>(undefined)

// --- Provider ---
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(1200)
  const [points, setPoints] = useState(650)
  const [passportMinted, setPassportMinted] = useState(false)
  const [activeNfts, setActiveNfts] = useState<NftId[]>(['cenote'])
  const [earnedTokens, setEarnedTokens] = useState<EarnedSolanaToken[]>([])
  const [tokensLoaded, setTokensLoaded] = useState(false)
  
  // Gamification state
  const [status, setStatus] = useState<UserStatus>('normal')
  const [faction, setFaction] = useState<Faction>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  
  // Radar Boost State
  const [isRadarBoosted, setIsRadarBoosted] = useState(false)
  
  // Dynamic state for NFTs that can be traded
  const [ownedNfts, setOwnedNfts] = useState<any[]>(MOCK_USER.nfts)
  
  // Initialize inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'inv-1', type: 'token', name: 'Cupón Taco Gratis', value: 50, obtainedAt: '2026-08-15' },
    { id: 'inv-2', type: 'trash', name: 'Basura Recogida en Parque', description: '+10 XP Limpieza', obtainedAt: '2026-08-16' },
  ])

  // Load earned tokens from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(EARNED_TOKENS_STORAGE_KEY)
      .then(stored => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) {
              setEarnedTokens(parsed)
            }
          } catch {
            // Ignore parse errors
          }
        }
      })
      .finally(() => setTokensLoaded(true))
  }, [])

  // Save earned tokens whenever they change
  useEffect(() => {
    if (!tokensLoaded) return
    AsyncStorage.setItem(EARNED_TOKENS_STORAGE_KEY, JSON.stringify(earnedTokens)).catch(console.error)
  }, [earnedTokens, tokensLoaded])

  const addXp = useCallback((amount: number) => {
    setXp(prev => prev + amount)
  }, [])

  const logTransaction = useCallback((type: 'earn' | 'burn' | 'penalty', amount: number, description: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setTransactions(prev => [newTx, ...prev])
  }, [])

  const earnPoints = useCallback((amount: number, description: string) => {
    setPoints(prev => prev + amount)
    logTransaction('earn', amount, description)
  }, [logTransaction])

  const spendPoints = useCallback((amount: number): boolean => {
    if (points >= amount) {
      setPoints(prev => prev - amount)
      return true
    }
    return false
  }, [points])

  const unlockNft = useCallback((id: NftId) => {
    setActiveNfts(prev => (prev.includes(id) ? prev : [...prev, id]))
    const nft = NFT_CATALOG.find(n => n.id === id)
    if (nft) {
      setXp(prev => prev + nft.xpReward)
    }
  }, [])

  const mintPassport = useCallback(() => {
    setPassportMinted(true)
  }, [])

  const burnTokens = useCallback((amount: number, description: string, type: 'burn' | 'penalty' = 'burn'): boolean => {
    if (points >= amount) {
      setPoints(prev => prev - amount)
      logTransaction(type, amount, description)
      return true
    }
    return false
  }, [points, logTransaction])

  const applyPenalty = useCallback((amount: number, reason: string) => {
    setPoints(prev => Math.max(0, prev - amount))
    setStatus('wanted')
    logTransaction('penalty', amount, `Penalización: ${reason}`)
  }, [logTransaction])

  const activateRadarBoost = useCallback((cost: number): boolean => {
    if (isRadarBoosted) return true
    if (points >= cost) {
      setPoints(prev => prev - cost)
      setIsRadarBoosted(true)
      logTransaction('burn', cost, 'Activación de Radar Booster (1h)')
      
      // Auto deactivate after 1 hour simulation (or 1 min for demo)
      setTimeout(() => {
        setIsRadarBoosted(false)
      }, 60000)
      return true
    }
    return false
  }, [points, isRadarBoosted, logTransaction])

  const openPinata = useCallback((): LootItem | null => {
    const pinataCost = 100
    if (points < pinataCost) return null

    setPoints(prev => prev - pinataCost)
    logTransaction('burn', pinataCost, 'Romper Piñata Cripto')

    const lootOptions: LootItem[] = [
      { type: 'token', name: '50 Puntos $HZ Extra', value: 50, style: 'bg-accent2' },
      { type: 'coupon', name: 'Descuento 20% en Café Petirrojo', style: 'bg-primary' },
      { type: 'trash', name: 'Lata de Aluminio Reciclada', description: '¡Gracias por limpiar Huajuapan!', style: 'bg-secondary' },
      { type: 'cosmetic', name: 'Sombrero de Charro para Avatar', style: 'bg-accent1' }
    ]

    const selectedLoot = lootOptions[Math.floor(Math.random() * lootOptions.length)]

    if (selectedLoot.type === 'token' && selectedLoot.value) {
      setPoints(prev => prev + selectedLoot.value!)
    }

    const newInvItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      type: selectedLoot.type,
      name: selectedLoot.name,
      description: selectedLoot.description,
      value: selectedLoot.value,
      style: selectedLoot.style,
      obtainedAt: new Date().toISOString().split('T')[0]
    }
    setInventory(prev => [newInvItem, ...prev])

    return selectedLoot
  }, [points, logTransaction])

  const joinFaction = useCallback((newFaction: Faction) => {
    setFaction(newFaction)
  }, [])

  const executeTrade = useCallback((givenNftId: string, receivedNft: any) => {
    setOwnedNfts(prev => prev.filter(n => n.id !== givenNftId))
    setOwnedNfts(prev => [receivedNft, ...prev])
    logTransaction('earn', 50, `Intercambio exitoso: ${receivedNft.name}`)
  }, [logTransaction])

  const mintPoiToken = useCallback((poi: MintablePoi) => {
    const existingToken = earnedTokens.find(token => token.poiId === poi.id)

    if (existingToken) {
      return { token: existingToken, alreadyMinted: true }
    }

    const token = createSolanaTokenFromPoi(poi)
    setEarnedTokens(prev => [token, ...prev])
    setXp(prev => prev + token.reward * 2)
    setPoints(prev => prev + token.reward)
    logTransaction('earn', token.reward, `Scanned ${poi.name}`)

    return { token, alreadyMinted: false }
  }, [earnedTokens, logTransaction])

  const level = calculateLevel(xp)

  return (
    <AppStateContext.Provider value={{
      xp, points, level, passportMinted, activeNfts, earnedTokens,
      status, faction, transactions, inventory, ownedNfts, isRadarBoosted,
      addXp, earnPoints, spendPoints, unlockNft, mintPassport, mintPoiToken,
      burnTokens, applyPenalty, openPinata, joinFaction, executeTrade, activateRadarBoost
    }}>
      {children}
    </AppStateContext.Provider>
  )
}

// --- Hook ---
export function useAppState(): HuellazoAppState {
  const context = useContext(AppStateContext)
  if (!context) {
    // Safe fallback object for hot reloading or unmounted context
    return {
      xp: 1200, points: 650, level: 'Bronce', passportMinted: false, activeNfts: ['cenote'],
      earnedTokens: [], status: 'normal', faction: null, transactions: [], inventory: [],
      ownedNfts: MOCK_USER.nfts, isRadarBoosted: false, addXp: () => {}, earnPoints: () => {}, spendPoints: () => false,
      unlockNft: () => {}, mintPassport: () => {}, mintPoiToken: () => ({ token: {} as any, alreadyMinted: false }),
      burnTokens: () => false, applyPenalty: () => {}, openPinata: () => null, joinFaction: () => {},
      executeTrade: () => {}, activateRadarBoost: () => false
    }
  }
  return context
}
