import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function TourismDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const place = MOCK_POIS.find(p => p.id === id);

  if (!place) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-border font-bold text-xl uppercase">Lugar no encontrado</Text>
        <BrutalistButton title="Volver" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 pb-32">
        
        {/* Banner Header */}
        <View className="h-64 w-full border-b-4 border-border relative bg-secondary overflow-hidden items-center justify-center">
          {place.image ? (
            <Image 
              source={place.image as any} 
              className="w-11/12 h-5/6"
              resizeMode="contain"
            />
          ) : (
            <View className="flex-1 justify-center items-center opacity-50">
               <Text className="text-border font-black text-2xl uppercase">[ SIN IMAGEN ]</Text>
            </View>
          )}

          {/* Top Navigation */}
          <Pressable 
            onPress={() => router.back()} 
            className="absolute top-12 left-4 z-20 bg-background border-4 border-border shadow-brutal p-3 rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <FontAwesome5 name="arrow-left" size={20} color={colors.border} />
          </Pressable>

          <Pressable 
            className="absolute top-12 right-4 z-20 bg-background border-4 border-border shadow-brutal p-3 rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <FontAwesome5 name="bookmark" solid size={20} color={colors.border} />
          </Pressable>
        </View>

        <View className="p-4 mt-2">
          {/* Main Title Brutalist Style */}
          <View className="bg-primary border-4 border-border shadow-brutal p-4 mb-6 -mt-8 mx-2 z-30">
            <Text className="text-3xl font-black text-border uppercase tracking-tight text-center">
              {place.name}
            </Text>
          </View>
          
          {/* Highlights / Features */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
             <View className="bg-background border-4 border-border shadow-brutal rounded-full px-4 py-1 mr-3 flex-row items-center">
               <FontAwesome5 name="check-circle" solid size={14} color={colors.border} />
               <Text className="text-border font-bold uppercase ml-2 text-xs">{place.type}</Text>
             </View>
             {place.features?.map(feature => (
               <View key={feature} className="bg-background border-4 border-border shadow-brutal rounded-full px-4 py-1 mr-3 flex-row items-center">
                 <FontAwesome5 name="check-circle" solid size={14} color={colors.border} />
                 <Text className="text-border font-bold uppercase ml-2 text-xs">{feature}</Text>
               </View>
             ))}
          </ScrollView>

          {/* Historical Overview */}
          <Text className="text-xl font-bold text-border mb-2 uppercase">Reseña Histórica</Text>
          <Text className="text-border text-base leading-relaxed mb-6">
            {place.description}
          </Text>

          {/* Check-in Rewards (PokeStop style) */}
          <Text className="text-xl font-bold text-border mb-2 uppercase">Recompensas por Visita</Text>
          <BrutalistCard colorClass="bg-background mb-8 p-4">
             <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-primary rounded-full w-12 h-12 justify-center items-center border-4 border-border shadow-brutal-sm">
                    <FontAwesome5 name="coins" size={20} color={colors.border} />
                  </View>
                  <View className="ml-4">
                    <Text className="text-border font-bold text-lg">{place.reward} $HUELLAZOS</Text>
                    <Text className="text-border text-xs uppercase opacity-70">Puntos Huellazos ($HZ)</Text>
                  </View>
                </View>
             </View>

             {(place as any).nftReward && (
               <View className="flex-row items-center justify-between mt-4 pt-4 border-t-4 border-border border-dotted">
                  <View className="flex-row items-center">
                    <View className="bg-accent2 rounded-full w-12 h-12 justify-center items-center border-4 border-border shadow-brutal-sm">
                      <FontAwesome5 name="medal" size={20} color={colors.border} />
                    </View>
                    <View className="ml-4">
                      <Text className="text-border font-bold text-lg">{(place as any).nftReward}</Text>
                      <Text className="text-border text-xs uppercase opacity-70">Estampa Coleccionable</Text>
                    </View>
                  </View>
               </View>
             )}
          </BrutalistCard>

          {/* Map Location */}
          <Text className="text-xl font-bold text-border mb-2 uppercase">Ubicación</Text>
          <Text className="text-border mb-4">{place.address}</Text>
          <View className="w-full h-48 bg-secondary border-4 border-border shadow-brutal mb-8 justify-center items-center relative overflow-hidden">
             <FontAwesome5 name="map-marked-alt" size={48} color={colors.border} className="opacity-50" />
             <Text className="text-border font-bold mt-2 uppercase">Mapa Interactivo</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar for Gamification */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t-4 border-border p-4 pb-8 flex-row items-center justify-between z-10"
        style={{
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 8,
        }}
      >
        <View>
          <Text className="text-border font-bold uppercase text-xs">Recompensa</Text>
          <View className="flex-row items-center">
             <Text className="text-primary font-black text-2xl">+{place.reward} HZ</Text>
             {(place as any).nftReward && (
                <View className="bg-accent2 ml-2 px-1 border-2 border-border shadow-brutal-sm">
                   <Text className="text-border font-bold text-xs uppercase">+ Estampa</Text>
                </View>
             )}
          </View>
        </View>
        <BrutalistButton 
          title="ESCANEAR AHORA" 
          colorClass="bg-accent1" 
          onPress={() => router.push('/(tabs)/scan')}
        />
      </View>
    </View>
  );
}
