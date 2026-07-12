import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useAppState } from '@/context/app-state';
import { MOCK_POIS, MOCK_USER } from '@/mocks/db';

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function PassportScreen() {
  const { earnedTokens, xp, points } = useAppState();
  const totalStamps = MOCK_USER.nfts.length + earnedTokens.length;

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
            <Text className="text-border text-xs font-bold">{xp} XP</Text>
          </View>
          <View className="h-6 w-full bg-background border-4 border-border shadow-brutal-sm">
            <View className="h-full bg-accent2 border-r-4 border-border" style={{ width: '60%' }} />
          </View>

          <View className="flex-row mt-4">
            <View className="flex-1 bg-primary border-4 border-border p-2 mr-2">
              <Text className="text-border font-black text-xl">{totalStamps}</Text>
              <Text className="text-border font-bold text-[10px] uppercase">Tokens</Text>
            </View>
            <View className="flex-1 bg-accent2 border-4 border-border p-2">
              <Text className="text-border font-black text-xl">{points}</Text>
              <Text className="text-border font-bold text-[10px] uppercase">$HUELLAZOS</Text>
            </View>
          </View>
        </View>
      </BrutalistCard>

      <Text className="text-xl font-black text-border mb-4 uppercase">Tokens Huellazo en Solana</Text>
      {earnedTokens.length === 0 ? (
        <BrutalistCard colorClass="bg-accent1 mb-8">
          <Text className="text-border font-black text-lg uppercase mb-2">Aun no tienes tokens nuevos</Text>
          <Text className="text-border font-bold text-sm">
            Entra a Huellazo Radar, simula un escaneo y se agregara aqui tu token de visita como mint simulado en Solana.
          </Text>
        </BrutalistCard>
      ) : (
        <View className="flex-row flex-wrap justify-between mb-4">
          {earnedTokens.map(token => {
            const poi = MOCK_POIS.find(item => item.id === token.poiId);

            return (
              <View key={token.id} className="w-[48%] mb-6">
                <BrutalistCard colorClass="bg-background p-0 overflow-hidden">
                  <View style={{ aspectRatio: 1 }} className="w-full bg-accent2 border-b-4 border-border justify-center items-center relative overflow-hidden">
                    {poi?.image ? (
                      <Image source={poi.image as any} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <Text className="text-border font-black text-4xl opacity-50">H</Text>
                    )}
                  </View>
                  <View className="p-3 bg-secondary">
                    <Text className="text-border font-black text-sm uppercase" numberOfLines={2}>{token.name}</Text>
                    <Text className="text-border text-xs font-bold mt-1 opacity-80" numberOfLines={1}>{token.location}</Text>
                    <View className="bg-background border-2 border-border p-2 mt-3">
                      <Text className="text-border font-black text-[10px] uppercase">Mint</Text>
                      <Text className="text-border font-bold text-xs">{shortHash(token.mintAddress)}</Text>
                      <Text className="text-border font-black text-[10px] uppercase mt-2">Reward</Text>
                      <Text className="text-border font-bold text-xs">+{token.reward} $HUELLAZOS</Text>
                    </View>
                  </View>
                </BrutalistCard>
              </View>
            );
          })}
        </View>
      )}

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
