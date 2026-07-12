import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export function FloatingPillBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-6 left-4 right-4 flex-row items-center justify-around bg-background border-4 border-border shadow-brutal px-2 py-3">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isScan = route.name === 'scan';

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

        // Icons mapping
        let iconName = 'question';
        if (route.name === 'tourism') iconName = 'map-marked-alt';
        if (route.name === 'business') iconName = 'store';
        if (route.name === 'passport') iconName = 'passport';
        if (route.name === 'wallet') iconName = 'wallet';
        if (route.name === 'scan') iconName = 'qrcode';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="items-center justify-center flex-1 active:opacity-50"
          >
            <FontAwesome5 
              name={iconName} 
              size={24} 
              color={isFocused ? colors.primary : colors.border} 
            />
            {isFocused && (
              <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

