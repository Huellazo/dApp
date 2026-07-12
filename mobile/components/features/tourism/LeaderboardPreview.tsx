import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function LeaderboardPreview({ userRank }: { userRank: number }) {
  const topExplorers = [
    { name: '@solana_king', xp: 4500, rank: 1, isUser: false },
    { name: '@mexica99', xp: 3200, rank: 2, isUser: false },
    { name: '@aztec_dev', xp: 2800, rank: 3, isUser: false },
    { name: 'You', xp: 1450, rank: userRank, isUser: true },
  ];

  return (
    <View className="mb-12">
      <Text className="text-xl font-bold text-border mb-4 uppercase mt-2">Top Explorers</Text>
      <BrutalistCard colorClass="bg-secondary p-0">
         {topExplorers.map((explorer, index) => (
           <View 
             key={explorer.rank} 
             className={`flex-row justify-between items-center p-4 border-b-4 border-border ${explorer.isUser ? 'bg-primary' : ''} ${index === topExplorers.length - 1 ? 'border-b-0' : ''}`}
           >
              <View className="flex-row items-center">
                 <Text className="text-border font-black text-xl w-8">#{explorer.rank}</Text>
                 <View className="bg-background w-10 h-10 rounded-full border-2 border-border shadow-brutal-sm justify-center items-center mr-3">
                    <FontAwesome5 name={explorer.rank === 1 ? 'crown' : 'user-astronaut'} size={16} color={explorer.rank === 1 ? colors.accent1 : colors.border} />
                 </View>
                 <Text className={`text-border font-bold text-lg ${explorer.isUser ? 'uppercase' : ''}`}>{explorer.name}</Text>
              </View>
              <View>
                 <Text className="text-border font-black">{explorer.xp} XP</Text>
              </View>
           </View>
         ))}
      </BrutalistCard>
    </View>
  );
}
