import { useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { HuellazoProgramService } from '@/services/huellazo-program'
import { useTransaction } from './use-transaction'

export function useHuellazoProgram() {
  const { connection, account } = useMobileWallet()
  const { executeTransaction, isLoading, error } = useTransaction()

  const programService = useMemo(() => {
    return new HuellazoProgramService(connection)
  }, [connection])

  const getAccountPublicKey = () => {
    if (!account) {
      throw new Error('Wallet not connected')
    }
    return account.address
  }

  const initializeConfig = async () => {
    const admin = getAccountPublicKey()
    const tx = await programService.buildInitializeConfigTx(admin)
    return await executeTransaction(tx)
  }

  const initializePassport = async () => {
    const user = getAccountPublicKey()
    const tx = await programService.buildInitializePassportTx(user)
    return await executeTransaction(tx)
  }

  const registerMerchant = async (merchantAuthority: string, name: string, tier: number) => {
    const admin = getAccountPublicKey()
    const tx = await programService.buildRegisterMerchantTx(admin, new PublicKey(merchantAuthority), name, tier)
    return await executeTransaction(tx)
  }

  const recordVisit = async (merchantAuthority: string, userToReward: string, xp: number, points: number) => {
    const authority = getAccountPublicKey()
    const tx = await programService.buildRecordVisitTx(authority, new PublicKey(merchantAuthority), new PublicKey(userToReward), xp, points)
    return await executeTransaction(tx)
  }

  const validateEcoAction = async (merchantAuthority: string, userToReward: string, actionId: number) => {
    const authority = getAccountPublicKey()
    const tx = await programService.buildValidateEcoActionTx(authority, new PublicKey(merchantAuthority), new PublicKey(userToReward), actionId)
    return await executeTransaction(tx)
  }

  const getPassport = async (userAddress: string) => {
    const [pda] = programService.getPassportPDA(new PublicKey(userAddress))
    return programService.fetchPassport(pda)
  }

  return {
    initializeConfig,
    initializePassport,
    registerMerchant,
    recordVisit,
    validateEcoAction,
    getPassport,
    programService,
    isLoading,
    error,
  }
}
