import React from 'react';
import { View, Text, Modal, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';

interface NftData {
  id: string;
  title: string;
  location: string;
  image: any;
  date?: string;
  style?: string;
}

interface Props {
  visible: boolean;
  nft: NftData | null;
  onClose: () => void;
  onTradePress?: () => void;
}

export function NftDetailModal({ visible, nft, onClose, onTradePress }: Props) {
  if (!nft) return null;

  const bgStyle = nft.style === 'chromatic' ? 'bg-[#FF00FF]' : nft.style === 'metallic' ? 'bg-[#C0C0C0]' : 'bg-accent1';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/90 justify-center items-center p-4 pt-12">
        <ScrollView className="w-full max-w-md" showsVerticalScrollIndicator={false}>
          <BrutalistCard colorClass="bg-background p-0 overflow-hidden mb-6">
            
            {/* Header */}
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase truncate" numberOfLines={1}>
                 {nft.title}
               </Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={onClose} style={{ padding: 4 }} />
            </View>

            {/* Image Container */}
            <View className={`w-full aspect-square ${bgStyle} border-b-4 border-border justify-center items-center relative overflow-hidden`}>
              {nft.style && (
                <View className="absolute top-4 left-[-16px] bg-primary border-y-4 border-r-4 border-border px-4 py-2 shadow-brutal-sm z-10">
                  <Text className="text-background font-black text-xs uppercase tracking-widest">{nft.style}</Text>
                </View>
              )}
              {nft.image ? (
                <Image source={nft.image as any} className="w-11/12 h-11/12" resizeMode="contain" />
              ) : (
                <Text className="text-border font-black text-6xl opacity-50">?</Text>
              )}
            </View>

            {/* Details */}
            <View className="p-6 bg-secondary">
               
               <View className="bg-background border-4 border-border p-4 shadow-brutal-sm mb-6">
                 <Text className="text-border font-black text-xs uppercase opacity-70 mb-1">Lugar de Origen</Text>
                 <Text className="text-border font-bold text-lg mb-4">{nft.location}</Text>
                 
                 <Text className="text-border font-black text-xs uppercase opacity-70 mb-1">Fecha de Colección</Text>
                 <Text className="text-border font-bold text-base">
                   {nft.date ? new Date(nft.date).toLocaleDateString() : 'Fecha no registrada'}
                 </Text>
               </View>

               <Text className="text-border font-bold text-xs text-center opacity-80 mb-4 px-2">
                 Esta estampa es un recuerdo digital único guardado en tu Pasaporte de Huellazo.
               </Text>

               {/* Action Buttons */}
               <View className="w-full flex-row justify-between">
                 <View className="flex-1 mr-2">
                   <BrutalistButton 
                     title="Intercambiar" 
                     colorClass="bg-accent2" 
                     disabled={false}
                     onPress={onTradePress} 
                   />
                 </View>
                 <View className="flex-1 ml-2">
                   <BrutalistButton 
                     title="Volver" 
                     colorClass="bg-primary" 
                     onPress={onClose} 
                   />
                 </View>
               </View>
            </View>
          </BrutalistCard>
        </ScrollView>
      </View>
    </Modal>
  );
}
