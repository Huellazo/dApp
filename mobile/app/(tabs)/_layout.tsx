import { CustomTabBar } from '@/components/tab-bar/custom-tab-bar'
import { ScrollProvider } from '@/components/tab-bar/scroll-context'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <ScrollProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar — we use CustomTabBar
        }}
      >
        {/* Index redirect — hidden from tab bar */}
        <Tabs.Screen name="index" options={{ href: null }} />

        {/* Visible tab routes — order matches TAB_ITEMS in custom-tab-bar.tsx */}
        <Tabs.Screen name="map" options={{ title: 'Mapa' }} />
        <Tabs.Screen name="passport" options={{ title: 'Mi Perfil' }} />
        <Tabs.Screen name="badges" options={{ title: 'Mis NFTs' }} />
        <Tabs.Screen name="rewards" options={{ title: 'Canjear' }} />
        <Tabs.Screen name="qr" options={{ title: 'Escanear' }} />

        {/* Hidden utility routes */}
        <Tabs.Screen name="account" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="demo" options={{ href: null }} />
      </Tabs>
    </ScrollProvider>
  )
}
