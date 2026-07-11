import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/components/auth/auth-provider'

export default function PassportScreen() {
  const insets = useSafeAreaInsets()
  const { isAuthenticated, user } = useAuth()
  
  // Local state for UI simulation
  const [localXp, setLocalXp] = useState(1200)
  const [hasPassport, setHasPassport] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  // Calculate visual tier based on XP
  const calculateLevelString = (xp: number) => {
    if (xp >= 5000) return "Oro 🏆"
    if (xp >= 1000) return "Plata 🥈"
    return "Bronce 🥉"
  }

  // Simulate minting a passport on the blockchain
  const handleMintPassport = () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      setHasPassport(true)
      Alert.alert('Éxito', '¡Pasaporte Acuñado en Devnet!')
    }, 2000)
  }

  // Render disconnected state
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.disconnectedCard}>
          <AppText style={styles.cactusEmoji}>🌵</AppText>
          <AppText style={styles.titleText}>CONECTAR BILLETERA</AppText>
          <AppText style={styles.subtitleText}>Para empezar tu aventura neobrutalista.</AppText>
          <AppText style={styles.instructionText}>
            Ve a la pestaña BILLETERA (Wallet) en el menú inferior para conectar tu cuenta.
          </AppText>
        </View>
      </View>
    )
  }

  // Render connected state
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.networkBadge}>
        <AppText style={styles.networkText}>🟢 CONECTADO A DEVNET</AppText>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Image source={require('@/assets/images/player.png')} style={styles.avatarImage} />
          </View>
          <View style={styles.infoColumn}>
            <AppText style={styles.titleText}>TURISTA OFICIAL</AppText>
            <View style={styles.addressBadge}>
              <AppText style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {user?.address || 'Huella...Address'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: Colors.light.primary }]}>
            <AppText style={styles.statLabel}>EXPERIENCIA</AppText>
            <AppText style={styles.statValue}>{localXp} <AppText style={styles.statSubValue}>XP</AppText></AppText>
          </View>
          
          <View style={[styles.statBox, { backgroundColor: Colors.light.success }]}>
            <AppText style={styles.statLabel}>NIVEL ACTUAL</AppText>
            <AppText style={styles.statValueLevel}>{calculateLevelString(localXp)}</AppText>
          </View>
        </View>

        {!hasPassport && (
          <View style={styles.mintSection}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleMintPassport}
              disabled={isMinting}
              style={[styles.mintButton, isMinting && styles.disabledButton]}
            >
              <AppText style={styles.mintButtonText}>
                {isMinting ? 'ACUÑANDO PASAPORTE...' : 'GENERAR PASAPORTE ON-CHAIN'}
              </AppText>
            </TouchableOpacity>
            <AppText style={styles.mintHint}>Crea tu pasaporte real en Devnet para guardar datos</AppText>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const BORDER_COLOR = '#3D405B'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  disconnectedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  cactusEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: BORDER_COLOR,
    textAlign: 'center',
    opacity: 0.8,
  },
  networkBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.success,
    padding: 16,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  networkText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderBottomWidth: 4,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.light.accent,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  infoColumn: {
    flex: 1,
  },
  addressBadge: {
    backgroundColor: BORDER_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addressText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  statBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  statLabel: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 48,
  },
  statSubValue: {
    fontSize: 20,
  },
  statValueLevel: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 36,
  },
  mintSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  mintButton: {
    backgroundColor: BORDER_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  mintButtonText: {
    color: Colors.light.accent,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 16,
  },
  mintHint: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
})
