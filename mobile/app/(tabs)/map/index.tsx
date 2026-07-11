import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistCard } from '@/components/ui/brutalist-card'
import { BrutalistButton } from '@/components/ui/brutalist-button'
import { StatPill } from '@/components/ui/stat-pill'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/components/auth/auth-provider'
import { useAppState, PLACES_CATALOG, NFT_CATALOG } from '@/context/app-state'

export default function MapScreen() {
  const insets = useSafeAreaInsets()
  const { isAuthenticated } = useAuth()
  const { xp, points, level, activeNfts, addXp, unlockNft } = useAppState()
  const [sendingId, setSendingId] = useState<string | null>(null)

  // Simulate paying SOL at a POI — triggers XP gain and NFT unlock
  const handleRecordVisit = (place: typeof PLACES_CATALOG[0]) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Wallet Requerida',
        'Ve a "MI PERFIL" y conecta tu billetera Solana para pagar en lugares.',
        [{ text: 'OK' }]
      )
      return
    }

    setSendingId(place.id)
    setTimeout(() => {
      setSendingId(null)
      addXp(place.xpReward)
      if (place.nftId) unlockNft(place.nftId)

      const nft = place.nftId ? NFT_CATALOG.find(n => n.id === place.nftId) : null
      Alert.alert(
        '⚡ Transacción Confirmada',
        [
          `Pagaste ${place.solCost} SOL`,
          `+${place.xpReward} XP ganados`,
          nft ? `🖼️ NFT Acuñado: ${nft.name}` : '',
          `Nivel actual: ${level}`,
        ].filter(Boolean).join('\n'),
        [{ text: '🎉 Genial!' }]
      )
    }, 1500)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Live stats header bar */}
      <View style={styles.statsBar}>
        <StatPill icon="⚡" value={xp} label="XP TOTAL" color={Colors.light.accent} />
        <StatPill icon="💎" value={points} label="HUELLAZOS" color={Colors.light.success} />
        <StatPill icon="🖼️" value={`${activeNfts.length}/${NFT_CATALOG.length}`} label="NFTS" color="#FFFFFF" />
      </View>

      {/* User rank banner */}
      <BrutalistCard color={Colors.light.primary} shadowColor="#3D405B">
        <View style={styles.rankRow}>
          <AppText style={styles.rankEmoji}>🤠</AppText>
          <View>
            <AppText style={styles.rankTitle}>TURISTA DIGITAL</AppText>
            <AppText style={styles.rankLevel}>Rango: {level}</AppText>
          </View>
        </View>
      </BrutalistCard>

      {/* Interactive map section */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>📍 MAPA INTERACTIVO</AppText>
        <AppText style={styles.sectionSubtitle}>Paga SOL para registrar tu visita y ganar NFTs</AppText>
      </View>

      <View style={styles.placesGrid}>
        {PLACES_CATALOG.map((place) => {
          const alreadyVisited = place.nftId ? activeNfts.includes(place.nftId) : false
          const isBusy = sendingId === place.id

          return (
            <BrutalistCard
              key={place.id}
              color={place.color}
              shadowColor="#3D405B"
              shadowSize={5}
              style={styles.placeCard}
            >
              <View style={styles.placeInfo}>
                <AppText style={[
                  styles.placeName,
                  place.tier === 2 && place.color !== '#FFFFFF' ? styles.textLight : styles.textDark
                ]}>
                  {place.name}
                </AppText>
                <AppText style={[
                  styles.placeType,
                  place.tier === 2 && place.color !== '#FFFFFF' ? styles.textLightMuted : styles.textDarkMuted
                ]}>
                  {place.type}
                </AppText>

                <View style={styles.tagsRow}>
                  <View style={styles.xpTag}>
                    <AppText style={styles.xpTagText}>+{place.xpReward} XP</AppText>
                  </View>
                  {place.tier === 2 && (
                    <View style={styles.nftTag}>
                      <AppText style={styles.nftTagText}>🖼️ NFT</AppText>
                    </View>
                  )}
                  {alreadyVisited && (
                    <View style={styles.visitedTag}>
                      <AppText style={styles.visitedTagText}>✅ VISITADO</AppText>
                    </View>
                  )}
                </View>
              </View>

              <BrutalistButton
                label={isBusy ? '⏳ CONFIRMANDO...' : `PAGAR ${place.solCost} SOL`}
                onPress={() => handleRecordVisit(place)}
                disabled={isBusy || alreadyVisited}
                variant="ghost"
              />
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
  statsBar: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rankEmoji: {
    fontSize: 48,
  },
  rankTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 20,
    color: '#FFFFFF',
  },
  rankLevel: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 22,
    color: '#3D405B',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  placesGrid: {
    gap: 16,
  },
  placeCard: {
    gap: 16,
  },
  placeInfo: {
    gap: 6,
  },
  placeName: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 18,
  },
  placeType: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  textLight: { color: '#FFFFFF' },
  textDark: { color: '#3D405B' },
  textLightMuted: { color: 'rgba(255,255,255,0.75)' },
  textDarkMuted: { color: 'rgba(61,64,91,0.65)' },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  xpTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  xpTagText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: '#3D405B',
  },
  nftTag: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nftTagText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: '#FFFFFF',
  },
  visitedTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3D405B',
  },
  visitedTagText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: '#3D405B',
  },
})
