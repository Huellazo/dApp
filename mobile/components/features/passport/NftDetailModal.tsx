import React from 'react';
import { View, Text, Modal, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

export interface NFT {
  id: string;
  title: string;
  location: string;
  date?: string;
  image?: any;
  rarity?: string;
  style?: string;
  isSpecial?: boolean;
  assetId?: string;
  merkleTree?: string;
}

interface Props {
  visible: boolean;
  nft: NFT | null;
  onClose: () => void;
  onTradePress?: () => void;
}

function shortAddress(addr?: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
}

export function NftDetailModal({ visible, nft, onClose, onTradePress }: Props) {
  if (!nft) return null;

  const bgStyle = nft.isSpecial 
    ? 'bg-accent2' 
    : nft.rarity === 'Legendario' 
      ? 'bg-primary' 
      : nft.rarity === 'Épico' 
        ? 'bg-secondary' 
        : 'bg-accent1/30';

  const assetIdDisplay = nft.assetId || `cnft_leaf_${nft.id}`;
  const merkleTreeDisplay = nft.merkleTree || '8XbN77QkP11111111111111111111111111111111111';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden" variant="info">
          
          {/* Header */}
          <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
             <View className="flex-1 mr-2">
                <Text className="text-background font-black text-xl uppercase" numberOfLines={1}>
                  {nft.title}
                </Text>
                <Text className="text-background text-xs font-bold opacity-80 uppercase">
                  {nft.rarity || 'Estampa Coleccionable'}
                </Text>
             </View>
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
             
             <View className="bg-background border-4 border-border p-4 shadow-brutal-sm mb-4">
               <Text className="text-border font-black text-xs uppercase opacity-70 mb-1">Lugar de Origen</Text>
               <Text className="text-border font-bold text-base mb-3">{nft.location}</Text>
               
               <Text className="text-border font-black text-xs uppercase opacity-70 mb-1">Fecha de Colección</Text>
               <Text className="text-border font-bold text-sm mb-3">
                 {nft.date ? new Date(nft.date).toLocaleDateString() : 'Fecha no registrada'}
               </Text>

               {/* cNFT Metaplex Bubblegum V2 technical badge */}
               <View className="bg-accent2/30 p-2.5 border-2 border-border mt-1">
                 <View className="flex-row items-center justify-between mb-1">
                   <Text className="text-border font-black text-[10px] uppercase">Tecnología Web3:</Text>
                   <View className="bg-primary px-1.5 py-0.5 border border-border">
                     <Text className="text-background font-black text-[8px] uppercase">cNFT Bubblegum V2</Text>
                   </View>
                 </View>
                 <Text className="text-border font-mono text-[9px]">Asset ID: {shortAddress(assetIdDisplay)}</Text>
                 <Text className="text-border font-mono text-[9px]">Árbol Merkle: {shortAddress(merkleTreeDisplay)}</Text>
               </View>
             </View>

             <Text className="text-border font-bold text-xs text-center opacity-80 mb-4 px-2">
               Esta estampa es un Compressed NFT (cNFT) verificado en el Merkle Tree de Solana Devnet.
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
      </View>
    </Modal>
  );
}
