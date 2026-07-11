import React from 'react'
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function RewardsScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <AppText type="title" style={styles.title}>Rewards</AppText>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[BrutalistStyles.card, styles.balanceCard]}>
          <Image source={require('@/assets/images/rewards-icon.png')} style={styles.balanceIcon} />
          <AppText type="title" style={styles.balanceAmount}>2,540</AppText>
          <AppText style={styles.balanceCurrency}>HUELLAS</AppText>
        </View>

        <AppText type="subtitle" style={{ marginTop: 30, marginBottom: 15 }}>Social Actions (Blinks)</AppText>
        
        <View style={BrutalistStyles.card}>
          <AppText type="defaultSemiBold" style={{ marginBottom: 10 }}>Donate to Local Reforestation</AppText>
          <AppText lightColor={Colors.light.textTertiary} style={{ marginBottom: 20 }}>
            Use your tokens to plant a tree in the affected areas of the region.
          </AppText>
          <TouchableOpacity style={BrutalistStyles.buttonSecondary}>
            <AppText style={BrutalistStyles.titleText}>DONATE 500 HUELLAS</AppText>
          </TouchableOpacity>
        </View>

        <View style={[BrutalistStyles.card, { marginTop: 20 }]}>
          <AppText type="defaultSemiBold" style={{ marginBottom: 10 }}>Share Visit (X/Twitter)</AppText>
          <AppText lightColor={Colors.light.textTertiary} style={{ marginBottom: 20 }}>
            Verify your social visit and get a 1.5x multiplier on your next exploration.
          </AppText>
          <TouchableOpacity style={BrutalistStyles.buttonOutline}>
            <AppText style={BrutalistStyles.buttonTextDark}>POST BLINK</AppText>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  scrollContent: {
    paddingBottom: 100,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.light.accent,
  },
  balanceIcon: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 48,
    lineHeight: 48,
    color: Colors.light.textPrimary,
  },
  balanceCurrency: {
    fontWeight: '900',
    letterSpacing: 2,
  },
})
