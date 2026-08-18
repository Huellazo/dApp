import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { NftDetailModal } from '@/components/features/passport/NftDetailModal';
import { TradeOfferModal } from '@/components/features/passport/TradeOfferModal';
import { PinataModal } from '@/components/features/wallet/PinataModal';
import { useAppState } from '@/context/app-state';
import { MOCK_POIS } from '@/mocks/db';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function CollectionsScreen() {
  const { earnedTokens, inventory, ownedNfts } = useAppState();
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [isTradeOfferVisible, setTradeOfferVisible] = useState(false);
  const [isPinataModalVisible, setPinataModalVisible] = useState(false);
  
  const inventoryNfts = inventory.filter(item => item.type === 'nft').map(item => ({
    id: item.id,
    title: item.name,
    location: item.description || 'Unknown',
    image: item.image,
    date: item.obtainedAt,
    style: item.style
  }));

  const nonNftInventory = inventory.filter(item => item.type !== 'nft');
  const allNfts = [...ownedNfts, ...inventoryNfts];

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-black text-border mb-6 uppercase tracking-tight">Collections</Text>
      
      {/* Store & Piñata Section */}
      <BrutalistCard colorClass="bg-accent1 mb-8 items-center py-6">
        <FontAwesome5 name="store" size={32} color={colors.border} className="mb-2" />
        <Text className="text-border font-black uppercase mb-1 text-center text-xl">Loot & Shop</Text>
        <Text className="text-border text-xs text-center font-bold bg-background/50 py-2 px-4 mb-4">
          Spend your $HUELLAZOS to unlock exclusive cosmetics, coupons, and NFTs!
        </Text>
        
        <View className="w-full px-2">
          <BrutalistButton 
            title="Break Digital Piñata (100 HZ)" 
            colorClass="bg-primary" 
            onPress={() => setPinataModalVisible(true)} 
          />
        </View>
      </BrutalistCard>

      <Text className="text-xl font-black text-border mb-4 uppercase">Tokens Huellazo en Solana</Text>
      {earnedTokens.length === 0 ? (
        <BrutalistCard colorClass="bg-accent2 mb-8 p-6 items-center">
          <FontAwesome5 name="map-marker-alt" size={32} color={colors.border} className="mb-2" />
          <Text className="text-border font-black text-lg uppercase mb-2 text-center">Sin Tokens Nuevos</Text>
          <Text className="text-border font-bold text-sm text-center">
            Entra a Huellazo Radar, simula un escaneo y se agregará aquí tu token de visita como mint simulado en Solana.
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
                      <Text className="text-border font-black text-[10px] uppercase">Firma</Text>
                      <Text className="text-border font-bold text-xs">{shortHash(token.mintAddress)}</Text>
                      <Text className="text-border font-black text-[10px] uppercase mt-2">Reward</Text>
                      <Text className="text-border font-bold text-xs">+{token.reward} HZ</Text>
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
        {allNfts.length === 0 ? (
          <View className="w-full bg-background border-4 border-border p-6 shadow-brutal items-center mb-8">
            <FontAwesome5 name="award" size={32} color={colors.border} className="mb-2" />
            <Text className="text-border font-bold uppercase text-center text-lg mb-2">No NFTs yet</Text>
          </View>
        ) : (
          allNfts.map((nft: any) => (
            <View key={nft.id} className="w-[48%] mb-6">
              <Pressable onPress={() => setSelectedNft(nft)} className="active:scale-95 transition-transform">
                <BrutalistCard colorClass="bg-background p-0 overflow-hidden">
                  <View style={{ aspectRatio: 1 }} className={`w-full ${nft.style === 'chromatic' ? 'bg-[#FF00FF]' : nft.style === 'metallic' ? 'bg-[#C0C0C0]' : 'bg-accent1'} border-b-4 border-border justify-center items-center relative overflow-hidden`}>
                    {nft.style && (
                      <View className="absolute top-2 left-[-10px] bg-primary border-y-4 border-r-4 border-border px-3 py-1 shadow-brutal-sm z-10">
                        <Text className="text-border font-black text-[8px] uppercase">{nft.style}</Text>
                      </View>
                    )}
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
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Inventory Section */}
      <Text className="text-xl font-black text-border mb-4 uppercase mt-8">My Inventory (Piñata Loot)</Text>
      
      {nonNftInventory.length === 0 ? (
        <View className="bg-background border-4 border-border p-6 shadow-brutal items-center mb-12">
          <FontAwesome5 name="box-open" size={32} color={colors.border} className="mb-2" />
          <Text className="text-border font-bold uppercase text-center text-lg mb-2">Inventory Empty</Text>
          <Text className="text-border text-xs text-center font-bold">Break a Piñata to earn cosmetics, coupons, and more!</Text>
        </View>
      ) : (
        <View className="mb-12">
          {nonNftInventory.map(item => (
            <View key={item.id} className="mb-4">
              <BrutalistCard colorClass="bg-background p-0 overflow-hidden flex-row">
                 <View className={`${item.type === 'trash' ? 'bg-secondary' : item.type === 'coupon' ? 'bg-primary' : 'bg-accent2'} w-24 h-24 border-r-4 border-border justify-center items-center`}>
                   {item.image ? (
                     <Image source={item.image as any} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                   ) : (
                     <Text className="text-border font-black text-2xl uppercase">?</Text>
                   )}
                 </View>
                 <View className="flex-1 p-3 bg-background justify-center">
                   <View className="bg-accent1 self-start px-2 py-0.5 border-2 border-border shadow-brutal-sm mb-1">
                     <Text className="text-border font-black text-[8px] uppercase">{item.type}</Text>
                   </View>
                   <Text className="text-border font-black text-base uppercase" numberOfLines={1}>{item.name}</Text>
                   <Text className="text-border text-xs font-bold mt-1">{item.description}</Text>
                 </View>
              </BrutalistCard>
            </View>
          ))}
        </View>
      )}

      <NftDetailModal 
        visible={!!selectedNft && !isTradeOfferVisible} 
        nft={selectedNft} 
        onClose={() => setSelectedNft(null)} 
        onTradePress={() => setTradeOfferVisible(true)}
      />

      <TradeOfferModal 
        visible={isTradeOfferVisible} 
        nft={selectedNft} 
        onClose={() => setTradeOfferVisible(false)} 
      />
      
      <PinataModal 
        visible={isPinataModalVisible} 
        onClose={() => setPinataModalVisible(false)} 
      />

    </ScrollView>
  );
}
