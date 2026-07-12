import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingPillBar } from '@/components/navigation/FloatingPillBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingPillBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="tourism"
        options={{
          title: 'Tourism',
        }}
      />
      <Tabs.Screen
        name="business"
        options={{
          title: 'Local',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: 'Passport',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
        }}
      />
    </Tabs>
  );
}
