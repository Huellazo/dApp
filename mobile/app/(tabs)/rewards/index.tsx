import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Mock data for rewards catalog
const REWARDS_CATALOG = [
  { id: 1, name: "DESCUENTO EN CAFÉ LOCAL", pointsCost: 200, iconPath: require('@/assets/images/coffee.png'), backgroundColor: Colors.light.accent },
  { id: 2, name: "ENTRADA GRATIS CENOTE", pointsCost: 500, iconPath: require('@/assets/images/water.png'), backgroundColor: Colors.light.success },
  { id: 3, name: "NOCHE HOTEL ECO", pointsCost: 2000, iconPath: require('@/assets/images/hotel.png'), backgroundColor: Colors.light.primary },
]

export default function RewardsScreen() {
  const insets = useSafeAreaInsets()
  
  // Simulated local points balance
  const [localPoints, setLocalPoints] = useState(650) 

  // Handle reward redemption simulation
  const handleRedeemReward = (reward: typeof REWARDS_CATALOG[0]) => {
    if (localPoints >= reward.pointsCost) {
      setLocalPoints(prevPoints => prevPoints - reward.pointsCost)
      Alert.alert('¡Éxito!', `Has canjeado: ${reward.name}`)
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBox}>
        <View style={styles.headerTextColumn}>
          <AppText style={styles.headerTitle}>BÓVEDA DE RECOMPENSAS</AppText>
          <AppText style={styles.headerSubtitle}>Canjea tus Puntos Eco "Huellazos" por beneficios reales.</AppText>
        </View>

        <View style={styles.balanceCard}>
          <AppText style={styles.balanceLabel}>TU SALDO</AppText>
          <AppText style={styles.balancePoints}>{localPoints}</AppText>
          <AppText style={styles.balanceSubLabel}>PUNTOS ECO</AppText>
        </View>
      </View>

      <View style={styles.gridContainer}>
        {REWARDS_CATALOG.map(rewardItem => {
          const canAfford = localPoints >= rewardItem.pointsCost

          return (
            <View key={rewardItem.id} style={styles.rewardCard}>
              <View style={[styles.rewardImageContainer, { backgroundColor: rewardItem.backgroundColor }]}>
                <Image source={rewardItem.iconPath} style={styles.rewardIcon} />
              </View>
              
              <View style={styles.rewardInfoContainer}>
                <AppText style={styles.rewardNameText}>{rewardItem.name}</AppText>
                
                <View style={styles.costRow}>
                  <AppText style={styles.costLabelText}>COSTO</AppText>
                  <AppText style={styles.costValueText}>{rewardItem.pointsCost} pts</AppText>
                </View>
                
                <TouchableOpacity 
                  activeOpacity={0.8}
                  disabled={!canAfford}
                  onPress={() => handleRedeemReward(rewardItem)}
                  style={[
                    styles.redeemButton,
                    canAfford ? styles.redeemButtonActive : styles.redeemButtonDisabled
                  ]}
                >
                  <AppText style={[styles.redeemButtonText, !canAfford && styles.redeemButtonTextDisabled]}>
                    {canAfford ? 'CANJEAR' : 'PUNTOS INSUFICIENTES'}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
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
    gap: 32,
  },
  headerBox: {
    backgroundColor: BORDER_COLOR,
    borderRadius: 24,
    padding: 24,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  headerTextColumn: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: Colors.light.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    opacity: 0.8,
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: Colors.light.accent,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    transform: [{ rotate: '3deg' }],
    minWidth: 200,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
  },
  balancePoints: {
    fontSize: 48,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
  },
  balanceSubLabel: {
    fontSize: 10,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: Colors.light.success,
  },
  gridContainer: {
    gap: 24,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  rewardImageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: BORDER_COLOR,
  },
  rewardIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  rewardInfoContainer: {
    padding: 24,
  },
  rewardNameText: {
    fontSize: 20,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  costLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  costValueText: {
    fontSize: 24,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
  },
  redeemButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
  },
  redeemButtonActive: {
    backgroundColor: Colors.light.success,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  redeemButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  redeemButtonText: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: '#FFFFFF',
  },
  redeemButtonTextDisabled: {
    color: '#9CA3AF',
  },
})
