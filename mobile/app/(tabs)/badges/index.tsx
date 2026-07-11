import React from 'react'
import { View, StyleSheet, ScrollView, Image } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistCard } from '@/components/ui/brutalist-card'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppState, NFT_CATALOG } from '@/context/app-state'

export default function NftGalleryScreen() {
  const insets = useSafeAreaInsets()
  const { activeNfts } = useAppState()

  const unlockedCount = activeNfts.length
  const totalCount = NFT_CATALOG.length

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Gallery header */}
      <BrutalistCard color="#3D405B">
        <AppText style={styles.galleryTitle}>GALERÍA DE NFTS</AppText>
        <AppText style={styles.gallerySubtitle}>Coleccionables acuñados on-chain con Metaplex Bubblegum</AppText>
        <View style={styles.counterRow}>
          <View style={styles.counterChip}>
            <AppText style={styles.counterText}>{unlockedCount}/{totalCount} NFTS OBTENIDOS</AppText>
          </View>
        </View>
      </BrutalistCard>

      {/* NFT cards grid */}
      <View style={styles.grid}>
        {NFT_CATALOG.map((nft) => {
          const isUnlocked = activeNfts.includes(nft.id)

          return (
            <BrutalistCard
              key={nft.id}
              shadowSize={isUnlocked ? 7 : 3}
              style={[styles.nftCard, !isUnlocked && styles.lockedCard]}
            >
              {/* NFT Image */}
              <View style={[styles.imageContainer, isUnlocked ? styles.imageBgUnlocked : styles.imageBgLocked]}>
                <Image
                  source={nft.image}
                  style={[styles.nftImage, !isUnlocked && styles.nftImageGrayscale]}
                />
                {isUnlocked && (
                  <View style={styles.unlockedBadge}>
                    <AppText style={styles.unlockedBadgeText}>✅</AppText>
                  </View>
                )}
                {!isUnlocked && (
                  <View style={styles.lockedOverlay}>
                    <AppText style={styles.lockEmoji}>🔒</AppText>
                  </View>
                )}
              </View>

              {/* NFT Info */}
              <View style={styles.nftInfo}>
                <AppText style={styles.nftName}>{nft.name}</AppText>
                <AppText style={styles.nftCollection}>{nft.collectionName}</AppText>
                <AppText style={styles.nftPlace}>📍 {nft.placeName}</AppText>
              </View>

              {/* Status tag */}
              <View style={[styles.statusTag, isUnlocked ? styles.statusTagUnlocked : styles.statusTagLocked]}>
                <AppText style={styles.statusTagText}>
                  {isUnlocked ? 'EN BILLETERA' : `VISITA ${nft.placeName.toUpperCase()}`}
                </AppText>
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
  galleryTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 26,
    color: Colors.light.accent,
    marginBottom: 6,
  },
  gallerySubtitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  counterRow: {
    flexDirection: 'row',
  },
  counterChip: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  counterText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    color: '#3D405B',
  },
  grid: {
    gap: 16,
  },
  nftCard: {
    gap: 16,
    padding: 0,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  imageContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageBgUnlocked: {
    backgroundColor: Colors.light.accent,
    borderBottomWidth: 4,
    borderBottomColor: '#3D405B',
  },
  imageBgLocked: {
    backgroundColor: '#D1D5DB',
    borderBottomWidth: 4,
    borderBottomColor: '#3D405B',
  },
  nftImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  nftImageGrayscale: {
    opacity: 0.4,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.success,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D405B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    fontSize: 18,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#6B7280',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3D405B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 18,
  },
  nftInfo: {
    paddingHorizontal: 20,
    gap: 4,
  },
  nftName: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 18,
    color: '#3D405B',
  },
  nftCollection: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 12,
    color: Colors.light.success,
  },
  nftPlace: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3D405B',
    opacity: 0.7,
  },
  statusTag: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3D405B',
    alignSelf: 'flex-start',
  },
  statusTagUnlocked: {
    backgroundColor: Colors.light.success,
  },
  statusTagLocked: {
    backgroundColor: '#3D405B',
  },
  statusTagText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 10,
    color: '#FFFFFF',
  },
})
