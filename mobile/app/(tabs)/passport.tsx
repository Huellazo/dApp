import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { MOCK_USER } from '@/mocks/db';

export default function PassportScreen() {
  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-black text-border mb-6 uppercase tracking-tight">My Passport</Text>
      
      <BrutalistCard colorClass="bg-secondary mb-8 p-0 overflow-hidden">
        <View className="bg-primary p-4 border-b-4 border-border flex-row items-center justify-between">
          <Text className="text-border font-black text-xl uppercase">Level: {MOCK_USER.passportLevel}</Text>
          <View className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm">
            <Text className="text-border font-bold text-xs uppercase">Traveler</Text>
          </View>
        </View>
        <View className="p-4 bg-background">
          <Text className="text-border font-bold text-xs uppercase opacity-70 mb-1">Identity (PDA)</Text>
          <Text className="text-border text-sm font-bold mb-4 bg-secondary/30 p-2 border-2 border-border" numberOfLines={1} ellipsizeMode="middle">
            {MOCK_USER.publicKey}
          </Text>
          
          <View className="flex-row justify-between mb-1">
            <Text className="text-border font-bold text-xs uppercase">Progress</Text>
            <Text className="text-border text-xs font-bold">600 / 1000 XP</Text>
          </View>
          <View className="h-6 w-full bg-background border-4 border-border shadow-brutal-sm">
            <View className="h-full bg-accent2 border-r-4 border-border" style={{ width: '60%' }} />
          </View>
        </View>
      </BrutalistCard>

      <Text className="text-xl font-black text-border mb-4 uppercase">Stamps & Trophies</Text>
      <View className="flex-row flex-wrap justify-between">
        {MOCK_USER.nfts.map(nft => (
          <View key={nft.id} className="w-[48%] mb-6">
            <BrutalistCard colorClass="bg-background p-0 overflow-hidden">
              <View style={{ aspectRatio: 1 }} className="w-full bg-accent1 border-b-4 border-border justify-center items-center relative overflow-hidden">
                {nft.image ? (
                  <Image source={nft.image as any} className="w-11/12 h-11/12" resizeMode="contain" />
                ) : (
                  <Text className="text-border font-black text-4xl opacity-50">?</Text>
                )}
              </View>
              <View className="p-3 bg-secondary">
                <Text className="text-border font-black text-sm uppercase" numberOfLines={1}>{nft.title}</Text>
                <Text className="text-border text-xs font-bold mt-1 opacity-80">{nft.location}</Text>
              </View>
            </BrutalistCard>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
