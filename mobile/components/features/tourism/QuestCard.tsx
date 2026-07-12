import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

export function QuestCard({ quest }: { quest: any }) {
  if (!quest) return null;

  const total = quest.pois.length;
  const percentage = (quest.progress / total) * 100;

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-border mb-4 uppercase mt-2">Active Route</Text>
      <BrutalistCard colorClass="bg-accent1 p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <FontAwesome5 name="map-signs" size={20} color={colors.border} />
            <Text className="text-border font-black text-xl ml-2 uppercase">{quest.title}</Text>
          </View>
          <View className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm">
             <Text className="text-border font-bold text-xs uppercase">{quest.rewardMultiplier}x HZ</Text>
          </View>
        </View>

        <Text className="text-border text-sm mb-4">{quest.description}</Text>

        {/* Progress Bar */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-border font-bold text-xs uppercase">Progress</Text>
          <Text className="text-border font-black text-sm">{quest.progress} / {total}</Text>
        </View>
        <View className="w-full h-4 bg-background border-2 border-border overflow-hidden mb-4">
          <View 
            className="h-full bg-primary border-r-2 border-border" 
            style={{ width: `${percentage}%` }} 
          />
        </View>

        <View className="flex-row justify-between items-center border-t-2 border-border border-dotted pt-4">
           <View>
              <Text className="text-border text-xs uppercase font-bold mb-1">Route Reward</Text>
              <View className="flex-row items-center">
                 <FontAwesome5 name="medal" size={14} color={colors.background} />
                 <Text className="text-border font-bold ml-1">{quest.nftReward}</Text>
              </View>
           </View>
           <BrutalistButton title="Continue" colorClass="bg-background" />
        </View>
      </BrutalistCard>
    </View>
  );
}
