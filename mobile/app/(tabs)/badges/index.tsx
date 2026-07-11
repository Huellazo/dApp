import React from 'react'
import { View, StyleSheet, ScrollView, Image } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Mock data for available NFTs using project images
const AVAILABLE_NFTS = [
  { id: 1, name: 'Cenote Sagrado', nftName: 'NFT: Agua Pura', image: require('@/assets/images/water.png') },
  { id: 2, name: 'Museo Regional', nftName: 'NFT: Cultura Local', image: require('@/assets/images/negocio2.png') },
  { id: 3, name: 'Café de Especialidad', nftName: 'NFT: Grano de Oro', image: require('@/assets/images/coffee.png') },
  { id: 4, name: 'Hotel Boutique', nftName: 'NFT: Eco Estancia', image: require('@/assets/images/hotel.png') },
]

// Simulate that the user has unlocked the first 2 NFTs
const activeNfts = [1, 2]

export default function NftGalleryScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppText style={styles.titleText}>GALERÍA DE NFTS</AppText>
        <AppText style={styles.subtitleText}>Colecciona NFTs únicos visitando puntos de interés</AppText>
      </View>

      <View style={styles.grid}>
        {AVAILABLE_NFTS.map(nft => {
          const isUnlocked = activeNfts.includes(nft.id)

          return (
            <View 
              key={nft.id} 
              style={[
                styles.badgeCard, 
                isUnlocked ? styles.cardUnlocked : styles.cardLocked
              ]}
            >
              <View style={[styles.badgeCircle, isUnlocked ? styles.circleUnlocked : styles.circleLocked]}>
                <Image 
                  source={nft.image} 
                  style={[styles.nftImage, !isUnlocked && styles.nftImageLocked]} 
                />
              </View>
              
              <AppText style={styles.badgeName}>{nft.nftName}</AppText>
              <AppText style={styles.locationName}>{nft.name}</AppText>
              
              <View style={[styles.statusBadge, isUnlocked ? styles.statusUnlocked : styles.statusLocked]}>
                <AppText style={styles.statusText}>
                  {isUnlocked ? 'NFT EN BILLETERA' : 'BLOQUEADO'}
                </AppText>
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
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.light.primary, // Terracotta
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardUnlocked: {
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  cardLocked: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  badgeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  circleUnlocked: {
    backgroundColor: Colors.light.accent, // Mustard
  },
  circleLocked: {
    backgroundColor: '#D1D5DB', // Gray 300
  },
  nftImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  nftImageLocked: {
    opacity: 0.5,
    tintColor: '#6B7280', // Grayscale tint for locked
  },
  badgeName: {
    fontSize: 18,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: BORDER_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    color: Colors.light.success, // Pale Green
    textAlign: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    marginTop: 'auto',
  },
  statusUnlocked: {
    backgroundColor: Colors.light.success,
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  statusLocked: {
    backgroundColor: BORDER_COLOR,
  },
  statusText: {
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
  },
})
