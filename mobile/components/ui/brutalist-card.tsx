import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

interface Props {
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  color?: string
  shadowColor?: string
  shadowSize?: number
}

/**
 * Reusable Neo-Brutalist card with hard offset shadow.
 * Eliminates the duplicated borderWidth/shadowOffset pattern across screens.
 */
export function BrutalistCard({ children, style, color = '#FFFFFF', shadowColor = '#3D405B', shadowSize = 6 }: Props) {
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: color,
        shadowColor,
        shadowOffset: { width: shadowSize, height: shadowSize },
      },
      style,
    ]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 4,
    borderColor: '#3D405B',
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
})
