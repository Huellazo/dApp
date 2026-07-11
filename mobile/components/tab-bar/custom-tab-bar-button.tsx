import React from 'react'
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'

interface Props {
  iconSource: any
  label: string
  isActive: boolean
  onPress: () => void
}

export function CustomTabBarButton({ iconSource, label, isActive, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        styles.button,
        isActive ? styles.activeButton : styles.inactiveButton
      ]}
    >
      <Image 
        source={iconSource} 
        style={styles.icon} 
      />
      <AppText style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: Colors.light.border,
    minWidth: 140, // Ensure wide enough for text
    justifyContent: 'center',
  },
  inactiveButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: Colors.light.accent, // Mustard Yellow
    transform: [{ translateY: 4 }], // Move down to simulate press
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
  },
  inactiveLabel: {
    color: Colors.light.border, 
  },
  activeLabel: {
    color: Colors.light.border, 
  },
})
