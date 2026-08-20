import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useLanguage } from '@/context/language-context';

export function CategoryGrid() {
  const { t } = useLanguage();

  const categories = [
    { id: 'cafe', title: t('business.cat_cafes'), icon: 'coffee', color: 'bg-primary' },
    { id: 'food', title: t('business.cat_food'), icon: 'utensils', color: 'bg-accent1' },
    { id: 'crafts', title: t('business.cat_crafts'), icon: 'paint-brush', color: 'bg-accent2' },
    { id: 'events', title: t('business.cat_events'), icon: 'ticket-alt', color: 'bg-secondary' },
  ];

  return (
    <View className="mb-6">
      <Text className="text-xl font-black text-border mb-4 uppercase">{t('business.categories')}</Text>
      <View className="flex-row flex-wrap justify-between">
        {categories.map(cat => (
          <Pressable 
            key={cat.id} 
            className={`w-[48%] mb-4 border-4 border-border shadow-brutal-sm p-4 items-center justify-center active:translate-x-1 active:translate-y-1 active:shadow-none ${cat.color}`}
          >
            <FontAwesome5 name={cat.icon} size={28} color={colors.border} className="mb-2" />
            <Text className="text-border font-black uppercase text-sm mt-2">{cat.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
