import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useLanguage } from '@/context/language-context';

interface StickerClaimAnimationProps {
  visible: boolean;
  title: string;
  location: string;
  rewardPoints: number;
  image?: any;
  mintAddress?: string;
  alreadyMinted?: boolean;
  onClose: () => void;
  onGoToPassport: () => void;
}

export function StickerClaimAnimation({
  visible,
  title,
  location,
  rewardPoints,
  image,
  mintAddress,
  alreadyMinted,
  onClose,
  onGoToPassport,
}: StickerClaimAnimationProps) {
  const { language } = useLanguage();

  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.2);
      rotateAnim.setValue(0);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 14000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  if (!visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="absolute inset-0 z-50 bg-black/80 justify-center items-center p-4">
      {/* Fondo de rayos rotatorios animado */}
      <Animated.View
        style={{ transform: [{ rotate: spin }] }}
        className="absolute w-80 h-80 rounded-full border-4 border-dashed border-accent2/30 opacity-30 justify-center items-center"
      />

      {/* Card principal unificada que abarca el modal de escaneo de forma limpia */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-full max-w-sm">
        <BrutalistCard colorClass="bg-background p-0 overflow-hidden rounded-2xl border-4 border-border shadow-brutal" variant="info">
          
          {/* Header Superior */}
          <View className={`${alreadyMinted ? 'bg-primary' : 'bg-accent2'} p-4 border-b-4 border-border flex-row justify-between items-center`}>
            <View className="flex-row items-center flex-1 mr-2">
              <FontAwesome5
                name={alreadyMinted ? 'check-circle' : 'medal'}
                size={20}
                color={alreadyMinted ? '#FAF9F6' : colors.border}
                style={{ marginRight: 8 }}
              />
              <Text className={`${alreadyMinted ? 'text-background' : 'text-border'} font-black text-base uppercase`} numberOfLines={1}>
                {alreadyMinted
                  ? (language === 'es' ? '¡ESTAMPA REGISTRADA!' : 'STAMP ALREADY OWNED!')
                  : (language === 'es' ? '¡NUEVA ESTAMPA SOLANA!' : 'NEW SOLANA STAMP!')}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-background border-2 border-border justify-center items-center shadow-brutal-sm active:scale-95"
            >
              <FontAwesome5 name="times" size={14} color={colors.border} />
            </Pressable>
          </View>

          {/* Cuerpo Central Unificado */}
          <View className="p-5 items-center bg-surface/30">
            
            {/* Imagen de la Estampa cNFT */}
            <View className="w-40 h-40 bg-background border-4 border-border shadow-brutal-md mb-4 justify-center items-center overflow-hidden p-2 rounded-2xl relative">
              {image ? (
                <Image
                  source={typeof image === 'string' ? { uri: image } : image}
                  style={{ width: '100%', height: '100%', borderRadius: 12 }}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5 name="award" size={56} color={colors.border} />
              )}
              
              <View className="absolute bottom-2 right-2 bg-accent2 border-2 border-border px-2 py-0.5 rounded shadow-brutal-sm">
                <Text className="text-border font-black text-[9px] uppercase">cNFT</Text>
              </View>
            </View>

            {/* Nombre y Ubicación */}
            <Text className="text-border font-black text-xl text-center uppercase mb-1 leading-tight">
              {title}
            </Text>
            <Text className="text-border font-bold text-xs opacity-70 mb-4 text-center">
              📍 {location}
            </Text>

            {/* Recompensa de Puntos ($HZ) */}
            <View className="bg-accent2 border-3 border-border px-4 py-2 shadow-brutal-sm mb-4 flex-row items-center w-full justify-between rounded-xl">
              <View className="flex-row items-center">
                <FontAwesome5 name="coins" size={16} color={colors.border} style={{ marginRight: 8 }} />
                <Text className="text-border font-black text-xs uppercase">Recompensa Otorgada</Text>
              </View>
              <Text className="text-border font-black text-base">+{rewardPoints} $HZ</Text>
            </View>

            {/* Firma On-Chain Solana Devnet */}
            {mintAddress && (
              <View className="bg-background border-2 border-border p-2.5 w-full mb-4 rounded-xl">
                <Text className="text-border text-[9px] font-black uppercase opacity-70 mb-0.5">
                  {language === 'es' ? 'Firma On-Chain Devnet:' : 'On-Chain Devnet Signature:'}
                </Text>
                <Text className="text-border font-mono text-[9px]">
                  {mintAddress.slice(0, 12)}...{mintAddress.slice(-12)}
                </Text>
              </View>
            )}

            {/* Botones de Acción */}
            <View className="w-full gap-2.5">
              <BrutalistButton
                title={language === 'es' ? "VER EN MI PASAPORTE" : "VIEW IN PASSPORT"}
                colorClass="bg-primary"
                onPress={onGoToPassport}
              />
              
              <Pressable
                onPress={onClose}
                className="w-full py-2.5 bg-background border-2 border-border justify-center items-center rounded-xl active:scale-95 shadow-brutal-sm"
              >
                <Text className="text-border font-black text-xs uppercase">
                  {language === 'es' ? 'SEGUIR EXPLORANDO' : 'CONTINUE EXPLORING'}
                </Text>
              </Pressable>
            </View>

          </View>

        </BrutalistCard>
      </Animated.View>
    </View>
  );
}
