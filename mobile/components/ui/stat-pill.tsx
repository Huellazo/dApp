import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'

interface Props {
  icon: string
  value: string | number
  label: string
  color?: string
}

/**
 * Horizontal stat pill — used in the Map header bar to show XP and Points.
 */
export function StatPill({ icon, value, label, color = '#FFFFFF' }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <AppText style={styles.icon}>{icon}</AppText>
      <View>
        <AppText style={styles.value}>{value}</AppText>
        <AppText style={styles.label}>{label}</AppText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#3D405B',
    shadowColor: '#3D405B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 22,
  },
  value: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 18,
    color: '#3D405B',
    lineHeight: 20,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 9,
    color: '#3D405B',
    opacity: 0.7,
  },
})
