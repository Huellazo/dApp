import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const place = MOCK_POIS.find(p => p.id === id);
  const [ticketCount, setTicketCount] = useState(1);

  if (!place) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-border font-bold text-xl uppercase">Business not found</Text>
        <BrutalistButton title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 pb-32">
        
        {/* Banner Header */}
        <View className="h-64 w-full border-b-4 border-border relative bg-accent2 overflow-hidden items-center justify-center">
          {place.image ? (
            <Image 
              source={place.image as any} 
              className="w-11/12 h-5/6"
              resizeMode="contain"
            />
          ) : (
            <View className="flex-1 justify-center items-center opacity-50">
               <Text className="text-border font-black text-2xl uppercase">[ NO IMAGE ]</Text>
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
            <FontAwesome5 name="heart" size={20} color={colors.border} />
          </Pressable>
        </View>

        <View className="p-4 mt-2">
          {/* Main Title Brutalist Style */}
          <View className="bg-primary border-4 border-border shadow-brutal p-4 mb-6 -mt-8 mx-2 z-30">
            <Text className="text-3xl font-black text-border uppercase tracking-tight text-center">
              {place.name}
            </Text>
          </View>
          
          {/* Features / Categories with Checkmarks */}
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

          {/* Description */}
          <Text className="text-xl font-bold text-border mb-2 uppercase">About Us</Text>
          <Text className="text-border text-base leading-relaxed mb-6">
            {place.description}
          </Text>

          {/* Info Cards (Duration & Price) */}
          <View className="flex-row justify-between mb-6">
            <BrutalistCard colorClass="bg-background w-[48%] items-center py-4">
              <View className="bg-primary rounded-full p-3 border-4 border-border mb-2 shadow-brutal-sm">
                <FontAwesome5 name="clock" size={20} color={colors.border} />
              </View>
              <Text className="text-border text-xs uppercase mb-1">Duration</Text>
              <Text className="text-border font-black">{place.duration || 'N/A'}</Text>
            </BrutalistCard>

            <BrutalistCard colorClass="bg-background w-[48%] items-center py-4">
              <View className="bg-accent2 rounded-full p-3 border-4 border-border mb-2 shadow-brutal-sm">
                <FontAwesome5 name="tag" size={20} color={colors.border} />
              </View>
              <Text className="text-border text-xs uppercase mb-1">Price</Text>
              <Text className="text-border font-black">{place.price || 'Free'}</Text>
            </BrutalistCard>
          </View>

          {/* Location / Map Placeholder */}
          <Text className="text-xl font-bold text-border mb-2 uppercase">Location</Text>
          <Text className="text-border mb-4">{place.address}</Text>
          <View className="w-full h-48 bg-secondary border-4 border-border shadow-brutal mb-8 justify-center items-center relative overflow-hidden">
             <FontAwesome5 name="map-marked-alt" size={48} color={colors.border} className="opacity-50" />
             <Text className="text-border font-bold mt-2 uppercase">Interactive Map</Text>
          </View>

          {/* Booking / Service Section */}
          <Text className="text-xl font-bold text-border mb-4 uppercase">Book your Experience</Text>
          
          <Text className="text-border font-bold mb-2">Select a time:</Text>
          <View className="bg-background border-4 border-border shadow-brutal flex-row justify-between items-center px-4 py-4 mb-6">
            <Text className="text-border font-bold">Wed, Oct 22, 07:02 p.m.</Text>
            <FontAwesome5 name="chevron-down" size={16} color={colors.border} />
          </View>

          <BrutalistCard colorClass="bg-secondary mb-12">
            <Text className="text-border font-bold uppercase mb-1">Tickets / Reservations</Text>
            <Text className="text-primary font-bold mb-6">Available: 20</Text>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Pressable onPress={() => setTicketCount(Math.max(1, ticketCount - 1))} className="active:opacity-50">
                  <FontAwesome5 name="minus-circle" size={28} color={colors.primary} />
                </Pressable>
                <Text className="text-border font-black text-2xl mx-4">{ticketCount}</Text>
                <Pressable onPress={() => setTicketCount(ticketCount + 1)} className="active:opacity-50">
                  <FontAwesome5 name="plus-circle" size={28} color={colors.primary} />
                </Pressable>
              </View>
              <BrutalistButton title="Login to Book" colorClass="bg-primary" />
            </View>
          </BrutalistCard>

        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar for Commerce */}
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
          <Text className="text-border font-bold uppercase text-xs">Discount</Text>
          <Text className="text-primary font-black text-2xl">-15% OFF</Text>
        </View>
        <BrutalistButton 
          title="USE $HUELLAZOS" 
          colorClass="bg-accent2" 
          onPress={() => {
            // Optional: You could pop up Solana Pay here
            console.log('Paying with HZ/SOL');
          }}
        />
      </View>
    </View>
  );
}
