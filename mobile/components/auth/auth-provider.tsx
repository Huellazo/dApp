import React, { createContext, PropsWithChildren, useContext, useState, useCallback, useEffect } from 'react'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { useAppStore } from '@/store/app-store'
import type { User } from '@/api/types'
import { useAuthorization } from './useAuthorization'
import { PublicKey } from '@solana/web3.js'

export interface AuthProviderState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  updateUserState: (user: User) => Promise<void>
  walletAddress: string | null
}

const AuthContext = createContext<AuthProviderState>({} as AuthProviderState)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasAuthenticated, setHasAuthenticated] = useState(false)
  const { authorize, deauthorize, selectedAccount, authorization } = useAuthorization()
  const { user, authenticate, restoreUser, logout, updateUserState } = useWalletAuth()
  const { clearAll } = useAppStore()

  // Clear store when not authenticated
  useEffect(() => {
    if (!selectedAccount && !user) {
      clearAll()
      setHasAuthenticated(false)
    }
  }, [selectedAccount, user, clearAll])

  // Authenticate with backend when wallet connects (only once)
  useEffect(() => {
    if (selectedAccount?.address && !hasAuthenticated && !user) {
      const authenticateUser = async () => {
        try {
          // The selectedAccount.publicKey is a byte array (Uint8Array) from MWA.
          // Let's decode it to base58 using @solana/web3.js
          const pubkey = new PublicKey(selectedAccount.publicKey).toBase58()
          
          await authenticate({
            pubkey: pubkey,
            address: pubkey,
          })
          setHasAuthenticated(true)
        } catch (error) {
          console.error('Failed to authenticate user with backend:', error)
        }
      }
      authenticateUser()
    }
  }, [selectedAccount, hasAuthenticated, user, authenticate])

  const signIn = useCallback(async () => {
    setIsLoading(true)
    try {
      await authorize()
    } catch (error) {
      console.error('Sign in error:', error)
      throw error // Re-throw so parent can handle it
    } finally {
      setIsLoading(false)
    }
  }, [authorize])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    try {
      await deauthorize()
      await logout()
      clearAll() // Clear all data from store on logout
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [deauthorize, logout, clearAll])
  
  // Compute walletAddress helper
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  useEffect(() => {
    if (selectedAccount?.publicKey) {
      setWalletAddress(new PublicKey(selectedAccount.publicKey).toBase58())
    } else {
      setWalletAddress(null)
    }
  }, [selectedAccount])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!selectedAccount && !!user,
        isLoading,
        user,
        signIn,
        signOut,
        updateUserState,
        walletAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthProviderState {
  return useContext(AuthContext)
}
