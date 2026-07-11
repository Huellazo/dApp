import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Image } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistCard } from '@/components/ui/brutalist-card'
import { BrutalistButton } from '@/components/ui/brutalist-button'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/components/auth/auth-provider'
import { useAppState, calculateLevel } from '@/context/app-state'

const MAX_XP_FOR_GOLD = 5000

export default function PassportScreen() {
  const insets = useSafeAreaInsets()
  const { isAuthenticated, user } = useAuth()
  const { xp, points, level, passportMinted, mintPassport } = useAppState()
  const [isMinting, setIsMinting] = useState(false)

  const xpProgress = Math.min((xp / MAX_XP_FOR_GOLD) * 100, 100)

  // Simulate passport minting transaction
  const handleMintPassport = () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      mintPassport()
    }, 2000)
  }

  // Disconnected state — prompt wallet connection
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <BrutalistCard style={styles.disconnectedCard}>
          <AppText style={styles.cactusEmoji}>🌵</AppText>
          <AppText style={styles.disconnectedTitle}>CONECTAR BILLETERA</AppText>
          <AppText style={styles.disconnectedSubtitle}>
            Conecta tu billetera Solana para acceder a tu Pasaporte NFT y comenzar tu aventura.
          </AppText>
          <View style={styles.connectorList}>
            <BrutalistButton label="CONECTAR PHANTOM" onPress={() => {}} variant="secondary" />
            <BrutalistButton label="CONECTAR SOLFLARE" onPress={() => {}} variant="ghost" />
          </View>
        </BrutalistCard>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Network status banner */}
      <BrutalistCard color={Colors.light.success} shadowSize={4}>
        <AppText style={styles.networkText}>🟢 CONECTADO A DEVNET</AppText>
      </BrutalistCard>

      {/* Profile card */}
      <BrutalistCard>
        {/* Avatar + identity */}
        <View style={styles.identityRow}>
          <View style={styles.avatarRing}>
            <Image source={require('@/assets/images/player.png')} style={styles.avatarImage} />
          </View>
          <View style={styles.identityInfo}>
            <AppText style={styles.profileTitle}>TURISTA OFICIAL</AppText>
            <View style={styles.addressChip}>
              <AppText style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {user?.address ?? 'Wallt...Demo'}
              </AppText>
            </View>
            <View style={styles.levelChip}>
              <AppText style={styles.levelText}>Rango: {level}</AppText>
            </View>
          </View>
        </View>

        {/* XP Progress bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <AppText style={styles.xpLabel}>EXPERIENCIA</AppText>
            <AppText style={styles.xpValue}>{xp} / {MAX_XP_FOR_GOLD} XP</AppText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xpProgress}%` as any }]} />
          </View>
          <AppText style={styles.xpHint}>Llega a 5,000 XP para alcanzar Rango Oro 🏆</AppText>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <BrutalistCard color={Colors.light.primary} shadowSize={4} style={styles.statBox}>
            <AppText style={styles.statLabel}>EXPERIENCIA</AppText>
            <AppText style={styles.statValue}>{xp}</AppText>
            <AppText style={styles.statUnit}>XP TOTAL</AppText>
          </BrutalistCard>

          <BrutalistCard color={Colors.light.success} shadowSize={4} style={styles.statBox}>
            <AppText style={styles.statLabel}>PUNTOS ECO</AppText>
            <AppText style={styles.statValue}>{points}</AppText>
            <AppText style={styles.statUnit}>HUELLAZOS</AppText>
          </BrutalistCard>
        </View>

        {/* Passport NFT section */}
        {!passportMinted ? (
          <View style={styles.mintSection}>
            <BrutalistButton
              label={isMinting ? '⏳ ACUÑANDO EN DEVNET...' : '🛂 GENERAR PASAPORTE ON-CHAIN'}
              onPress={handleMintPassport}
              disabled={isMinting}
              variant="dark"
            />
            <AppText style={styles.mintHint}>
              Crea tu Pasaporte PDA inmutable en Solana Devnet. Esto es tu identidad de turista digital.
            </AppText>
          </View>
        ) : (
          <BrutalistCard color={Colors.light.accent} shadowSize={3} style={styles.passportMintedCard}>
            <AppText style={styles.mintedEmoji}>🛂</AppText>
            <AppText style={styles.mintedTitle}>PASAPORTE ACTIVO</AppText>
            <AppText style={styles.mintedSub}>Tu identidad está registrada on-chain en Devnet.</AppText>
          </BrutalistCard>
        )}
      </BrutalistCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  disconnectedCard: {
    margin: 20,
    alignItems: 'center',
    gap: 16,
  },
  cactusEmoji: {
    fontSize: 72,
    textAlign: 'center',
  },
  disconnectedTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 24,
    color: '#3D405B',
    textAlign: 'center',
  },
  disconnectedSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  connectorList: {
    width: '100%',
    gap: 12,
  },
  networkText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
    color: '#FFFFFF',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#3D405B',
    paddingBottom: 20,
    marginBottom: 20,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#3D405B',
    backgroundColor: Colors.light.accent,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3D405B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  avatarImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  identityInfo: {
    flex: 1,
    gap: 8,
  },
  profileTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 20,
    color: '#3D405B',
  },
  addressChip: {
    backgroundColor: '#3D405B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addressText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#FFFFFF',
    maxWidth: 160,
  },
  levelChip: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3D405B',
    alignSelf: 'flex-start',
  },
  levelText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    color: '#3D405B',
  },
  xpSection: {
    gap: 8,
    marginBottom: 20,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    color: '#3D405B',
  },
  xpValue: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    color: Colors.light.primary,
  },
  progressTrack: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#3D405B',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
  },
  xpHint: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  statValue: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 36,
    color: '#FFFFFF',
  },
  statUnit: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
  },
  mintSection: {
    gap: 12,
    alignItems: 'center',
  },
  mintHint: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
  passportMintedCard: {
    alignItems: 'center',
    gap: 8,
  },
  mintedEmoji: {
    fontSize: 48,
  },
  mintedTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 18,
    color: '#3D405B',
  },
  mintedSub: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3D405B',
    textAlign: 'center',
    opacity: 0.8,
  },
})
