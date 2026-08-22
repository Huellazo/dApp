import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, Share, ScrollView, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { BlinkService } from '@/services/blink-service';

interface ShareBlinkModalProps {
  visible: boolean;
  onClose: () => void;
  stampTitle?: string;
  stampImage?: string;
  poiId?: string;
}

export function ShareBlinkModal({
  visible,
  onClose,
  stampTitle = 'Estampa de Pasaporte Huellazo',
  stampImage,
  poiId = 'poi3',
}: ShareBlinkModalProps) {
  if (!visible) return null;

  const blinkMeta = BlinkService.getBlinkMetadata(poiId);
  const dialectDialToUrl = BlinkService.getDialectBlinkUrl(poiId);
  const displayImageUri = stampImage || blinkMeta.imageUrl;

  const handleShareToTwitter = async () => {
    const twitterUrl = BlinkService.getTwitterShareUrl(stampTitle, poiId);
    await Linking.openURL(twitterUrl).catch(console.warn);
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `¡Obtuve mi estampa digital "${stampTitle}" en Huellazo! ☀️\n\n🖼️ Imagen: ${displayImageUri}\n\nReclama la tuya:\n${dialectDialToUrl}`,
        title: 'Compartir Estampa Huellazo en Redes Sociales',
      });
    } catch (err) {
      console.warn('Share notice:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <BrutalistCard 
          colorClass="bg-background" 
          className="w-full max-w-md p-0 overflow-hidden"
          style={{ backgroundColor: colors.background, borderColor: colors.border }}
        >
          {/* Header Neo-Brutalista */}
          <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="share-social" size={22} color="#FAF9F6" />
              <Text className="text-xl font-black text-background uppercase tracking-wide">
                COMPARTIR EN REDES
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              className="w-8 h-8 rounded-full bg-background border-2 border-border justify-center items-center active:scale-95 shadow-brutal-sm"
            >
              <Feather name="x" size={18} color={colors.border} />
            </TouchableOpacity>
          </View>

          <View className="p-5 items-center">
            {/* Visual Stamp Image Preview */}
            <View 
              className="w-28 h-28 border-4 border-border rounded-xl mb-3 overflow-hidden shadow-brutal-sm bg-white"
              style={{ borderColor: colors.border }}
            >
              <Image 
                source={{ uri: displayImageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <Text className="text-border font-black text-lg uppercase text-center mb-1">
              {stampTitle}
            </Text>

            <Text className="text-border text-xs font-bold leading-relaxed text-center mb-4">
              ¡Muestra tus logros turísticos al mundo! Cualquier persona que vea tu publicación en <Text className="text-primary font-black">X (Twitter)</Text> o redes sociales podrá interactuar con tu estampa y obtener Puntos Huellazos ($HZ) con un solo toque.
            </Text>

            {/* Enlace Interactivo Box */}
            <View 
              className="p-3 border-3 border-border mb-5"
              style={{ backgroundColor: '#F2CC8F', borderColor: colors.border, borderWidth: 3 }}
            >
              <Text className="text-[10px] font-black text-border uppercase mb-1">
                ENLACE INTERACTIVO DE PASAPORTE:
              </Text>
              <ScrollView 
                nestedScrollEnabled 
                style={{ maxHeight: 90 }} 
                contentContainerStyle={{ paddingVertical: 2 }}
                showsVerticalScrollIndicator={true}
              >
                <Text 
                  selectable 
                  className="text-xs font-mono text-border font-bold mb-1"
                >
                  {dialectDialToUrl}
                </Text>
              </ScrollView>
              <Text className="text-[9px] text-border/80 font-bold mt-1">
                ✓ Enlace completo verificado y compatible con la red oficial de Huellazo.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3 mb-2">
              <BrutalistButton
                title="COMPARTIR EN X (TWITTER)"
                colorClass="bg-primary"
                onPress={handleShareToTwitter}
              />
              <BrutalistButton
                title="COPIAR ENLACE INTERACTIVO"
                colorClass="bg-accent1"
                onPress={handleNativeShare}
              />
            </View>
          </View>
        </BrutalistCard>
      </View>
    </Modal>
  );
}
