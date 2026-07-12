import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function ImpactMeter({ supported }: { supported: number }) {
  return (
    <View className="mb-6">
      <BrutalistCard colorClass="bg-primary p-4">
        <View className="flex-row items-center mb-2">
           <View className="bg-background w-12 h-12 rounded-full justify-center items-center border-4 border-border shadow-brutal-sm mr-4">
             <FontAwesome5 name="seedling" size={24} color={colors.accent1} />
           </View>
           <View className="flex-1">
             <Text className="text-border font-black text-xl uppercase leading-none mb-1">Local Impact</Text>
             <Text className="text-border text-xs uppercase font-bold opacity-80">Sustainable Tourism</Text>
           </View>
        </View>
        <Text className="text-border text-sm font-bold mt-2">
          You have supported <Text className="font-black text-lg bg-accent2 px-1">{supported} local businesses</Text> this month. Thank you for contributing to the local economy!
        </Text>
      </BrutalistCard>
    </View>
  );
}
