import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useAppState } from '@/context/app-state';
import type { EarnedSolanaToken, MintablePoi } from '@/context/app-state';
import { colors } from '@/theme/colors';
import { MOCK_POIS } from '@/mocks/db';
import { TradeAcceptModal } from '@/components/features/passport/TradeAcceptModal';
import { LiveActivityFeed } from '@/components/features/scan/LiveActivityFeed';
import { useLanguage } from '@/context/language-context';
import { useHuellazoWeb3 } from '@/hooks/useHuellazoWeb3';

type MapPoi = (typeof MOCK_POIS)[number] & {
  top: `${number}%`;
  left: `${number}%`;
};

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function ScanScreen() {
  const { t, language } = useLanguage();
  const { mintPoiToken, applyPenalty, isRadarBoosted, activateRadarBoost } = useAppState();
  const { mintPlaceOnChain } = useHuellazoWeb3();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<MintablePoi | null>(null);
  const [mintedToken, setMintedToken] = useState<EarnedSolanaToken | null>(null);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  
  // Penalty state
  const [isPenaltyFlagged, setIsPenaltyFlagged] = useState(false);
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);
  const [isToolsModalVisible, setIsToolsModalVisible] = useState(false);

  // Static mock positions for the "PokeStops" around the center
  const mapPoints: MapPoi[] = MOCK_POIS.slice(0, 5).map((poi, idx) => ({
    ...poi,
    top: `${15 + (idx * 37) % 70}%` as `${number}%`,
    left: `${10 + (idx * 43) % 75}%` as `${number}%`,
  }));

  const handlePoiClick = (poi: MapPoi) => {
    setSelectedPoi(poi);
    setMintedToken(null);
    setAlreadyMinted(false);
    setModalVisible(true);
  };

  const handleOpenScanner = () => {
    const nearestPoi = mapPoints[0];
    if (!nearestPoi) return;

    setSelectedPoi(nearestPoi);
    setMintedToken(null);
    setAlreadyMinted(false);
    setModalVisible(true);
  };

  const handleSimulateMint = async () => {
    const poiToMint = selectedPoi ?? mapPoints[0];
    if (!poiToMint) return;
    
    // Simulate 10% chance of a GPS spoofing penalty
    if (Math.random() < 0.1) {
      applyPenalty(50, 'Fake GPS Detected');
      setIsPenaltyFlagged(true);
      return;
    }

    // Trigger Solana Devnet mint_place transaction
    const lat = (poiToMint as any).coordinates?.latitude || 17.807;
    const lng = (poiToMint as any).coordinates?.longitude || -97.776;

    mintPlaceOnChain({
      poiName: poiToMint.name,
      latitude: lat,
      longitude: lng,
      poapType: poiToMint.category === 'business' ? 1 : 0,
    }).catch(err => console.log('Web3 Devnet background mint notice:', err));

    const result = mintPoiToken(poiToMint);
    setSelectedPoi(poiToMint);
    setMintedToken(result.token);
    setAlreadyMinted(result.alreadyMinted);
    setIsPenaltyFlagged(false);
  };

  const handleGoToPassport = () => {
    setModalVisible(false);
    router.push('/(tabs)/passport');
  };

  return (
    <View className="flex-1 bg-background pt-12">
      <Text className="text-3xl font-black text-border px-4 mb-1 uppercase tracking-tight">{t('scan.title')}</Text>
      <Text className="text-border px-4 mb-3 font-bold text-sm">{t('scan.subtitle')}</Text>

      {/* Static Map Area */}
      <View className={`flex-1 border-y-4 border-border ${isRadarBoosted ? 'bg-accent2/30' : 'bg-secondary/40'} relative overflow-hidden justify-center items-center`}>
        
        {/* Background Grid Pattern */}
        <View style={StyleSheet.absoluteFillObject} className="opacity-20">
           <View className="absolute top-1/4 w-full h-1 bg-border" />
           <View className="absolute top-2/4 w-full h-1 bg-border" />
           <View className="absolute top-3/4 w-full h-1 bg-border" />
           <View className="absolute left-1/4 h-full w-1 bg-border" />
           <View className="absolute left-2/4 h-full w-1 bg-border" />
           <View className="absolute left-3/4 h-full w-1 bg-border" />
        </View>

        {/* User Radar Radius */}
        <View className={`w-64 h-64 rounded-full border-4 ${isRadarBoosted ? 'border-primary border-dashed bg-accent2/20' : 'border-border bg-background/50'} absolute justify-center items-center`}>
           <View className={`w-48 h-48 rounded-full border-2 ${isRadarBoosted ? 'border-primary' : 'border-border'} border-dashed opacity-50 absolute`} />
           {isRadarBoosted && (
             <Text className="absolute top-4 text-primary font-black text-[10px] uppercase tracking-widest">{t('scan.boosted')}</Text>
           )}
        </View>

        {/* User Center Avatar */}
        <View className="w-16 h-16 bg-primary border-4 border-border rounded-full justify-center items-center z-20 shadow-brutal-sm">
           <FontAwesome5 name="user-astronaut" size={24} color="#FAF9F6" />
        </View>

        {/* Render POI Pins - Compact & Reduced Label Width */}
        {mapPoints.map((poi) => (
          <Pressable
            key={poi.id}
            onPress={() => handlePoiClick(poi)}
            style={{ top: poi.top, left: poi.left }}
            className="absolute z-30 items-center active:scale-110"
          >
            <View className="bg-accent1 p-2.5 border-4 border-border shadow-brutal-sm rounded-full justify-center items-center">
              <FontAwesome5 name={poi.category === 'business' ? 'store' : 'landmark'} size={15} color="#FAF9F6" />
            </View>
            <View className="bg-background border-2 border-border px-1.5 py-0.5 mt-1 shadow-brutal-sm max-w-[80px]">
              <Text className="text-border font-black text-[8px] uppercase text-center" numberOfLines={1} ellipsizeMode="tail">
                {poi.name}
              </Text>
            </View>
          </Pressable>
        ))}

        {/* Map Controls */}
        <View className="absolute bottom-4 left-4 right-4 flex-row justify-between z-20">
           <View className="w-[48%]">
             <BrutalistButton title={t('scan.radar_tools')} colorClass="bg-secondary" onPress={() => setIsToolsModalVisible(true)} />
           </View>
           <View className="w-[48%]">
             <BrutalistButton title={t('scan.trade_button')} colorClass="bg-accent2" onPress={() => setIsTradeModalVisible(true)} />
           </View>
        </View>

      </View>

      {/* Action Footer */}
      <View className="p-4 bg-background border-b-4 border-border flex-row justify-between items-center">
         <View className="flex-1 mr-3">
           <Text className="text-border font-black text-xs uppercase" numberOfLines={2}>{t('scan.radar_hint')}</Text>
         </View>
         <View className="w-36">
           <BrutalistButton title={t('scan.scan_button')} colorClass="bg-primary" onPress={handleOpenScanner} />
         </View>
      </View>

      {/* Activity Feed */}
      <View className="flex-1 bg-background">
         <LiveActivityFeed />
      </View>

      {/* POI Scanner / Minting Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            
            {/* Header */}
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">
                 {isPenaltyFlagged ? t('scan.penalty_title') : selectedPoi ? selectedPoi.name : t('scan.found_title')}
               </Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setModalVisible(false)} />
            </View>

            <View className="p-4">
              {isPenaltyFlagged ? (
                <View className="items-center py-4">
                   <View className="w-16 h-16 bg-primary border-4 border-border rounded-full justify-center items-center mb-4">
                      <FontAwesome5 name="exclamation-triangle" size={28} color="#FAF9F6" />
                   </View>
                   <Text className="text-primary font-black text-lg text-center uppercase mb-2">
                     {t('scan.penalty_wanted')}
                   </Text>
                   <Text className="text-border text-xs text-center font-bold mb-6">
                     {t('scan.penalty_desc')}
                   </Text>
                   <BrutalistButton title={t('scan.understood')} colorClass="bg-secondary" onPress={() => setModalVisible(false)} />
                </View>
              ) : mintedToken ? (
                <View className="items-center">
                  <Text className="text-accent2 font-black text-2xl uppercase mb-2">{t('scan.found_title')}</Text>
                  
                  {selectedPoi?.image ? (
                    <View className="w-32 h-32 border-4 border-border shadow-brutal-sm mb-4 overflow-hidden">
                      <Image source={selectedPoi.image as any} className="w-full h-full" resizeMode="cover" />
                    </View>
                  ) : (
                    <View className="w-24 h-24 bg-accent1 border-4 border-border justify-center items-center mb-4">
                       <FontAwesome5 name="certificate" size={40} color="#FAF9F6" />
                    </View>
                  )}

                  <Text className="text-border font-black text-lg text-center uppercase mb-1">{mintedToken.name}</Text>
                  <Text className="text-border text-xs font-bold opacity-70 mb-4">{mintedToken.location}</Text>

                  {alreadyMinted ? (
                    <View className="bg-secondary p-3 border-2 border-border w-full mb-4">
                      <Text className="text-border text-xs font-bold text-center">
                        {t('scan.already_stamped')}
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-accent2/30 p-3 border-2 border-border w-full mb-4 flex-row justify-between items-center">
                       <Text className="text-border font-black text-xs uppercase">{t('scan.points_reward')}</Text>
                       <Text className="text-border font-black text-sm">+{mintedToken.reward} HZ</Text>
                    </View>
                  )}

                  <View className="bg-background border-2 border-border p-2 w-full mb-6">
                    <Text className="text-border text-[10px] font-bold uppercase opacity-70">
                      {language === 'es' ? 'Código de Autenticidad:' : 'Authenticity Code:'}
                    </Text>
                    <Text className="text-border font-mono text-[9px]">{shortHash(mintedToken.mintAddress)}</Text>
                  </View>

                  <BrutalistButton title={t('scan.view_in_passport')} colorClass="bg-accent2" onPress={handleGoToPassport} />
                </View>
              ) : (
                <View className="items-center py-2">
                   {selectedPoi?.image && (
                     <View className="w-full h-36 border-4 border-border shadow-brutal-sm mb-4 overflow-hidden">
                       <Image source={selectedPoi.image as any} className="w-full h-full" resizeMode="cover" />
                     </View>
                   )}
                   <Text className="text-border text-sm mb-6 font-bold text-center leading-relaxed">
                     {selectedPoi?.description || t('scan.subtitle')}
                   </Text>

                   <BrutalistButton title={t('scan.get_sticker')} colorClass="bg-primary" onPress={handleSimulateMint} />
                </View>
              )}
            </View>

          </BrutalistCard>
        </View>
      </Modal>

      {/* Radar Tools Modal */}
      <Modal visible={isToolsModalVisible} transparent animationType="fade" onRequestClose={() => setIsToolsModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
             <View className="bg-secondary p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">Herramientas de Explorador</Text>
                <FontAwesome5 name="tools" size={24} color={colors.border} />
             </View>

             <View className="p-4">
                <Text className="text-border text-sm font-bold mb-4">
                  Potencia el rango de tu Radar para detectar tesoros y estampas ocultas a mayor distancia.
                </Text>

                <View className="bg-secondary/20 p-4 border-4 border-border mb-6">
                   <Text className="text-border font-black text-base uppercase mb-1">Radar Booster (1h)</Text>
                   <Text className="text-border text-xs font-bold opacity-70 mb-4">Duplica el radio de búsqueda de estampas.</Text>
                   <BrutalistButton 
                     title={isRadarBoosted ? "¡BOOST ACTIVADO!" : "ACTIVAR POR 50 HZ"} 
                     colorClass={isRadarBoosted ? "bg-accent2" : "bg-primary"}
                     disabled={isRadarBoosted}
                     onPress={() => {
                       activateRadarBoost(50);
                       setIsToolsModalVisible(false);
                     }}
                   />
                </View>

                <BrutalistButton title={t('common.close')} colorClass="bg-secondary" onPress={() => setIsToolsModalVisible(false)} />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Trade Accept Modal */}
      <TradeAcceptModal visible={isTradeModalVisible} onClose={() => setIsTradeModalVisible(false)} />

    </View>
  );
}
