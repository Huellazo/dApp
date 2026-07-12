import React, { useState } from 'react';
import { View, Text, Modal, Image, ScrollView, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useAppState } from '@/context/app-state';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function TradeAcceptModal({ visible, onClose }: Props) {
  const { ownedNfts, executeTrade } = useAppState();
  const [selectedMyNftId, setSelectedMyNftId] = useState<string | null>(null);

  // Mock incoming NFT for simulation
  const incomingNft = {
    id: 'mock-incoming-1',
    title: 'Mystic Axolotl',
    location: 'Xochimilco Secret Canals',
    image: require('@/assets/images/nft_alebrije.png'),
    date: new Date().toISOString(),
    style: 'rare'
  };

  const handleConfirm = () => {
    if (!selectedMyNftId) return;
    executeTrade(selectedMyNftId, incomingNft);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/90 pt-12 px-2 pb-6">
        
        <Text className="text-white font-black text-2xl uppercase mb-4 text-center tracking-widest bg-primary px-4 py-2 self-center border-4 border-border shadow-brutal-sm">
          Incoming Trade
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          
          {/* Incoming Offer */}
          <BrutalistCard colorClass="bg-background w-full p-0 overflow-hidden mb-6">
            <View className="w-full bg-accent2 p-3 border-b-4 border-border justify-center items-center">
               <Text className="text-border font-black text-sm uppercase">Another explorer offers:</Text>
            </View>
            <View className="p-4 flex-row items-center">
              <View className="w-20 h-20 bg-accent1 border-4 border-border justify-center items-center relative mr-4">
                 <Image source={incomingNft.image} className="w-11/12 h-11/12" resizeMode="contain" />
              </View>
              <View className="flex-1">
                 <Text className="text-border font-black text-lg uppercase">{incomingNft.title}</Text>
                 <Text className="text-border font-bold text-xs opacity-70 mb-1">{incomingNft.location}</Text>
                 <Text className="text-border font-bold text-[10px] bg-secondary self-start px-2 py-0.5 border-2 border-border shadow-brutal-sm uppercase">{incomingNft.style}</Text>
              </View>
            </View>
          </BrutalistCard>

          {/* User's Selection */}
          <Text className="text-white font-black text-lg uppercase mb-4 ml-2">
            Select an NFT to trade:
          </Text>

          <View className="flex-row flex-wrap justify-between px-1">
            {ownedNfts.map((nft) => (
              <Pressable key={nft.id} className="w-[48%] mb-4 active:scale-95 transition-transform" onPress={() => setSelectedMyNftId(nft.id)}>
                <BrutalistCard colorClass={selectedMyNftId === nft.id ? 'bg-primary' : 'bg-background'} customStyle={{ padding: 0 }}>
                  <View style={{ aspectRatio: 1 }} className={`w-full ${nft.style === 'chromatic' ? 'bg-[#FF00FF]' : nft.style === 'metallic' ? 'bg-[#C0C0C0]' : 'bg-accent1'} border-b-4 border-border justify-center items-center relative overflow-hidden`}>
                    {nft.image ? (
                      <Image source={nft.image as any} className="w-11/12 h-11/12" resizeMode="contain" />
                    ) : (
                      <Text className="text-border font-black text-4xl opacity-50">?</Text>
                    )}
                  </View>
                  <View className="p-2">
                    <Text className="text-border font-black text-[10px] uppercase" numberOfLines={1}>{nft.title}</Text>
                  </View>
                </BrutalistCard>
              </Pressable>
            ))}
          </View>

        </ScrollView>
        
        {/* Actions */}
        <View className="pt-4 flex-row justify-between w-full">
           <View className="flex-1 mr-2">
             <BrutalistButton title="Cancel" colorClass="bg-secondary" onPress={onClose} />
           </View>
           <View className="flex-1 ml-2">
             <BrutalistButton 
               title="Confirm Swap" 
               colorClass="bg-accent1" 
               disabled={!selectedMyNftId}
               onPress={handleConfirm} 
             />
           </View>
        </View>

      </View>
    </Modal>
  );
}
