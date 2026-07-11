import React from 'react'
import { View, Image, StyleSheet, ScrollView } from 'react-native'
import { AppText } from '@/components/app-text'
import { BrutalistStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PassportScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <AppText type="title" style={styles.title}>NFT Passport</AppText>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Passport Identity */}
        <View style={BrutalistStyles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={require('@/assets/images/player.png')} style={styles.avatar} resizeMode="cover" />
            </View>
            <View style={styles.profileInfo}>
              <AppText type="subtitle">Explorer</AppText>
              <AppText style={{ color: Colors.light.primary, fontWeight: '900' }}>LEVEL 4</AppText>
              <AppText lightColor={Colors.light.textTertiary}>1,250 EXP</AppText>
            </View>
          </View>
        </View>

        {/* Medals and Collectibles */}
        <AppText type="subtitle" style={{ marginTop: 30, marginBottom: 15 }}>Your Badges</AppText>
        
        <View style={styles.badgesGrid}>
          <View style={styles.badgeItem}>
            <Image source={require('@/assets/images/negocio1.png')} style={styles.badgeImage} />
            <AppText style={styles.badgeText}>Restaurant</AppText>
          </View>
          <View style={styles.badgeItem}>
            <Image source={require('@/assets/images/negocio2.png')} style={styles.badgeImage} />
            <AppText style={styles.badgeText}>Museum</AppText>
          </View>
          <View style={styles.badgeItem}>
            <Image source={require('@/assets/images/negocio3.png')} style={styles.badgeImage} />
            <AppText style={styles.badgeText}>Crafts</AppText>
          </View>
          <View style={styles.badgeItem}>
            <Image source={require('@/assets/images/water.png')} style={styles.badgeImage} />
            <AppText style={styles.badgeText}>Beach</AppText>
          </View>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.accent,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    ...BrutalistStyles.border,
    ...BrutalistStyles.hardShadow,
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
  },
  badgeImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  badgeText: {
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 12,
    textTransform: 'uppercase',
  }
})
