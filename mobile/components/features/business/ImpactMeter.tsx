import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useLanguage } from '@/context/language-context';

export function ImpactMeter({ supported }: { supported: number }) {
  const { t } = useLanguage();

  return (
    <View className="mb-6">
      <BrutalistCard colorClass="bg-primary/20 p-4" variant="info">
        <View className="flex-row items-center mb-2">
           <View className="bg-background w-12 h-12 rounded-full justify-center items-center border-4 border-border shadow-brutal-sm mr-4">
             <FontAwesome5 name="seedling" size={24} color={colors.primary} />
           </View>
           <View className="flex-1">
             <Text className="text-border font-black text-xl uppercase leading-none mb-1">{t('business.local_impact')}</Text>
             <Text className="text-border text-xs uppercase font-bold opacity-80">{t('business.sustainable_tourism')}</Text>
           </View>
        </View>
        <Text className="text-border text-sm font-bold mt-2">
          {t('business.supported_count_prefix')} <Text className="font-black text-lg bg-accent2 px-1">{supported}</Text> {t('business.supported_count_suffix')}
        </Text>
      </BrutalistCard>
    </View>
  );
}
