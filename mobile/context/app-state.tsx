import React, { createContext, useContext, useState, useCallback } from 'react'

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

// --- Context Type ---
interface AppState {
  // State
  xp: number
  points: number
  level: string
  passportMinted: boolean
  activeNfts: NftId[]

  // Actions
  addXp: (amount: number) => void
  spendPoints: (amount: number) => boolean
  unlockNft: (id: NftId) => void
  mintPassport: () => void
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

  const level = calculateLevel(xp)

  return (
    <AppStateContext.Provider value={{
      xp, points, level, passportMinted, activeNfts,
      addXp, spendPoints, unlockNft, mintPassport,
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
