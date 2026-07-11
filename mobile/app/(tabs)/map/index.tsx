import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

// Define Map Constants
const MAP_WIDTH = 400
const MAP_HEIGHT = 450
const PLAYER_SIZE = 40
const POI_SIZE = 40
const STEP_SIZE = 25
const INTERACTION_RADIUS = 40

type PoiType = 'tourist' | 'business'

interface POI {
  id: string
  name: string
  type: PoiType
  x: number
  y: number
  image: any
  description: string
  reward: string
}

// Points of Interest Data
const POIS: POI[] = [
  {
    id: 'museum',
    name: 'National Museum',
    type: 'tourist',
    x: 80,
    y: 80,
    image: require('@/assets/images/negocio2.png'),
    description: 'Explore the ancient artifacts and history of the region.',
    reward: '+1 Museum NFT Badge',
  },
  {
    id: 'beach',
    name: 'Hidden Cenote',
    type: 'tourist',
    x: 280,
    y: 120,
    image: require('@/assets/images/water.png'),
    description: 'A beautiful natural sinkhole hidden in the jungle.',
    reward: '+1 Cenote NFT Badge',
  },
  {
    id: 'coffee',
    name: 'Mary\'s Coffee',
    type: 'business',
    x: 100,
    y: 300,
    image: require('@/assets/images/coffee.png'),
    description: 'Local coffee shop. Pay with Solana Pay to get discounts!',
    reward: '+50 HUELLAS & Blink Interaction',
  },
  {
    id: 'crafts',
    name: 'Artisan Market',
    type: 'business',
    x: 250,
    y: 320,
    image: require('@/assets/images/negocio3.png'),
    description: 'Support local artisans buying handcrafted souvenirs.',
    reward: '+120 HUELLAS & Blink Interaction',
  },
]

export default function MapScreen() {
  const insets = useSafeAreaInsets()
  
  // Player State
  const [playerPosition, setPlayerPosition] = useState({ x: 180, y: 200 })
  const [activePoi, setActivePoi] = useState<POI | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Move the player and keep them within bounds
  const movePlayer = (dx: number, dy: number) => {
    setPlayerPosition((prev) => {
      let newX = prev.x + dx
      let newY = prev.y + dy

      // Boundaries
      if (newX < 0) newX = 0
      if (newX > MAP_WIDTH - PLAYER_SIZE) newX = MAP_WIDTH - PLAYER_SIZE
      if (newY < 0) newY = 0
      if (newY > MAP_HEIGHT - PLAYER_SIZE) newY = MAP_HEIGHT - PLAYER_SIZE

      return { x: newX, y: newY }
    })
  }

  // Check proximity to POIs whenever player moves
  useEffect(() => {
    let foundPoi = null
    for (const poi of POIS) {
      const dist = Math.sqrt(
        Math.pow(playerPosition.x - poi.x, 2) + Math.pow(playerPosition.y - poi.y, 2)
      )
      if (dist <= INTERACTION_RADIUS) {
        foundPoi = poi
        break
      }
    }
    setActivePoi(foundPoi)
  }, [playerPosition])

  // Handle Interaction
  const handleInteract = () => {
    if (activePoi) {
      setModalVisible(true)
    }
  }

  const claimReward = () => {
    setModalVisible(false)
    Alert.alert(
      'Success!', 
      `You interacted with ${activePoi?.name}.\n\nReward Claimed:\n${activePoi?.reward}`
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <AppText type="title" style={styles.title}>Explore</AppText>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Game Canvas */}
        <View style={[BrutalistStyles.border, styles.canvasContainer]}>
          <View style={styles.canvas}>
            
            {/* Render POIs */}
            {POIS.map((poi) => (
              <View 
                key={poi.id} 
                style={[
                  styles.poiWrapper, 
                  { left: poi.x, top: poi.y }
                ]}
              >
                <Image source={poi.image} style={styles.poiImage} />
                <View style={styles.poiLabel}>
                  <AppText style={styles.poiLabelText} numberOfLines={1}>{poi.name}</AppText>
                </View>
              </View>
            ))}

            {/* Render Player Avatar */}
            <View 
              style={[
                styles.playerWrapper, 
                { left: playerPosition.x, top: playerPosition.y }
              ]}
            >
              <Image source={require('@/assets/images/player.png')} style={styles.playerImage} />
            </View>

          </View>
        </View>

        {/* Interaction Prompt (Appears when near a POI) */}
        <View style={styles.actionContainer}>
          {activePoi ? (
            <TouchableOpacity 
              style={[BrutalistStyles.buttonPrimary, styles.interactButton]} 
              onPress={handleInteract}
              activeOpacity={0.8}
            >
              <MaterialIcons name="touch-app" size={24} color={Colors.light.background} />
              <AppText style={BrutalistStyles.titleText}>INTERACT WITH {activePoi.name.toUpperCase()}</AppText>
            </TouchableOpacity>
          ) : (
            <View style={[BrutalistStyles.card, styles.hintCard]}>
              <AppText style={styles.hintText}>Use the D-Pad to explore and approach a location.</AppText>
            </View>
          )}
        </View>

        {/* Virtual D-Pad */}
        <View style={styles.dpadContainer}>
          <View style={styles.dpadRow}>
            <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(0, -STEP_SIZE)}>
              <MaterialIcons name="keyboard-arrow-up" size={36} color={Colors.light.background} />
            </TouchableOpacity>
          </View>
          <View style={styles.dpadRow}>
            <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(-STEP_SIZE, 0)}>
              <MaterialIcons name="keyboard-arrow-left" size={36} color={Colors.light.background} />
            </TouchableOpacity>
            <View style={styles.dpadCenter} />
            <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(STEP_SIZE, 0)}>
              <MaterialIcons name="keyboard-arrow-right" size={36} color={Colors.light.background} />
            </TouchableOpacity>
          </View>
          <View style={styles.dpadRow}>
            <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(0, STEP_SIZE)}>
              <MaterialIcons name="keyboard-arrow-down" size={36} color={Colors.light.background} />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Interaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[BrutalistStyles.card, styles.modalContent]}>
            {activePoi && (
              <>
                <Image source={activePoi.image} style={styles.modalImage} />
                <AppText type="title" style={styles.modalTitle}>{activePoi.name}</AppText>
                
                <View style={styles.modalBadge}>
                  <AppText style={styles.modalBadgeText}>
                    {activePoi.type === 'tourist' ? 'TOURIST SPOT' : 'LOCAL BUSINESS'}
                  </AppText>
                </View>

                <AppText style={styles.modalDesc}>{activePoi.description}</AppText>
                
                <View style={styles.rewardBox}>
                  <AppText type="defaultSemiBold" style={{ color: Colors.light.primary }}>Potential Reward:</AppText>
                  <AppText style={styles.rewardText}>{activePoi.reward}</AppText>
                </View>

                {activePoi.type === 'business' && (
                  <TouchableOpacity 
                    style={[BrutalistStyles.buttonSecondary, { marginBottom: 15, width: '100%' }]}
                    onPress={() => Alert.alert("Solana Pay", "Simulating Solana Pay transaction...")}
                  >
                    <AppText style={BrutalistStyles.titleText}>PAY WITH SOLANA PAY</AppText>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[BrutalistStyles.buttonPrimary, { width: '100%' }]}
                  onPress={claimReward}
                >
                  <AppText style={BrutalistStyles.titleText}>CLAIM & DISCOVER</AppText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ marginTop: 20 }}
                  onPress={() => setModalVisible(false)}
                >
                  <AppText style={{ color: Colors.light.textTertiary, textDecorationLine: 'underline' }}>Cancel</AppText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 10,
    color: Colors.light.primary,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  canvasContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: '#EBE5D9', // Slightly darker cream for the map
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
  },
  canvas: {
    flex: 1,
    position: 'relative',
    // Subtle dot grid background
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  poiWrapper: {
    position: 'absolute',
    width: POI_SIZE,
    height: POI_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poiImage: {
    width: POI_SIZE,
    height: POI_SIZE,
    resizeMode: 'contain',
  },
  poiLabel: {
    position: 'absolute',
    top: POI_SIZE + 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 80,
    alignItems: 'center',
  },
  poiLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerWrapper: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playerImage: {
    width: PLAYER_SIZE + 10,
    height: PLAYER_SIZE + 10,
    resizeMode: 'contain',
  },
  actionContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  interactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
    gap: 8,
  },
  hintCard: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  hintText: {
    color: Colors.light.textTertiary,
    textAlign: 'center',
  },
  dpadContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  dpadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadButton: {
    backgroundColor: Colors.light.border,
    width: 60,
    height: 60,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    ...BrutalistStyles.hardShadow,
  },
  dpadCenter: {
    width: 60,
    height: 60,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61, 64, 91, 0.8)', // Dark Talavera Blue with opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  modalTitle: {
    color: Colors.light.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBadge: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  modalBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.light.textPrimary,
  },
  modalDesc: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: 'rgba(224, 122, 95, 0.1)', // Light terracotta tint
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 25,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
})
