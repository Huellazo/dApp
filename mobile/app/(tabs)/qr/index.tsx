import React, { useState } from 'react'
import { View, StyleSheet, Platform, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistCard } from '@/components/ui/brutalist-card'
import { BrutalistButton } from '@/components/ui/brutalist-button'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppState } from '@/context/app-state'
import { NFT_CATALOG } from '@/context/app-state'

// QR Scanner screen — uses expo-camera on native, simulated flow on web
export default function QrScanScreen() {
  const insets = useSafeAreaInsets()
  const { addXp, unlockNft } = useAppState()
  const [isScanning, setIsScanning] = useState(false)

  // Simulate QR validation — replaces real camera scan on web
  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      const nft = NFT_CATALOG[0] // Simulate: scanned Cenote QR
      addXp(nft.xpReward)
      unlockNft(nft.id)
      Alert.alert(
        '✅ QR Validado',
        `Coordenadas GPS verificadas.\n\n¡Has acuñado un NFT!\n${nft.name}\n\n+${nft.xpReward} XP acreditados.`,
        [{ text: '🎉 Genial!' }]
      )
    }, 2000)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.headerContainer}>
        <AppText style={styles.titleText}>ESCANEAR QR</AppText>
        <AppText style={styles.subtitleText}>Llega al punto de interés y escanea el código QR físico</AppText>
      </View>

      {/* Camera viewfinder area */}
      <View style={styles.scannerFrame}>
        <View style={styles.scannerOverlay}>
          {/* Corner brackets for scan frame effect */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {Platform.OS === 'web' ? (
            <View style={styles.webFallbackContent}>
              <AppText style={styles.cameraIcon}>📷</AppText>
              <AppText style={styles.webFallbackTitle}>CÁMARA NO DISPONIBLE EN WEB</AppText>
              <AppText style={styles.webFallbackSub}>Usa la app nativa en tu celular para escanear QR físicos</AppText>
            </View>
          ) : (
            <View style={styles.webFallbackContent}>
              <AppText style={styles.cameraIcon}>📷</AppText>
              <AppText style={styles.webFallbackTitle}>CÁMARA LISTA</AppText>
              <AppText style={styles.webFallbackSub}>Apunta al código QR del lugar</AppText>
            </View>
          )}
        </View>
      </View>

      {/* Simulate scan — always available for demo */}
      <View style={styles.actionsContainer}>
        <BrutalistCard color={Colors.light.accent} style={styles.infoCard}>
          <AppText style={styles.infoTitle}>🧭 FLUJO DE VALIDACIÓN</AppText>
          <AppText style={styles.infoText}>1. Llega al punto de interés</AppText>
          <AppText style={styles.infoText}>2. Tu GPS se valida con el backend</AppText>
          <AppText style={styles.infoText}>3. Escanea el QR físico del lugar</AppText>
          <AppText style={styles.infoText}>4. Se acuña tu NFT on-chain vía Metaplex</AppText>
        </BrutalistCard>

        <BrutalistButton
          label={isScanning ? '⏳ VALIDANDO GPS Y QR...' : '⚡ SIMULAR ESCANEO'}
          onPress={handleSimulateScan}
          disabled={isScanning}
          variant="dark"
        />
      </View>
    </View>
  )
}

const BORDER_COLOR = '#3D405B'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 20,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 28,
    color: BORDER_COLOR,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  scannerFrame: {
    flex: 1,
    maxHeight: 300,
    borderWidth: 4,
    borderColor: BORDER_COLOR,
    borderRadius: 20,
    backgroundColor: BORDER_COLOR,
    overflow: 'hidden',
    shadowColor: BORDER_COLOR,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: Colors.light.accent,
    borderWidth: 4,
  },
  topLeft: { top: 16, left: 16, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 16, right: 16, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 16, left: 16, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 16, right: 16, borderLeftWidth: 0, borderTopWidth: 0 },
  webFallbackContent: {
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  cameraIcon: {
    fontSize: 64,
  },
  webFallbackTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 16,
    color: Colors.light.accent,
    textAlign: 'center',
  },
  webFallbackSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 16,
    paddingBottom: 12,
  },
  infoCard: {
    gap: 6,
  },
  infoTitle: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
    color: BORDER_COLOR,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BORDER_COLOR,
    opacity: 0.85,
  },
})
