import { PropsWithChildren } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/colors'

export function useAppTheme() {
  // Force Light Mode globally for the Brutalist aesthetic
  const colorScheme = 'light'
  const isDark = false
  const colors = Colors['light']

  const theme = {

        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }

  return {
    colorScheme,
    isDark,
    theme,
    colors,
  }
}

export function AppTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()

  return <ThemeProvider value={theme}>{children}</ThemeProvider>
}
