import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

const tabIcons: Record<string, React.ComponentProps<typeof FontAwesome5>['name']> = {
  tourism: 'map-marked-alt',
  business: 'store',
  passport: 'passport',
  wallet: 'wallet',
  scan: 'qrcode',
};

export function FloatingPillBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = tabIcons[route.name] ?? 'question';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={({ pressed }) => [
              styles.tabButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.iconWrap, isFocused && styles.iconWrapFocused]}>
              <FontAwesome5 
                name={iconName} 
                size={isFocused ? 26 : 24} 
                color={colors.border} 
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderWidth: 4,
    borderColor: colors.border,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  iconWrap: {
    padding: 8,
  },
  iconWrapFocused: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.accent2,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
});

