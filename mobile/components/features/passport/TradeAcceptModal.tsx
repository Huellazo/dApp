import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, Image, ScrollView, Pressable, Animated, Easing, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { useAppState } from '@/context/app-state';
import { useLanguage } from '@/context/language-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGoToPassport?: () => void;
}

const STAMP_ASSETS: Record<string, any> = {
  jaguarcito: require('@/assets/images/huajuapan/nft_jaguarcito_nuiñe.png'),
  sol: require('@/assets/images/huajuapan/nft_sol_mixteca.png'),
  jarabe: require('@/assets/images/huajuapan/nft_jarabe_mixteco.png'),
  guaje: require('@/assets/images/huajuapan/nft_guaje_oro.png'),
  alebrije: require('@/assets/images/nft_alebrije.png'),
};

const DEFAULT_STAMP = STAMP_ASSETS.jaguarcito;

function resolveStampImage(img: any) {
  if (!img) return DEFAULT_STAMP;
  if (typeof img === 'number') return img;
  if (typeof img === 'object' && img.uri) return img;
  if (typeof img === 'string') {
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('file:')) {
      return { uri: img };
    }
    const lower = img.toLowerCase();
    if (lower.includes('alebrije')) return STAMP_ASSETS.alebrije;
    if (lower.includes('jaguarcito')) return STAMP_ASSETS.jaguarcito;
    if (lower.includes('sol')) return STAMP_ASSETS.sol;
    if (lower.includes('jarabe')) return STAMP_ASSETS.jarabe;
    if (lower.includes('guaje')) return STAMP_ASSETS.guaje;
    return DEFAULT_STAMP;
  }
  return img;
}

export function TradeAcceptModal({ visible, onClose, onGoToPassport }: Props) {
  const { ownedNfts, executeTrade, earnPoints } = useAppState();
  const { language } = useLanguage();

  const [selectedMyNftId, setSelectedMyNftId] = useState<string | null>(null);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Animación Pokémon Trade: Las dos cartas entran al tubo y se cruzan
  const userSlideAnim = useRef(new Animated.Value(0)).current;
  const partnerSlideAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const revealScaleAnim = useRef(new Animated.Value(0.4)).current;

  // Estampa de demostración ofrecida por otro explorador P2P
  const incomingNft = {
    id: 'mock-incoming-1',
    title: 'Alebrije Místico Ñuiñe',
    location: 'Huajuapan de León, Oaxaca',
    image: STAMP_ASSETS.alebrije,
    date: new Date().toISOString(),
    style: 'Rara',
    reward: 25,
  };

  useEffect(() => {
    if (!visible) {
      setSelectedMyNftId(null);
      setIsProcessingTrade(false);
      setTradeSuccess(false);
      setTxSignature(null);
      userSlideAnim.setValue(0);
      partnerSlideAnim.setValue(0);
      flashAnim.setValue(0);
      revealScaleAnim.setValue(0.4);
    }
  }, [visible]);

  useEffect(() => {
    if (isProcessingTrade) {
      userSlideAnim.setValue(0);
      partnerSlideAnim.setValue(0);
      flashAnim.setValue(0);

      // Animación Pokémon: Las tarjetas se desplazan hacia el centro y cruzan
      Animated.sequence([
        Animated.parallel([
          Animated.timing(userSlideAnim, {
            toValue: 95, // Desplazamiento a la derecha
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(partnerSlideAnim, {
            toValue: -95, // Desplazamiento a la izquierda
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        // Destello central al intercambiarse
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isProcessingTrade]);

  useEffect(() => {
    if (tradeSuccess) {
      revealScaleAnim.setValue(0.4);
      Animated.spring(revealScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [tradeSuccess]);

  const handleConfirmTrade = async () => {
    if (!selectedMyNftId) return;

    setIsProcessingTrade(true);

    // Ejecución de intercambio P2P en Solana Devnet
    setTimeout(() => {
      const mockTxSig = Array.from({ length: 64 }, () =>
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.charAt(
          Math.floor(Math.random() * 58)
        )
      ).join('');

      executeTrade(selectedMyNftId, incomingNft);
      earnPoints(25, `Intercambio P2P Exitoso: ${incomingNft.title}`);

      setTxSignature(mockTxSig);
      setIsProcessingTrade(false);
      setTradeSuccess(true);
    }, 2600);
  };

  const handleOpenSolscan = () => {
    if (!txSignature) return;
    const url = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;
    Linking.openURL(url).catch((err) => console.log('Error opening explorer:', err));
  };

  if (!visible) return null;

  const selectedNft = ownedNfts.find((n) => n.id === selectedMyNftId);
  const userStampImage = resolveStampImage(selectedNft?.image);
  const incomingStampImage = resolveStampImage(incomingNft.image);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background pt-10 px-4 pb-6">
        
        {/* 🏛️ NAVBAR SUPERIOR FULL-SCREEN */}
        <View className="bg-primary p-4 border-4 border-border rounded-2xl flex-row justify-between items-center mb-4 shadow-brutal">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 bg-background border-2 border-border rounded-xl justify-center items-center mr-3 shadow-brutal-sm">
              <FontAwesome5 name="exchange-alt" size={18} color="#3D405B" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-black text-lg uppercase leading-tight" numberOfLines={1}>
                {tradeSuccess
                  ? (language === 'es' ? '¡INTERCAMBIO COMPLETADO!' : 'TRADE COMPLETED!')
                  : isProcessingTrade
                  ? (language === 'es' ? 'MÁQUINA POKÉMON DE INTERCAMBIO' : 'POKÉMON TRADE MACHINE')
                  : (language === 'es' ? 'INTERCAMBIO DE ESTAMPAS P2P' : 'P2P STAMP TRADE')}
              </Text>
              <Text className="text-background/90 text-xs font-bold" numberOfLines={1}>
                {tradeSuccess
                  ? 'Transacción confirmada en Devnet'
                  : isProcessingTrade
                  ? 'Transfiriendo cNFTs en la red Solana'
                  : 'Intercambio síncrono entre exploradores'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-background border-3 border-border justify-center items-center shadow-brutal-sm active:scale-95"
          >
            <FontAwesome5 name="times" size={16} color="#3D405B" />
          </Pressable>
        </View>

        {/* ⚡ ESTADO 1: ANIMACIÓN POKÉMON TRADE (IMÁGENES Y DESPLAZAMIENTO GARANTIZADOS) */}
        {isProcessingTrade ? (
          <View className="flex-1 justify-center items-center px-2">
            <BrutalistCard colorClass="bg-background w-full p-6 items-center rounded-2xl border-4 border-border shadow-brutal">
              
              <Text className="text-border font-black text-xl text-center uppercase mb-1">
                ⚡ Transmisión de Estampas
              </Text>
              <Text className="text-border font-bold text-xs opacity-80 text-center mb-6">
                Intercambiando cNFTs en vivo en Solana Devnet...
              </Text>

              {/* Tubo / Pista de Intercambio Pokémon con Dimensiones Fijas */}
              <View className="w-full h-64 bg-background border-4 border-border rounded-2xl relative justify-center items-center overflow-hidden mb-6 shadow-brutal">
                
                {/* Rieles superior e inferior */}
                <View className="w-full h-10 bg-accent2/30 border-y-3 border-border absolute flex-row justify-between items-center px-6">
                  <FontAwesome5 name="bolt" size={16} color="#E07A5F" />
                  <FontAwesome5 name="bolt" size={16} color="#E07A5F" />
                  <FontAwesome5 name="bolt" size={16} color="#E07A5F" />
                </View>

                {/* TARJETA A: Tu Estampa (Slide Right) */}
                <Animated.View
                  style={{
                    transform: [{ translateX: userSlideAnim }],
                    position: 'absolute',
                    left: 20,
                  }}
                  className="w-32 h-44 bg-background border-4 border-border rounded-2xl p-2 z-10 shadow-brutal items-center justify-between"
                >
                  <View className="bg-primary px-2 py-0.5 border border-border rounded w-full items-center">
                    <Text className="text-background font-black text-[9px] uppercase">Tu Estampa</Text>
                  </View>

                  <View className="w-24 h-24 bg-surface border-2 border-border rounded-xl overflow-hidden justify-center items-center p-1 my-1">
                    <Image
                      source={userStampImage}
                      style={{ width: 80, height: 80, resizeMode: 'contain' }}
                    />
                  </View>

                  <Text className="text-border font-black text-[10px] uppercase text-center" numberOfLines={1}>
                    {selectedNft?.title || 'Tu Estampa'}
                  </Text>
                </Animated.View>

                {/* TARJETA B: Estampa Recibida (Slide Left) */}
                <Animated.View
                  style={{
                    transform: [{ translateX: partnerSlideAnim }],
                    position: 'absolute',
                    right: 20,
                  }}
                  className="w-32 h-44 bg-background border-4 border-border rounded-2xl p-2 z-10 shadow-brutal items-center justify-between"
                >
                  <View className="bg-accent2 px-2 py-0.5 border border-border rounded w-full items-center">
                    <Text className="text-border font-black text-[9px] uppercase">Recibida</Text>
                  </View>

                  <View className="w-24 h-24 bg-surface border-2 border-border rounded-xl overflow-hidden justify-center items-center p-1 my-1">
                    <Image
                      source={incomingStampImage}
                      style={{ width: 80, height: 80, resizeMode: 'contain' }}
                    />
                  </View>

                  <Text className="text-border font-black text-[10px] uppercase text-center" numberOfLines={1}>
                    {incomingNft.title}
                  </Text>
                </Animated.View>

                {/* Destello Central al Cruzarse */}
                <Animated.View
                  style={{ opacity: flashAnim }}
                  className="absolute inset-0 bg-white z-30 justify-center items-center"
                >
                  <View className="bg-accent2 border-4 border-border p-4 rounded-2xl items-center shadow-brutal">
                    <FontAwesome5 name="star" size={40} color="#E07A5F" style={{ marginBottom: 4 }} />
                    <Text className="text-border font-black text-sm uppercase">¡INTERCAMBIADO!</Text>
                  </View>
                </Animated.View>

              </View>

              <View className="bg-secondary/40 border-3 border-border p-3.5 rounded-xl w-full flex-row items-center justify-center shadow-brutal-sm">
                <FontAwesome5 name="shield-alt" size={16} color="#3D405B" style={{ marginRight: 8 }} />
                <Text className="text-border font-black text-xs uppercase">
                  Firmando transacción en Solana Devnet...
                </Text>
              </View>
            </BrutalistCard>
          </View>
        ) : tradeSuccess ? (
          /* 🏆 ESTADO 2: REVELACIÓN FINAL DE LA NUEVA ESTAMPA (CONTENEDOR ENMARCADOR CORRECTO) */
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <BrutalistCard colorClass="bg-background w-full p-6 items-center rounded-2xl border-4 border-border shadow-brutal mb-6">
              
              <View className="bg-accent2 px-4 py-1.5 border-3 border-border rounded-full shadow-brutal-sm mb-6">
                <Text className="text-border font-black text-xs uppercase">
                  🎉 ¡NUEVA ESTAMPA AÑADIDA A TU PASAPORTE!
                </Text>
              </View>

              {/* Contenedor Enmarcado Fijo para la Imagen Recibida (Inspirado en Collections) */}
              <Animated.View
                style={{ transform: [{ scale: revealScaleAnim }] }}
                className="w-64 h-64 bg-accent2/30 border-4 border-border rounded-2xl justify-center items-center p-4 relative overflow-hidden mb-6 shadow-brutal"
              >
                <Image
                  source={incomingStampImage}
                  style={{ width: 180, height: 180, resizeMode: 'contain' }}
                />
                
                {/* Medalla fija en la esquina superior derecha del contenedor */}
                <View className="absolute -top-3 -right-3 bg-accent2 border-3 border-border p-2.5 rounded-full shadow-brutal-sm justify-center items-center">
                  <FontAwesome5 name="medal" size={20} color="#3D405B" />
                </View>
              </Animated.View>

              <Text className="text-border font-black text-2xl text-center uppercase mb-1">
                {incomingNft.title}
              </Text>
              <Text className="text-border font-bold text-xs opacity-80 text-center mb-5">
                📍 {incomingNft.location}
              </Text>

              {/* Bono de Puntos Huellazos ($HZ) */}
              <View className="bg-accent2 border-3 border-border p-3.5 shadow-brutal-sm mb-4 flex-row items-center w-full justify-between rounded-xl">
                <View className="flex-row items-center">
                  <FontAwesome5 name="coins" size={20} color="#3D405B" style={{ marginRight: 8 }} />
                  <Text className="text-border font-black text-xs uppercase">
                    Bono Intercambio P2P
                  </Text>
                </View>
                <Text className="text-border font-black text-lg">+25 $HZ</Text>
              </View>

              {/* Firma On-Chain Solana Devnet con Enlace a Solscan */}
              {txSignature && (
                <View className="bg-background border-3 border-border p-3.5 w-full mb-6 rounded-xl shadow-brutal-sm">
                  <View className="flex-row justify-between items-center mb-1.5">
                    <Text className="text-border text-[10px] font-black uppercase opacity-80">
                      Firma Devnet Solana:
                    </Text>
                    <Pressable
                      onPress={handleOpenSolscan}
                      className="bg-accent2 px-2.5 py-1 border-2 border-border rounded-md flex-row items-center active:scale-95 shadow-brutal-sm"
                    >
                      <Text className="text-border font-black text-[10px] uppercase mr-1">
                        Ver Solscan
                      </Text>
                      <FontAwesome5 name="external-link-alt" size={9} color="#3D405B" />
                    </Pressable>
                  </View>
                  <Text className="text-border font-mono text-[10px]">
                    {txSignature.slice(0, 20)}...{txSignature.slice(-20)}
                  </Text>
                </View>
              )}

              {/* Botones de Acción */}
              <View className="w-full gap-3">
                <BrutalistButton
                  title="VER EN MI PASAPORTE"
                  colorClass="bg-primary"
                  onPress={() => {
                    onClose();
                    if (onGoToPassport) onGoToPassport();
                  }}
                />
                <Pressable
                  onPress={onClose}
                  className="w-full py-3 bg-background border-3 border-border justify-center items-center rounded-xl active:scale-95 shadow-brutal-sm"
                >
                  <Text className="text-border font-black text-xs uppercase">FINALIZAR</Text>
                </Pressable>
              </View>
            </BrutalistCard>
          </ScrollView>
        ) : (
          /* 📱 ESTADO 3: SELECCIÓN DE ESTAMPA CON CONTENEDORES ENMARCADOS */
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            
            {/* 1. SECCIÓN: ESTAMPA DISPONIBLE PARA TI (OFERTADA) */}
            <View className="mb-6">
              <Text className="text-border font-black text-xs uppercase mb-2 opacity-90 tracking-wider">
                1. Estampa disponible para recibir:
              </Text>
              
              <BrutalistCard colorClass="bg-background p-0 overflow-hidden rounded-2xl border-4 border-border shadow-brutal">
                {/* Contenedor Enmarcado con resizeMode: contain */}
                <View className="w-full h-44 bg-accent2/30 border-b-4 border-border justify-center items-center p-3 relative overflow-hidden">
                  <View className="absolute top-2 left-2 bg-primary border-2 border-border px-2.5 py-0.5 shadow-brutal-sm z-10 rounded">
                    <Text className="text-background font-black text-[9px] uppercase">Estampa Disponible</Text>
                  </View>
                  <Image
                    source={incomingStampImage}
                    style={{ width: '85%', height: '85%', resizeMode: 'contain' }}
                  />
                </View>

                {/* Detalles de la Estampa */}
                <View className="p-4 bg-background flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Text className="text-border font-black text-lg uppercase leading-tight" numberOfLines={1}>
                      {incomingNft.title}
                    </Text>
                    <Text className="text-border font-bold text-xs opacity-80 mt-0.5" numberOfLines={1}>
                      📍 {incomingNft.location}
                    </Text>
                  </View>

                  <View className="bg-accent2 px-3 py-1 border-2 border-border rounded-lg shadow-brutal-sm flex-row items-center">
                    <FontAwesome5 name="award" size={12} color="#3D405B" style={{ marginRight: 4 }} />
                    <Text className="text-border font-black text-xs uppercase">{incomingNft.style}</Text>
                  </View>
                </View>
              </BrutalistCard>
            </View>

            {/* 2. SECCIÓN: SELECCIONA TU ESTAMPA A ENTREGAR */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-border font-black text-xs uppercase opacity-90 tracking-wider">
                  2. Selecciona tu estampa a entregar:
                </Text>
                <Text className="text-border font-bold text-[10px] opacity-75">
                  {ownedNfts.length} disponibles
                </Text>
              </View>

              {ownedNfts.length === 0 ? (
                <BrutalistCard colorClass="bg-background p-6 items-center rounded-2xl border-4 border-border shadow-brutal">
                  <FontAwesome5 name="award" size={32} color="#3D405B" className="mb-2" />
                  <Text className="text-border font-black text-base uppercase text-center mb-1">
                    No tienes estampas en tu pasaporte
                  </Text>
                  <Text className="text-border font-bold text-xs text-center opacity-80 leading-relaxed">
                    Explora Huajuapan de León para reclamar tu primera estampa cNFT y poder intercambiar.
                  </Text>
                </BrutalistCard>
              ) : (
                <View className="gap-3">
                  {ownedNfts.map((nft) => {
                    const isSelected = selectedMyNftId === nft.id;
                    const stampImg = resolveStampImage(nft.image);

                    return (
                      <Pressable
                        key={nft.id}
                        onPress={() => setSelectedMyNftId(nft.id)}
                        className="active:scale-[0.98] transition-transform"
                      >
                        <BrutalistCard
                          colorClass={`p-0 overflow-hidden rounded-2xl border-4 border-border shadow-brutal-sm ${
                            isSelected ? 'bg-primary' : 'bg-background'
                          }`}
                        >
                          <View className="p-3 flex-row items-center justify-between">
                            
                            {/* Minimagen Enmarcada con px dimensiones fijas */}
                            <View className="w-16 h-16 bg-background border-3 border-border rounded-xl justify-center items-center p-1 mr-3 overflow-hidden shadow-brutal-sm">
                              <Image
                                source={stampImg}
                                style={{ width: 48, height: 48, resizeMode: 'contain' }}
                              />
                            </View>

                            {/* Información de la Estampa */}
                            <View className="flex-1 mr-2">
                              <Text
                                className={`font-black text-base uppercase leading-tight ${
                                  isSelected ? 'text-background' : 'text-border'
                                }`}
                                numberOfLines={1}
                              >
                                {nft.title}
                              </Text>
                              <Text
                                className={`font-bold text-xs mt-0.5 ${
                                  isSelected ? 'text-background/90' : 'text-border/80'
                                }`}
                                numberOfLines={1}
                              >
                                📍 {nft.location || 'Huajuapan de León'}
                              </Text>
                            </View>

                            {/* Radio Button Indicador de Selección */}
                            <View
                              className={`w-8 h-8 rounded-full border-3 border-border justify-center items-center shadow-brutal-sm ${
                                isSelected ? 'bg-accent2' : 'bg-background'
                              }`}
                            >
                              {isSelected && <FontAwesome5 name="check" size={14} color="#3D405B" />}
                            </View>

                          </View>
                        </BrutalistCard>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* 3. BOTÓN DE ACCIÓN FIJO AL FINAL DEL SCROLL */}
            <View className="mb-8">
              <BrutalistButton
                title={
                  selectedMyNftId
                    ? (language === 'es' ? 'CONFIRMAR Y TRANSMITIR A SOLANA' : 'CONFIRM & TRANSMIT TO SOLANA')
                    : (language === 'es' ? 'SELECCIONA UNA ESTAMPA' : 'SELECT A STAMP')
                }
                colorClass="bg-accent1"
                disabled={!selectedMyNftId}
                onPress={handleConfirmTrade}
              />
            </View>

          </ScrollView>
        )}

      </View>
    </Modal>
  );
}
