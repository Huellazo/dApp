import { AppProviders } from '@/components/app-providers'
import { LanguageProvider } from '@/context/language-context'
import { AppStateProvider } from '@/context/app-state'
import { AppSplashController } from '@/components/app-splash-controller'
import { useAuth } from '@/components/auth/auth-provider'
import { useTrackLocations } from '@/hooks/use-track-locations'
import { PortalHost } from '@rn-primitives/portal'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import 'react-native-reanimated'
import '../global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Use this hook to track the locations for analytics or debugging.
  useTrackLocations((pathname, params) => {
    // Track location changes - integrate with analytics service here if needed
  })
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync()
    }
  }, [loaded])

  // Hide splash screen when fonts are ready
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  // Return a minimal view instead of null to avoid Fabric mounting issues
  if (!loaded) {
    return <View style={{ flex: 1 }} />
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F6' }} onLayout={onLayoutRootView}>
      <LanguageProvider>
        <AppProviders>
          <AppStateProvider>
            <AppSplashController />
            <RootNavigator />
            <StatusBar style="auto" />
          </AppStateProvider>
        </AppProviders>
      </LanguageProvider>
      <PortalHost />
    </View>
  )
}

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
