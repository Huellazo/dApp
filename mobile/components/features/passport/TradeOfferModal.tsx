import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Image, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
// @ts-ignore
import QRCode from 'qrcode';

interface Props {
  visible: boolean;
  nft: any;
  onClose: () => void;
}

export function TradeOfferModal({ visible, nft, onClose }: Props) {
  const [qrUri, setQrUri] = useState<string | null>(null);

  useEffect(() => {
    if (visible && nft) {
      const payload = `huellazo:trade?stampId=${nft.id}&title=${encodeURIComponent(nft.title || nft.name || 'Estampa')}&location=${encodeURIComponent(nft.location || '')}&ts=${Date.now()}`;
      QRCode.toDataURL(payload, { width: 300, margin: 2 })
        .then(setQrUri)
        .catch(console.error);
    } else {
      setQrUri(null);
    }
  }, [visible, nft]);

  if (!nft) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/90 justify-center items-center px-4">
        
        <Text className="text-white font-black text-2xl uppercase mb-4 text-center tracking-widest">
          Intercambio de Estampa
        </Text>

        <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden items-center">
          <View className="w-full bg-accent1 p-4 border-b-4 border-border justify-center items-center">
             <Text className="text-background font-black text-base uppercase">Ofreciendo estampa:</Text>
             <Text className="text-background font-bold text-lg">{nft.title || nft.name}</Text>
          </View>
          
          <View className="p-6 items-center bg-white w-full border-b-4 border-border">
            {/* Real Generated QR Code */}
            <View className="w-52 h-52 border-4 border-border justify-center items-center p-2 bg-white shadow-brutal-sm">
              {qrUri ? (
                <Image source={{ uri: qrUri }} className="w-full h-full" resizeMode="contain" />
              ) : (
                <ActivityIndicator size="large" color={colors.primary} />
              )}
            </View>
            
            <Text className="text-border font-bold text-xs text-center mt-4 leading-relaxed">
              Muestra este código QR para que otro explorador lo escanee desde su aplicación y reciba la estampa.
            </Text>
          </View>
          
          <View className="p-4 w-full bg-secondary">
             <View className="flex-row items-center justify-center mb-4">
                <FontAwesome5 name="qrcode" size={18} color={colors.border} className="mr-2" />
                <Text className="text-border font-black text-xs uppercase">Código Listo para Escaneo P2P</Text>
             </View>
             <BrutalistButton title="Cerrar Intercambio" colorClass="bg-primary" onPress={onClose} />
          </View>
        </BrutalistCard>

      </View>
    </Modal>
  );
}
