import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function FeaturedCarousel({ pois }: { pois: any[] }) {
  const router = useRouter();

  if (!pois || pois.length === 0) return null;

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-border mb-4 uppercase mt-2">Trending Spots</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pois.map((poi, idx) => (
          <Pressable key={`featured-${poi.id}`} onPress={() => router.push(`/tourism/${poi.id}`)} className="active:opacity-80">
            <BrutalistCard colorClass="bg-background mr-4 p-0 w-72">
              <View className="w-full h-40 border-b-4 border-border relative overflow-hidden">
                {/* Randomly alternate background color for empty states */}
                <View className={`absolute inset-0 ${idx % 2 === 0 ? 'bg-primary' : 'bg-accent1'}`} />
                {poi.image && (
                  <Image source={poi.image} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                )}
                {/* Hot badge */}
                <View className="absolute top-2 left-2 bg-accent2 px-2 py-1 border-2 border-border flex-row items-center shadow-brutal-sm">
                  <FontAwesome5 name="fire" solid size={12} color={colors.border} />
                  <Text className="text-border font-black text-xs uppercase ml-1">HOT</Text>
                </View>
              </View>
              <View className="p-3">
                <Text className="text-border font-black uppercase text-xl tracking-tight" numberOfLines={1}>{poi.name}</Text>
                <View className="flex-row items-center justify-between mt-1">
                  <View className="flex-row items-center">
                    <FontAwesome5 name="star" solid size={14} color={colors.border} />
                    <Text className="text-border font-bold ml-1">{poi.rating}</Text>
                    <Text className="text-border text-xs ml-2 uppercase bg-secondary px-2 border-2 border-border">{poi.type}</Text>
                  </View>
                </View>
              </View>
            </BrutalistCard>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
