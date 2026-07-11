import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function QRScreen() {
  const insets = useSafeAreaInsets()
  const [scanned, setScanned] = useState(false)

  const handleSimulateScan = () => {
    setScanned(true)
    Alert.alert(
      "Location Discovered!",
      "You have visited 'Sacred Cenote'.\n\n+50 HUELLAS\n+1 NFT Badge",
      [{ text: "Claim Reward", onPress: () => setScanned(false) }]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <AppText type="title" style={styles.title}>Scan Visit</AppText>
      
      <View style={styles.cameraPlaceholder}>
        <View style={styles.scannerFrame}>
          <AppText style={styles.scannerText}>Point at the Location's QR Code</AppText>
        </View>
      </View>

      <TouchableOpacity 
        style={[BrutalistStyles.buttonPrimary, { marginTop: 40 }]} 
        onPress={handleSimulateScan}
        activeOpacity={0.8}
      >
        <AppText style={BrutalistStyles.titleText}>Simulate QR Scan</AppText>
      </TouchableOpacity>
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
    marginBottom: 20,
    color: Colors.light.primary,
  },
  cameraPlaceholder: {
    height: 350,
    backgroundColor: Colors.light.cardBackground,
    ...BrutalistStyles.border,
    ...BrutalistStyles.hardShadow,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 4,
    borderColor: Colors.light.accent,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    textAlign: 'center',
    color: Colors.light.textTertiary,
  }
})
