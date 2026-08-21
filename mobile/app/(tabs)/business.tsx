import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS, MOCK_FLASH_DEALS, MOCK_USER } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

import { ImpactMeter } from '@/components/features/business/ImpactMeter';
import { CategoryGrid } from '@/components/features/business/CategoryGrid';
import { FlashDealCard } from '@/components/features/business/FlashDealCard';
import { useLanguage } from '@/context/language-context';

export default function BusinessTabScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  // Filter for business only
  const businessPOIs = MOCK_POIS.filter(poi => poi.category === 'business');
  const activeDeal = MOCK_FLASH_DEALS[0];

  return (
    <View className="flex-1 bg-background pt-12 px-4 pb-24">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-4xl font-black text-border uppercase tracking-tight">{t('business.title')}</Text>
          <Text className="text-sm font-bold text-primary">{t('business.subtitle')}</Text>
        </View>
        <View className="bg-accent2 p-3 rounded-none border-4 border-border shadow-brutal-sm">
          <FontAwesome5 name="store" size={20} color="#FAF9F6" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <ImpactMeter supported={MOCK_USER.businessesSupported} />

        <FlashDealCard deal={activeDeal} />

        <CategoryGrid />

        <Text className="text-xl font-black text-border mb-4 uppercase mt-4">{t('business.nearby_businesses')}</Text>
        <View className="mb-8">
          {businessPOIs.map(poi => (
            <Pressable key={`list-${poi.id}`} onPress={() => router.push(`/business/${poi.id}`)} className="active:opacity-80 mb-4">
              <BrutalistCard colorClass="bg-background p-0 w-full overflow-hidden" variant="info">
                <View className="w-full h-40 border-b-4 border-border bg-accent1/30 relative justify-center items-center overflow-hidden">
                  {poi.image && (
                    <Image source={poi.image as any} className="w-11/12 h-5/6" resizeMode="contain" />
                  )}
                  <View className="absolute top-2 right-2 bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm">
                    <Text className="text-background font-black text-xs uppercase">Acepta Solana (SOL)</Text>
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
                        <Text className="text-border text-sm font-black mr-3">{poi.distanceKm}km</Text>
                      )}
                      <FontAwesome5 name="shopping-bag" solid size={18} color={colors.border} />
                    </View>
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
