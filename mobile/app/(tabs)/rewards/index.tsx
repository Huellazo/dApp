import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistCard } from '@/components/ui/brutalist-card'
import { BrutalistButton } from '@/components/ui/brutalist-button'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppState } from '@/context/app-state'

// Rewards catalog
const REWARDS = [
  { id: 'cafe', name: 'DESCUENTO EN CAFÉ LOCAL', points: 200, image: require('@/assets/images/coffee.png'), bg: Colors.light.accent },
  { id: 'cenote', name: 'ENTRADA GRATIS CENOTE', points: 500, image: require('@/assets/images/water.png'), bg: Colors.light.success },
  { id: 'hotel', name: 'NOCHE HOTEL ECO', points: 2000, image: require('@/assets/images/hotel.png'), bg: Colors.light.primary },
]

export default function RewardsScreen() {
  const insets = useSafeAreaInsets()
  const { points, spendPoints } = useAppState()
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const handleRedeem = (reward: typeof REWARDS[0]) => {
    setRedeeming(reward.id)
    setTimeout(() => {
      setRedeeming(null)
      const success = spendPoints(reward.points)
      if (success) {
        Alert.alert('🎉 Canje Exitoso', `Has canjeado:\n${reward.name}`)
      } else {
        Alert.alert('❌ Puntos Insuficientes', `Necesitas ${reward.points} Huellazos para este canje.`)
      }
    }, 1000)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header vault card */}
      <BrutalistCard color="#3D405B" shadowColor={Colors.light.accent} shadowSize={8}>
        <AppText style={styles.vaultTitle}>BÓVEDA DE RECOMPENSAS</AppText>
        <AppText style={styles.vaultSubtitle}>
          Canjea tus Huellazos por beneficios reales en destinos sustentables
        </AppText>

        {/* Tilted balance card */}
        <View style={styles.balanceTiltedWrapper}>
          <BrutalistCard color="#FFFFFF" shadowColor={Colors.light.accent} shadowSize={4} style={styles.balanceTilted}>
            <AppText style={styles.balanceLabel}>TU SALDO</AppText>
            <AppText style={styles.balanceValue}>{points}</AppText>
            <AppText style={styles.balanceUnit}>HUELLAZOS</AppText>
          </BrutalistCard>
        </View>
      </BrutalistCard>

      {/* Rewards grid */}
      <View style={styles.grid}>
        {REWARDS.map((reward) => {
          const canAfford = points >= reward.points
          const isBusy = redeeming === reward.id

          return (
            <BrutalistCard key={reward.id} style={styles.rewardCard}>
              {/* Image banner */}
              <View style={[styles.imageBanner, { backgroundColor: reward.bg }]}>
                <Image source={reward.image} style={styles.rewardImage} />
              </View>

              {/* Info */}
              <View style={styles.rewardInfo}>
                <AppText style={styles.rewardName}>{reward.name}</AppText>

                <View style={styles.costRow}>
                  <AppText style={styles.costLabel}>COSTO</AppText>
                  <AppText style={styles.costValue}>{reward.points} HUELLAS</AppText>
                </View>

                {/* Affordability indicator */}
                {!canAfford && (
                  <View style={styles.shortfallPill}>
                    <AppText style={styles.shortfallText}>
                      Te faltan {reward.points - points} Huellazos
                    </AppText>
                  </View>
                )}

                <BrutalistButton
                  label={isBusy ? '⏳ PROCESANDO...' : canAfford ? 'CANJEAR' : 'PUNTOS INSUFICIENTES'}
                  onPress={() => handleRedeem(reward)}
                  disabled={!canAfford || isBusy}
                  variant={canAfford ? 'primary' : 'ghost'}
                />
              </View>
            </BrutalistCard>
          )
        })}
      </View>
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
  vaultTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 24,
    color: Colors.light.accent,
    marginBottom: 8,
  },
  vaultSubtitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    lineHeight: 18,
    marginBottom: 20,
  },
  balanceTiltedWrapper: {
    alignItems: 'center',
  },
  balanceTilted: {
    transform: [{ rotate: '3deg' }],
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    minWidth: 200,
    borderColor: Colors.light.accent,
  },
  balanceLabel: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    color: '#3D405B',
  },
  balanceValue: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 52,
    color: '#3D405B',
    lineHeight: 60,
  },
  balanceUnit: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: Colors.light.success,
  },
  grid: {
    gap: 20,
  },
  rewardCard: {
    padding: 0,
    overflow: 'hidden',
    gap: 0,
  },
  imageBanner: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#3D405B',
  },
  rewardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  rewardInfo: {
    padding: 20,
    gap: 12,
  },
  rewardName: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 18,
    color: '#3D405B',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    color: Colors.light.primary,
  },
  costValue: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 20,
    color: '#3D405B',
  },
  shortfallPill: {
    backgroundColor: 'rgba(224,122,95,0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
  },
  shortfallText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    color: Colors.light.primary,
  },
})
