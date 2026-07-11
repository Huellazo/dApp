import React from 'react'
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost'

interface Props {
  label: string
  onPress: () => void
  variant?: Variant
  disabled?: boolean
  style?: ViewStyle
}

const BG_MAP: Record<Variant, string> = {
  primary: Colors.light.success,
  secondary: Colors.light.accent,
  dark: '#3D405B',
  ghost: '#FAF9F6',
}

const TEXT_MAP: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: '#3D405B',
  dark: Colors.light.accent,
  ghost: '#3D405B',
}

const SHADOW_MAP: Record<Variant, string> = {
  primary: '#3D405B',
  secondary: '#3D405B',
  dark: Colors.light.accent,
  ghost: '#3D405B',
}

/**
 * Reusable Neo-Brutalist button with 4 visual variants.
 */
export function BrutalistButton({ label, onPress, variant = 'primary', disabled = false, style }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          backgroundColor: disabled ? '#E5E7EB' : BG_MAP[variant],
          shadowColor: disabled ? 'transparent' : SHADOW_MAP[variant],
        },
        style,
      ]}
    >
      <AppText style={[styles.label, { color: disabled ? '#9CA3AF' : TEXT_MAP[variant] }]}>
        {label}
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 4,
    borderColor: '#3D405B',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    width: '100%',
  },
  label: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
})
