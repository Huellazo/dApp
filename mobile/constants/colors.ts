/**
 * Mexican Neo-Brutalist Palette for Huellazo
 * Inspired by minimalist architecture and organic textures.
 */

type ThemeTokens = {
  background: string
  surface: string
  cardBackground: string
  border: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  icon: string
  tabIconDefault: string
  tabIconSelected: string
  tint: string
  primary: string // Terracota
  accent: string  // Mostaza
  success: string
  warning: string
  danger: string
}

const baseTheme: ThemeTokens = {
  background: '#FAF9F6', // Warm Cream
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#3D405B', // Dark Talavera Blue (Neo-Brutalist borders)
  
  textPrimary: '#3D405B',
  textSecondary: '#5C607C',
  textMuted: '#9B9EB1',
  
  icon: '#3D405B',
  tabIconDefault: '#9B9EB1',
  tabIconSelected: '#E07A5F', // Terracotta
  
  tint: '#E07A5F',
  
  primary: '#E07A5F', // Terracotta (Action Buttons, Headers)
  accent: '#F2CC8F',  // Mustard (Highlights, Alerts)
  
  success: '#81B29A', // Pale Green (complementary)
  warning: '#F2CC8F',
  danger: '#E07A5F',
}

// In brutalism we usually avoid a traditional "dark mode" to
// maintain the integrity of the light "paper/cardboard" design, but we map
// both configurations to the same theme to avoid black flashes.
export const Colors = {
  light: {
    ...baseTheme,
    text: baseTheme.textPrimary,
    textTertiary: baseTheme.textMuted,
  },
  dark: {
    ...baseTheme,
    text: baseTheme.textPrimary,
    textTertiary: baseTheme.textMuted,
  },
} as const

export type ColorMode = keyof typeof Colors
export type AppColorTheme = (typeof Colors)[ColorMode]
