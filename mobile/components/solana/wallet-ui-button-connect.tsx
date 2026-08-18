import { BaseButton } from '@/components/solana/base-button'
import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { signIn } = useAuth()

  return <BaseButton label={label} onPress={() => signIn()} />
}
