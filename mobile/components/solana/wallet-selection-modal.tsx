import React from 'react'
import { Modal, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { AppText } from '@/components/app-text'
import { useMobileWalletAdapterTheme } from '@/components/solana/use-wallet-ui-theme'
import { WebWalletProvider } from '@/components/auth/useAuthorization'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface WalletSelectionModalProps {
  visible: boolean
  wallets: WebWalletProvider[]
  onSelect: (walletId: string) => void
  onClose: () => void
}

export function WalletSelectionModal({ visible, wallets, onSelect, onClose }: WalletSelectionModalProps) {
  const { backgroundColor, borderColor, textColor } = useMobileWalletAdapterTheme()

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor, borderColor }]}>
          <View style={styles.header}>
            <AppText style={styles.title}>Connect Wallet</AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          
          <AppText style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
            Select a wallet to connect
          </AppText>

          {wallets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText style={{ color: textColor }}>
                No supported Solana wallets detected. Please install Phantom or Solflare.
              </AppText>
            </View>
          ) : (
            <View style={styles.walletList}>
              {wallets.map((wallet) => (
                <TouchableOpacity
                  key={wallet.id}
                  style={[styles.walletButton, { borderColor }]}
                  onPress={() => onSelect(wallet.id)}
                >
                  <View style={styles.walletInfo}>
                    <AppText style={styles.walletName}>{wallet.name}</AppText>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={textColor} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  walletList: {
    gap: 12,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
})
