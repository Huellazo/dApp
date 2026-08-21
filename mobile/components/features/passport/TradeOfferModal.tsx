import React from 'react';
import { View, Text, Modal, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';

interface Props {
  visible: boolean;
  nft: any;
  onClose: () => void;
}

export function TradeOfferModal({ visible, nft, onClose }: Props) {
  if (!nft) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/90 justify-center items-center px-4">
        
        <Text className="text-white font-black text-2xl uppercase mb-6 text-center tracking-widest">
          Iniciando Intercambio
        </Text>

        <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden items-center">
          <View className="w-full bg-accent1 p-4 border-b-4 border-border justify-center items-center">
             <Text className="text-background font-black text-base uppercase">Ofreciendo estampa:</Text>
             <Text className="text-background font-bold">{nft.title}</Text>
          </View>
          
          <View className="p-8 items-center bg-white w-full border-b-4 border-border">
            {/* Mock QR Code */}
            <View className="w-48 h-48 border-8 border-black justify-center items-center p-2">
              <View className="w-full h-full bg-black flex-row flex-wrap">
                 {Array.from({ length: 16 }).map((_, i) => (
                   <View key={i} className="w-1/4 h-1/4 p-0.5">
                     <View className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`} />
                   </View>
                 ))}
                 <View className="absolute inset-0 justify-center items-center">
                   <View className="bg-white p-2">
                     <FontAwesome5 name="qrcode" size={48} color={colors.border} />
                   </View>
                 </View>
              </View>
            </View>
            
            <Text className="text-border font-bold text-center mt-6">
              Pídele a otro explorador que escanee este código QR con su Radar Huellazo para completar el intercambio.
            </Text>
          </View>
          
          <View className="p-4 w-full bg-secondary">
             <View className="flex-row items-center justify-center mb-4">
                <FontAwesome5 name="spinner" size={20} color={colors.border} className="mr-3" />
                <Text className="text-border font-black uppercase">Esperando escaneo del compañero...</Text>
             </View>
             <BrutalistButton title="Cancelar Intercambio" colorClass="bg-primary" onPress={onClose} />
          </View>
        </BrutalistCard>

      </View>
    </Modal>
  );
}
