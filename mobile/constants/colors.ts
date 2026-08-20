/**
 * Mexican Neo-Brutalist Palette for Huellazo
 * Inspired by minimalist architecture and organic textures ("Brutalismo Manchones").
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
  accent1: string // Fucsia Festivo
  accent2: string // Turquesa Orgánico
  success: string
  warning: string
  danger: string
  borderMuted: string
  surfaceMuted: string
  accentGreen: string
  accentPurple: string
  gradientMint: string[]
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
  accent1: '#D81B60', // Soft Festive Magenta
  accent2: '#00A896', // Organic Turquoise
  
  success: '#00A896', // Organic Turquoise
  warning: '#F2CC8F',
  danger: '#E07A5F',

  gradientMint: ['#E07A5F', '#F2CC8F'],
  borderMuted: '#3D405B',
  surfaceMuted: '#FAF9F6',
  accentGreen: '#00A896',
  accentPurple: '#D81B60',
}

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
