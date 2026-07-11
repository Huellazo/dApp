import { StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Colors } from './colors'

/**
 * Global styles for Neo-Brutalism in React Native.
 * Use these styles by spreading them over your components:
 * <View style={[BrutalistStyles.card, customStyle]}>
 */
export const BrutalistStyles = StyleSheet.create({
  // Standard border for containers
  border: {
    borderWidth: 4,
    borderColor: Colors.light.border,
  } as ViewStyle,
  
  // Hard shadow typical of brutalism
  hardShadow: {
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, // Fallback for Android (Android doesn't natively support unblurred shadows perfectly without hacks, but elevation helps)
  } as ViewStyle,

  // Card container type (White with border and hard shadow)
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 4,
    borderColor: Colors.light.border,
    borderRadius: 12,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    padding: 16,
  } as ViewStyle,

  // Primary Button (Terracotta)
  buttonPrimary: {
    backgroundColor: Colors.light.primary,
    borderWidth: 4,
    borderColor: Colors.light.border,
    borderRadius: 12,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Secondary Button (Mustard)
  buttonSecondary: {
    backgroundColor: Colors.light.accent,
    borderWidth: 4,
    borderColor: Colors.light.border,
    borderRadius: 12,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Transparent / White Button
  buttonOutline: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 4,
    borderColor: Colors.light.border,
    borderRadius: 12,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  // Standard text for titles
  titleText: {
    color: Colors.light.background, // Usually white/cream on primary backgrounds
    fontWeight: '900', // Equivalent to font-black
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  } as TextStyle,
  
  // Standard text for dark buttons
  buttonTextDark: {
    color: Colors.light.border,
    fontWeight: '900',
    textTransform: 'uppercase',
  } as TextStyle,
})
