import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS, MOCK_QUESTS, MOCK_USER } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

import { FeaturedCarousel } from '@/components/features/tourism/FeaturedCarousel';
import { QuestCard } from '@/components/features/tourism/QuestCard';
import { LeaderboardPreview } from '@/components/features/tourism/LeaderboardPreview';

export default function TourismTabScreen() {
  const router = useRouter();

  // Filter for tourism only
  const tourismPOIs = MOCK_POIS.filter(poi => poi.category === 'tourism');
  const featuredPOIs = tourismPOIs.slice(0, 3); // Mocking featured ones
  const activeQuest = MOCK_QUESTS[0];

  return (
    <View className="flex-1 bg-background pt-12 px-4 pb-24">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-4xl font-black text-border uppercase tracking-tight">Explore</Text>
          <Text className="text-lg font-bold text-primary">Discover the city</Text>
        </View>
        <View className="bg-primary p-3 rounded-full border-4 border-border shadow-brutal">
          <FontAwesome5 name="search" size={20} color={colors.border} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <FeaturedCarousel pois={featuredPOIs} />

        <QuestCard quest={activeQuest} />

        <Text className="text-xl font-bold text-border mb-4 uppercase mt-2">Nearby Attractions</Text>
        <View className="mb-8">
          {tourismPOIs.map(poi => (
            <Pressable key={`list-${poi.id}`} onPress={() => router.push(`/tourism/${poi.id}`)} className="active:opacity-80 mb-4">
              <BrutalistCard colorClass="bg-background p-0 w-full overflow-hidden">
                <View className="w-full h-48 border-b-4 border-border bg-primary relative justify-center items-center overflow-hidden">
                  {poi.image && (
                    <Image source={poi.image as any} className="w-11/12 h-5/6" resizeMode="contain" />
                  )}
                  <View className="absolute top-2 right-2 bg-accent2 px-2 py-1 border-2 border-border shadow-brutal-sm">
                    <Text className="text-border font-bold text-xs uppercase">+{poi.reward} HZ</Text>
                  </View>
                </View>
                <View className="p-4 bg-background z-10 w-full">
                  <Text className="text-border font-black uppercase text-2xl" numberOfLines={1}>{poi.name}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <FontAwesome5 name="star" solid size={16} color={colors.primary} />
                      <Text className="text-border font-black ml-1 text-base">{poi.rating}</Text>
                      <Text className="text-border font-bold text-xs ml-3 uppercase bg-secondary px-3 py-1 border-2 border-border">{poi.type}</Text>
                    </View>

                    <View className="flex-row items-center">
                      {poi.distanceKm && (
                        <Text className="text-border text-sm font-black mr-3">{poi.distanceKm}km away</Text>
                      )}
                      {(poi as any).nftReward && (
                        <FontAwesome5 name="medal" solid size={18} color={colors.primary} />
                      )}
                    </View>
                  </View>
                </View>
              </BrutalistCard>
            </Pressable>
          ))}
        </View>

        <LeaderboardPreview userRank={MOCK_USER.weeklyRank} />

      </ScrollView>
    </View>
  );
}
