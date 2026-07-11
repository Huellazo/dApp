import { Colors } from '@/constants/colors'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState, useMemo } from 'react'
import { View, StyleSheet, ScrollView, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CustomTabBarButton } from './custom-tab-bar-button'
import { BrutalistStyles } from '@/constants/styles'

// Navigation Mapping
const TAB_ITEMS: Array<{ route: string; icon: any; label: string }> = [
  { route: 'map', icon: require('@/assets/images/map-icon.png'), label: 'MAPA' },
  { route: 'passport', icon: require('@/assets/images/passport-icon.png'), label: 'MI PERFIL' },
  { route: 'badges', icon: require('@/assets/images/badges-icon.png'), label: 'MIS NFTS' },
  { route: 'rewards', icon: require('@/assets/images/rewards-icon.png'), label: 'CANJEAR' },
]

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const [activeIndex, setActiveIndex] = useState(state.index)
  
  useEffect(() => {
    setActiveIndex(state.index)
  }, [state.index])

  const visibleRoutes = useMemo(
    () =>
      state.routes
        .filter((route) => TAB_ITEMS.find((item) => item.route === route.name))
        .sort((a, b) => TAB_ITEMS.findIndex((item) => item.route === a.name) - TAB_ITEMS.findIndex((item) => item.route === b.name)),
    [state.routes],
  )

  const tabBarHeight = 85 + insets.bottom

  return (
    <View style={[styles.container, { height: tabBarHeight }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        bounces={true}
      >
        {visibleRoutes.map((route) => {
          const tabMeta = TAB_ITEMS.find((item) => item.route === route.name)
          if (!tabMeta) return null

          const routeIndex = state.routes.findIndex((r) => r.key === route.key)
          const isActive = activeIndex === routeIndex

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
            if (!isActive && !event.defaultPrevented) {
              setActiveIndex(routeIndex)
              navigation.navigate(route.name, route.params)
            }
          }

          return (
            <CustomTabBarButton
              key={route.key}
              iconSource={tabMeta.icon}
              label={tabMeta.label}
              isActive={isActive}
              onPress={onPress}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background, // Warm Cream
    borderTopWidth: 4,
    borderTopColor: Colors.light.border, // Dark Talavera Blue
    zIndex: 100,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
    height: '100%',
  },
})
