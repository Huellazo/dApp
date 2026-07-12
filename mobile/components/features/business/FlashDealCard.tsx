import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function FlashDealCard({ deal }: { deal: any }) {
  const router = useRouter();

  if (!deal) return null;

  return (
    <View className="mb-8 relative">
       {/* Background offset for brutalist pop */}
       <View className="absolute inset-0 bg-border translate-x-2 translate-y-2" />
       
       <Pressable 
         onPress={() => router.push(`/business/${deal.businessId}`)}
         className="bg-accent2 border-4 border-border p-4 active:translate-x-1 active:translate-y-1"
       >
         <View className="flex-row justify-between items-start mb-2">
           <View className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm flex-row items-center">
             <FontAwesome5 name="bolt" solid size={12} color={colors.accent1} />
             <Text className="text-border font-black text-xs uppercase ml-1">Flash Deal</Text>
           </View>
           <View className="bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm flex-row items-center">
             <FontAwesome5 name="clock" solid size={12} color={colors.border} />
             <Text className="text-border font-black text-xs uppercase ml-1">{deal.expiresIn}</Text>
           </View>
         </View>

         <Text className="text-border font-black text-3xl uppercase tracking-tight leading-none mt-2 mb-1">
           {deal.discount}
         </Text>
         <Text className="text-border font-bold text-lg mb-2">
           {deal.title} at {deal.businessName}
         </Text>

         <View className="flex-row items-center mt-2 border-t-4 border-border pt-3">
           <Text className="text-border font-bold uppercase text-xs mr-2">Cost:</Text>
           <Text className="bg-background px-2 py-1 border-2 border-border font-black">{deal.costHZ} HZ</Text>
         </View>
       </Pressable>
    </View>
  );
}
