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
  onClose,
  onGoToPassport,
}: StickerClaimAnimationProps) {
  const { language } = useLanguage();

  // Animated Values for Lightweight Performance
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 1. Reset Values
      scaleAnim.setValue(0.2);
      rotateAnim.setValue(0);
      sparkleAnim.setValue(0);

      // 2. Spring Bounce Scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // 3. Continuous Rotating Radiance Background Loop
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // 4. Sparkle Floating Sequence
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkTranslateY = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -10],
  });

  return (
    <View className="absolute inset-0 z-50 bg-black/85 justify-center items-center p-4">
      
      {/* Animated Rotating Rays Backdrop */}
      <Animated.View 
        style={{ transform: [{ rotate: spin }] }} 
        className="absolute w-80 h-80 rounded-full border-4 border-dashed border-accent2/40 opacity-40 justify-center items-center"
      >
        <View className="w-64 h-64 rounded-full border-2 border-dashed border-primary/50" />
      </Animated.View>

      {/* Main Animated Card */}
      <Animated.View 
        style={{ transform: [{ scale: scaleAnim }] }} 
        className="w-full max-w-sm"
      >
        <BrutalistCard colorClass="bg-background p-0 overflow-hidden" variant="info">
          
          {/* Header */}
          <View className="bg-accent2 p-3.5 border-b-4 border-border flex-row justify-between items-center">
             <View className="flex-row items-center flex-1 mr-2">
                <FontAwesome5 name="star" size={18} color={colors.border} style={{ marginRight: 8 }} />
                <Text className="text-border font-black text-lg uppercase" numberOfLines={1}>
                  {language === 'es' ? '¡ESTAMPA CONSEGUIDA!' : 'STAMP UNLOCKED!'}
                </Text>
             </View>

             <Pressable 
               onPress={onClose}
               className="w-8 h-8 rounded-full bg-background border-2 border-border justify-center items-center shadow-brutal-sm active:scale-95"
             >
               <FontAwesome5 name="times" size={14} color={colors.border} />
             </Pressable>
          </View>

          {/* Body */}
          <View className="p-5 items-center bg-secondary/20">
             
             {/* Floating Sparkles Row */}
             <Animated.View 
               style={{ transform: [{ translateY: sparkTranslateY }] }} 
               className="flex-row justify-between w-48 mb-1"
             >
                <FontAwesome5 name="sparkles" size={16} color={colors.primary} />
                <FontAwesome5 name="medal" size={18} color={colors.accent2} />
                <FontAwesome5 name="sparkles" size={16} color={colors.primary} />
             </Animated.View>

             {/* Image Container with Neo-Brutalist Frame */}
             <View className="w-36 h-36 bg-background border-4 border-border shadow-brutal-md mb-4 justify-center items-center overflow-hidden p-2 rounded-xl">
                {image ? (
                  <Image source={typeof image === 'string' ? { uri: image } : image} style={{ width: '85%', height: '85%', resizeMode: 'contain' }} />
                ) : (
                  <FontAwesome5 name="award" size={48} color={colors.border} />
                )}
             </View>

             {/* Title & Location */}
             <Text className="text-border font-black text-xl text-center uppercase mb-0.5">{title}</Text>
             <Text className="text-border font-bold text-xs opacity-75 mb-3">{location}</Text>

             {/* Points Reward Badge */}
             <View className="bg-accent2 border-2 border-border px-4 py-1.5 shadow-brutal-sm mb-4 flex-row items-center">
                <FontAwesome5 name="coins" size={14} color={colors.border} style={{ marginRight: 6 }} />
                <Text className="text-border font-black text-sm uppercase">+{rewardPoints} PUNTOS $HZ</Text>
             </View>

             {/* Solana Devnet Authenticity Tag */}
             {mintAddress && (
               <View className="bg-background border-2 border-border p-2 w-full mb-4">
                 <Text className="text-border text-[9px] font-bold uppercase opacity-70">
                   {language === 'es' ? 'Firma On-Chain Devnet:' : 'On-Chain Devnet Signature:'}
                 </Text>
                 <Text className="text-border font-mono text-[9px]">
                   {mintAddress.slice(0, 10)}...{mintAddress.slice(-10)}
                 </Text>
               </View>
             )}

             {/* Action Button */}
             <View className="w-full">
                <BrutalistButton 
                  title={language === 'es' ? "VER EN MI PASAPORTE" : "VIEW IN PASSPORT"} 
                  colorClass="bg-primary" 
                  onPress={onGoToPassport} 
                />
             </View>

          </View>

        </BrutalistCard>
      </Animated.View>

    </View>
  );
}
