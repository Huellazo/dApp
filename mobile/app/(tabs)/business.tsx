import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function BusinessTabScreen() {
  const router = useRouter();

  // Filter for business only
  const businessPOIs = MOCK_POIS.filter(poi => poi.category === 'business');

  return (
    <View className="flex-1 bg-background pt-12 px-4 pb-24">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-4xl font-black text-border uppercase tracking-tight">Local</Text>
            <Text className="text-lg font-bold text-primary">Support commerce</Text>
          </View>
          <View className="bg-accent2 p-3 border-4 border-border shadow-brutal">
            <FontAwesome5 name="store" size={20} color={colors.border} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-xl font-bold text-border mb-4 uppercase mt-2">Local Businesses</Text>
          <View className="mb-8">
            {businessPOIs.map(poi => (
              <Pressable key={`list-${poi.id}`} onPress={() => router.push(`/business/${poi.id}`)} className="active:opacity-80 mb-4">
                <BrutalistCard colorClass="bg-background p-0 w-full overflow-hidden">
                  <View className="w-full h-40 border-b-4 border-border bg-accent1 relative">
                     {poi.image && (
                       <Image source={poi.image as any} className="w-full h-full" resizeMode="cover" />
                     )}
                     <View className="absolute top-2 right-2 bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm">
                       <Text className="text-border font-bold text-xs uppercase">Pay with HZ</Text>
                     </View>
                  </View>
                  <View className="p-3">
                    <Text className="text-border font-bold uppercase text-xl" numberOfLines={1}>{poi.name}</Text>
                    <View className="flex-row items-center justify-between mt-1">
                      <View className="flex-row items-center">
                        <FontAwesome5 name="star" solid size={14} color={colors.border} />
                        <Text className="text-border font-bold ml-1">{poi.rating}</Text>
                        <Text className="text-border text-xs ml-2 uppercase bg-secondary px-2 border-2 border-border">{poi.type}</Text>
                      </View>
                      <FontAwesome5 name="shopping-bag" solid size={16} color={colors.border} />
                    </View>
                  </View>
                </BrutalistCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
    </View>
  );
}
