import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { MOCK_USER } from '@/mocks/db';

export default function PassportScreen() {
  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-bold text-border mb-6 uppercase tracking-tight">My Passport</Text>
      
      <BrutalistCard title="Traveler (PDA)" colorClass="bg-accent2 mb-6">
        <Text className="text-border font-bold mb-1">Level: {MOCK_USER.passportLevel}</Text>
        <Text className="text-border text-xs mb-4" numberOfLines={1} ellipsizeMode="middle">
          {MOCK_USER.publicKey}
        </Text>
        <View className="h-4 w-full bg-background border-2 border-border mt-2">
          <View className="h-full bg-primary border-r-2 border-border" style={{ width: '60%' }} />
        </View>
        <Text className="text-border text-xs mt-1 text-right">600 / 1000 XP</Text>
      </BrutalistCard>

      <Text className="text-xl font-bold text-border mb-4 uppercase">Stamps (NFTs)</Text>
      <View className="flex-row flex-wrap justify-between">
        {MOCK_USER.nfts.map(nft => (
          <View key={nft.id} className="w-[48%] mb-4">
            <BrutalistCard colorClass="bg-secondary p-2">
              <View className="w-full aspect-square bg-border mb-2 border-2 border-border overflow-hidden">
                {nft.image ? (
                  <Image source={nft.image as any} className="w-full h-full" resizeMode="cover" />
                ) : null}
              </View>
              <Text className="text-border font-bold text-sm uppercase">{nft.title}</Text>
              <Text className="text-border text-xs mt-1">{nft.location}</Text>
            </BrutalistCard>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
