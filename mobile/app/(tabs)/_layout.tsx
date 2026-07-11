import { CustomTabBar } from '@/components/tab-bar/custom-tab-bar'
import { ScrollProvider } from '@/components/tab-bar/scroll-context'
import { Tabs } from 'expo-router'
import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useInitializeData } from '@/hooks/useInitializeData'

export default function TabLayout() {
  const { user } = useAuth()
  useInitializeData(user?.address)

  return (
    <ScrollProvider>
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => null,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="map" options={{ title: 'Explore' }} />
      <Tabs.Screen name="qr" options={{ title: 'Scan' }} />
      <Tabs.Screen name="passport" options={{ title: 'Passport' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
      <Tabs.Screen name="account" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="demo" options={{ href: null }} />
    </Tabs>
    </ScrollProvider>
  )
}
