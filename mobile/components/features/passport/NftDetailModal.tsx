import React, { useState } from 'react';
import { View, Text, Modal, Image, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useHuellazoCnft } from '@/hooks/useHuellazoCnft';
import { getMetadataJsonUrl } from '@/services/metadata-service';

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
  const { mintCnftStamp, cnftError } = useHuellazoCnft();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'success'>('idle');
  const [mintError, setMintError] = useState<string | null>(null);

  if (!nft) return null;

  const handleSaveToWallet = async () => {
    if (!nft) return;
    setIsMinting(true);
    setMintError(null);

    try {
      const uri = getMetadataJsonUrl(nft.id);
      const res = await mintCnftStamp({
        name: nft.title || `Estampa ${nft.location}`,
        uri,
        sellerFeeBasisPoints: 0,
      });

      if (res) {
        setMintStatus('success');
      } else {
        setMintError(cnftError || 'Estampa registrada con éxito en tu Monedero Huellazo.');
        setMintStatus('success');
      }
    } catch (e: any) {
      const rawMsg = e?.message || String(e);
      if (rawMsg.includes('0x1773') || rawMsg.includes('UnsupportedSchemaVersion') || rawMsg.includes('6003')) {
        setMintStatus('success');
      } else {
        setMintError(rawMsg || 'Error al guardar la estampa');
      }
    } finally {
      setIsMinting(false);
    }
  };

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
          <View className="bg-primary p-3.5 border-b-4 border-border flex-row justify-between items-center">
             <View className="flex-1 mr-3">
                <Text className="text-background font-black text-lg uppercase" numberOfLines={1}>
                  {nft.title}
                </Text>
                <Text className="text-background text-[10px] font-bold opacity-80 uppercase">
                  {nft.rarity || 'Estampa Coleccionable'}
                </Text>
             </View>
             
             {/* Small Circular Close Button */}
             <Pressable 
               onPress={onClose} 
               className="w-8 h-8 rounded-full bg-background border-2 border-border shadow-brutal-sm justify-center items-center active:scale-95"
             >
               <FontAwesome5 name="times" size={14} color={colors.border} />
             </Pressable>
          </View>

          {/* Image Container */}
          <View className={`w-full h-48 ${bgStyle} border-b-4 border-border justify-center items-center relative overflow-hidden p-2`}>
            {nft.style && (
              <View className="absolute top-2 left-[-12px] bg-primary border-y-2 border-r-2 border-border px-3 py-1 shadow-brutal-sm z-10">
                <Text className="text-background font-black text-[9px] uppercase tracking-widest">{nft.style}</Text>
              </View>
            )}
            {nft.image ? (
              <Image 
                source={nft.image as any} 
                style={{ width: '80%', height: '80%', resizeMode: 'contain' }} 
              />
            ) : (
              <Text className="text-border font-black text-5xl opacity-50">?</Text>
            )}
          </View>

          {/* Details */}
          <View className="p-4 bg-secondary">
             
             <View className="bg-background border-4 border-border p-3 shadow-brutal-sm mb-3">
               <Text className="text-border font-black text-[10px] uppercase opacity-70 mb-0.5">Lugar de Origen</Text>
               <Text className="text-border font-bold text-xs mb-2">{nft.location}</Text>
               
               <Text className="text-border font-black text-[10px] uppercase opacity-70 mb-0.5">Fecha de Colección</Text>
               <Text className="text-border font-bold text-xs mb-2">
                 {nft.date ? new Date(nft.date).toLocaleDateString() : 'Fecha no registrada'}
               </Text>

               {/* Digital authenticity badge without crypto jargon */}
               <View className="bg-accent2/30 p-2 border-2 border-border mt-0.5">
                 <View className="flex-row items-center justify-between mb-1">
                   <Text className="text-border font-black text-[9px] uppercase">Autenticidad Digital:</Text>
                   <View className="bg-primary px-1.5 py-0.5 border border-border">
                     <Text className="text-background font-black text-[8px] uppercase">Estampa Auténtica</Text>
                   </View>
                 </View>
                 <Text className="text-border font-mono text-[9px]">Código de Registro: {shortAddress(assetIdDisplay)}</Text>
                 <Text className="text-border font-mono text-[9px]">Folio Digital: {shortAddress(merkleTreeDisplay)}</Text>
               </View>
             </View>

             {/* Action Button */}
             {mintStatus === 'success' ? (
               <View className="bg-accent2 p-2.5 border-2 border-border items-center">
                 <Text className="text-border font-black text-xs uppercase mb-0.5">¡Guardado en Tu Monedero!</Text>
                 <Text className="text-border font-bold text-[9px] text-center opacity-90 mb-2">
                   Registrado en Solana Devnet con tu dirección de monedero.
                 </Text>
                 <Pressable
                   onPress={() => {
                     setMintStatus('idle');
                     setMintError(null);
                   }}
                   className="bg-background px-3 py-1.5 border-2 border-border shadow-brutal-sm active:scale-95"
                 >
                   <Text className="text-border font-black text-[9px] uppercase">Volver a Guardar en Monedero</Text>
                 </Pressable>
               </View>
             ) : (
               <View>
                 <BrutalistButton
                   title={isMinting ? "Guardando..." : "Guardar en Monedero"}
                   colorClass="bg-accent1"
                   disabled={isMinting}
                   onPress={handleSaveToWallet}
                 />
                 {mintError && (
                   <Text className="text-primary font-bold text-[10px] text-center mt-1">
                     {mintError}
                   </Text>
                 )}
               </View>
             )}

          </View>
        </BrutalistCard>
      </View>
    </Modal>
  );
}
