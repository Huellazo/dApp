import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/components/auth/auth-provider'

// Simulated places from the original web app
const AVAILABLE_PLACES = [
  { id: 1, name: "Museo Regional", type: "Turístico (Nivel 1)", xp: 100, tier: 1, color: Colors.light.accent, solCost: 0.01 },
  { id: 2, name: "Cenote Sagrado", type: "Ecológico (Nivel 2)", xp: 300, tier: 2, ecoBadge: "Agua Pura ♻️", actionId: 1, color: Colors.light.success, solCost: 0.05 },
  { id: 3, name: "Café Local", type: "Comercio (Nivel 1)", xp: 50, tier: 1, color: '#FFFFFF', solCost: 0.005 },
  { id: 4, name: "Reserva Biósfera", type: "Ecológico (Nivel 2)", xp: 500, tier: 2, ecoBadge: "Fauna Local ♻️", actionId: 2, color: Colors.light.primary, solCost: 0.1 },
]

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  const { isAuthenticated } = useAuth()
  
  // Simulated State for points and active badges
  const [localPoints, setLocalPoints] = useState(650)
  const [activeBadges, setActiveBadges] = useState<number[]>([1])
  const [isSending, setIsSending] = useState(false)

  // Record a simulated visit/transaction
  const handleRecordVisit = (place: typeof AVAILABLE_PLACES[0]) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Wallet Not Connected',
        'Por favor ve a la pestaña BILLETERA y conecta tu cuenta de Solana para poder pagar.',
        [{ text: 'OK' }]
      )
      return
    }

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      
      // Simulate rewards distribution
      setLocalPoints(prev => prev + (place.xp / 2))
      if (place.actionId && !activeBadges.includes(place.actionId)) {
        setActiveBadges(prev => [...prev, place.actionId!])
      }

      Alert.alert(
        '¡Transacción Exitosa!',
        `Has pagado ${place.solCost} SOL.\n\nGanaste: +${place.xp} XP${place.actionId ? `\nSello Desbloqueado: ${place.ecoBadge}` : ''}`
      )
    }, 1500)
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      
      {/* SECTION 1: SIDE PANELS (Tokenomics and Badges) */}
      <View style={styles.sidePanelsContainer}>
        {/* Badges Panel */}
        <View style={[styles.panelCard, { backgroundColor: BORDER_COLOR }]}>
          <AppText style={[styles.panelTitle, { color: '#FFFFFF' }]}>🎖️ ECO-SELLOS</AppText>
          <View style={styles.badgesWrapper}>
            {activeBadges.map((badgeId) => {
              const place = AVAILABLE_PLACES.find(p => p.actionId === badgeId)
              return (
                <View key={badgeId} style={styles.miniBadge}>
                  <AppText style={styles.miniBadgeText}>{place?.ecoBadge}</AppText>
                </View>
              )
            })}
            {activeBadges.length === 0 && (
              <AppText style={{ color: 'rgba(255,255,255,0.6)' }}>Visita lugares nivel 2 para desbloquear insignias.</AppText>
            )}
          </View>
        </View>

        {/* Tokenomics Panel */}
        <View style={[styles.panelCard, { backgroundColor: Colors.light.primary }]}>
          <AppText style={[styles.panelTitle, { color: '#FFFFFF' }]}>💎 TOKENOMICS</AppText>
          <AppText style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 8 }}>Puntos de fidelidad (Huellazos):</AppText>
          <AppText style={styles.pointsText}>{localPoints}</AppText>
        </View>
      </View>

      {/* SECTION 2: INTERACTIVE MAP (SIMULATED LIST) */}
      <View style={styles.mainSection}>
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>📍 MAPA INTERACTIVO</AppText>
        </View>

        <View style={styles.gridContainer}>
          {AVAILABLE_PLACES.map((place) => (
            <View key={place.id} style={[styles.placeCard, { backgroundColor: place.color }]}>
              
              <View style={styles.placeInfoContainer}>
                <AppText style={[
                  styles.placeNameText, 
                  place.tier === 2 ? { color: '#FFFFFF' } : { color: BORDER_COLOR }
                ]}>
                  {place.name}
                </AppText>
                
                <AppText style={[
                  styles.placeTypeText,
                  place.tier === 2 ? { color: 'rgba(255,255,255,0.8)' } : { color: 'rgba(61,64,91,0.7)' }
                ]}>
                  {place.type}
                </AppText>
                
                <View style={styles.tagsRowContainer}>
                  <View style={styles.tagBaseItem}>
                    <AppText style={styles.tagBaseText}>+{place.xp} XP</AppText>
                  </View>
                  {place.tier === 2 && (
                    <View style={styles.tagSpecialItem}>
                      <AppText style={styles.tagSpecialText}>Sello Eco</AppText>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                disabled={isSending}
                activeOpacity={0.8}
                onPress={() => handleRecordVisit(place)}
                style={[styles.payButton, isSending && { opacity: 0.5 }]}
              >
                <AppText style={styles.payButtonText}>PAGAR {place.solCost} SOL</AppText>
              </TouchableOpacity>

            </View>
          ))}
        </View>
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
  sidePanelsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  panelCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  panelTitle: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    marginBottom: 12,
  },
  badgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  miniBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
  },
  pointsText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 36,
  },
  mainSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  sectionHeader: {
    borderBottomWidth: 4,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
  },
  gridContainer: {
    gap: 16,
  },
  placeCard: {
    borderRadius: 16,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    padding: 16,
    flexDirection: 'column',
  },
  placeInfoContainer: {
    marginBottom: 16,
  },
  placeNameText: {
    fontSize: 18,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    marginBottom: 4,
  },
  placeTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  tagsRowContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagBaseItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagBaseText: {
    color: BORDER_COLOR,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
  },
  tagSpecialItem: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tagSpecialText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
  },
  payButton: {
    backgroundColor: '#FAF9F6', // Warm Cream
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  payButtonText: {
    color: BORDER_COLOR,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
  },
})
