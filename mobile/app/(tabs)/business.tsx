import React, { useState } from 'react';
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
import { QrPaymentPanelModal } from '@/components/features/scan/QrPaymentPanelModal';

export default function BusinessTabScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [qrPanelVisible, setQrPanelVisible] = useState(false);
  const [selectedBusinessName, setSelectedBusinessName] = useState('Comercio Local');

  // Filter for business only
  const businessPOIs = MOCK_POIS.filter(poi => poi.category === 'business');
  const activeDeal = MOCK_FLASH_DEALS[0];

  const handlePayBillDirectly = (poi: any) => {
    setSelectedBusinessName(poi.name);
    setQrPanelVisible(true);
  };

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
            <View key={`list-${poi.id}`} className="mb-4">
              <BrutalistCard colorClass="bg-background p-0 w-full overflow-hidden" variant="info">
                <Pressable onPress={() => router.push(`/business/${poi.id}`)} className="active:opacity-90">
                  <View className="w-full h-40 border-b-4 border-border bg-accent1/30 relative justify-center items-center overflow-hidden">
                    {poi.image && (
                      <Image source={poi.image as any} className="w-11/12 h-5/6" resizeMode="contain" />
                    )}
                    <View className="absolute top-2 right-2 bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm">
                      <Text className="text-background font-black text-xs uppercase">Acepta Solana (SOL)</Text>
                    </View>
                  </View>
                </Pressable>

                <View className="p-4 bg-background z-10 w-full">
                  <Pressable onPress={() => router.push(`/business/${poi.id}`)}>
                    <Text className="text-border font-black uppercase text-2xl" numberOfLines={1}>{poi.name}</Text>
                  </Pressable>
                  
                  <View className="flex-row items-center justify-between mt-2 mb-3">
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

                  {/* Actions: View details or Pay bill with QR */}
                  <View className="flex-row justify-between pt-3 border-t-2 border-border">
                    <Pressable
                      onPress={() => router.push(`/business/${poi.id}`)}
                      className="bg-secondary px-3 py-2 border-2 border-border shadow-brutal-sm active:scale-95 flex-1 mr-2 items-center"
                    >
                      <Text className="text-border font-black text-xs uppercase">
                        {language === 'es' ? 'VER MENÚ' : 'VIEW MENU'}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handlePayBillDirectly(poi)}
                      className="bg-accent2 px-3 py-2 border-2 border-border shadow-brutal-sm active:scale-95 flex-1 ml-2 items-center flex-row justify-center"
                    >
                      <FontAwesome5 name="qrcode" size={12} color={colors.border} className="mr-1.5" />
                      <Text className="text-border font-black text-xs uppercase">
                        {language === 'es' ? 'PAGAR CUENTA' : 'PAY BILL'}
                      </Text>
                    </Pressable>
                  </View>

                </View>
              </BrutalistCard>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Multi-Step Dedicated QR Bill Payment Panel Modal */}
      <QrPaymentPanelModal
        visible={qrPanelVisible}
        businessName={selectedBusinessName}
        defaultAmountSol={0.035}
        onClose={() => setQrPanelVisible(false)}
      />
    </View>
  );
}
