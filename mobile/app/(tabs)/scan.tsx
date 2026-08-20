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

type MapPoi = (typeof MOCK_POIS)[number] & {
  top: `${number}%`;
  left: `${number}%`;
};

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function ScanScreen() {
  const { t } = useLanguage();
  const { mintPoiToken, applyPenalty, isRadarBoosted, activateRadarBoost } = useAppState();
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

  const handleSimulateMint = () => {
    const poiToMint = selectedPoi ?? mapPoints[0];
    if (!poiToMint) return;
    
    // Simulate 10% chance of a GPS spoofing penalty
    if (Math.random() < 0.1) {
      applyPenalty(50, 'Fake GPS Detected');
      setIsPenaltyFlagged(true);
      return;
    }

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
        <View className="w-12 h-12 bg-primary rounded-full border-4 border-border shadow-brutal-sm justify-center items-center z-20">
          <FontAwesome5 name="street-view" size={20} color={colors.border} />
        </View>

        {/* POI PokeStops */}
        {mapPoints.map(poi => (
          <Pressable 
            key={poi.id}
            onPress={() => handlePoiClick(poi)}
            className="absolute z-10 active:scale-110 items-center justify-center"
            style={{ top: poi.top, left: poi.left }}
          >
            <View className={`w-12 h-12 ${poi.category === 'tourism' ? 'bg-accent1' : 'bg-accent2'} rounded-full border-4 border-border shadow-brutal-sm justify-center items-center`}>
              <FontAwesome5 name={poi.category === 'tourism' ? 'monument' : 'store'} size={18} color="#FAF9F6" />
            </View>
            <View className="bg-background border-2 border-border mt-1 px-2 py-0.5 shadow-brutal-sm">
               <Text className="text-border font-black text-[10px] uppercase">{poi.name.split(' ')[0]} ({poi.distanceKm}km)</Text>
            </View>
          </Pressable>
        ))}

        {/* Interactive Affordance Helper Banner */}
        <View className="absolute bottom-3 bg-background/90 border-2 border-border px-3 py-1 shadow-brutal-sm z-30">
          <Text className="text-border font-bold text-xs text-center">👇 {t('scan.radar_hint')}</Text>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View className="p-4 pb-24 bg-background border-t-4 border-border flex-row justify-between items-center">
        <View className="flex-1 mr-2">
           <BrutalistButton 
             title={t('scan.radar_tools')} 
             colorClass={isRadarBoosted ? "bg-accent2" : "bg-primary"}
             onPress={() => setIsToolsModalVisible(true)} 
           />
        </View>
        
        <View className="flex-row flex-1 ml-2">
           <View className="flex-1 mr-1">
             <BrutalistButton 
               title={t('scan.scan_button')} 
               colorClass="bg-accent2"
               onPress={handleOpenScanner} 
             />
           </View>
           <View className="flex-1 ml-1">
             <BrutalistButton 
               title={t('scan.trade_button')} 
               colorClass="bg-accent1"
               onPress={() => setIsTradeModalVisible(true)} 
             />
           </View>
        </View>
      </View>

      {/* Brutalist Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             {isPenaltyFlagged ? (
               <>
                 <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
                   <Text className="text-background font-black text-xl uppercase">{t('scan.penalty_title')}</Text>
                   <FontAwesome5 name="exclamation-triangle" size={24} color="#FAF9F6" />
                 </View>
                 <View className="p-4 items-center">
                   <FontAwesome5 name="user-secret" size={64} color={colors.border} className="mb-4 mt-2" />
                   <Text className="text-border font-black text-2xl uppercase mb-2 text-center">{t('scan.penalty_wanted')}</Text>
                   <Text className="text-border text-center font-bold mb-6">
                     {t('scan.penalty_desc')}
                   </Text>
                   <View className="w-full mt-2">
                     <BrutalistButton title={t('scan.understood')} colorClass="bg-secondary" onPress={() => setModalVisible(false)} />
                   </View>
                 </View>
               </>
             ) : (
               <>
                 <View className={`${mintedToken ? 'bg-accent2' : 'bg-primary'} p-4 border-b-4 border-border flex-row justify-between items-center`}>
                    <Text className="text-background font-black text-xl uppercase">
                      {mintedToken ? t('scan.found_title') : (selectedPoi ? selectedPoi.name : t('scan.found_title'))}
                    </Text>
                    <FontAwesome5 name={mintedToken ? 'award' : 'qrcode'} size={24} color="#FAF9F6" />
                 </View>
                 
                 <View className="p-4">
                    {selectedPoi?.image ? (
                      <View className="w-full bg-secondary border-4 border-border mb-4 justify-center items-center overflow-hidden" style={{ aspectRatio: 1.8 }}>
                        <Image source={selectedPoi.image as any} className="w-full h-full" resizeMode="cover" />
                      </View>
                    ) : null}

                    {mintedToken ? (
                      <>
                        <Text className="text-border text-lg mb-2 font-black uppercase">
                          ¡Sticker Obtenido!
                        </Text>
                        <Text className="text-border text-sm mb-4 font-bold">
                          Has registrado tu visita a {mintedToken.location}. Guardado en tu pasaporte.
                        </Text>

                        <View className="bg-secondary p-3 border-2 border-border mb-4 flex-row justify-between items-center">
                          <Text className="text-border font-black uppercase text-xs">{t('scan.points_reward')}</Text>
                          <Text className="text-border font-black text-lg">+{selectedPoi?.reward ?? 50} HZ</Text>
                        </View>

                        {alreadyMinted ? (
                          <Text className="text-primary font-bold text-xs mb-4 uppercase">
                            {t('scan.already_stamped')}
                          </Text>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Text className="text-border text-sm mb-4 font-bold">
                          {selectedPoi 
                            ? `¡Estás en ${selectedPoi.name}! Obtén tu sticker digital de visita y gana puntos.`
                            : 'Escanea el código del establecimiento o monumento para registrar tu visita.'}
                        </Text>
                        
                        <View className="bg-secondary p-3 border-2 border-border mb-6 flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <FontAwesome5 name="coins" size={18} color={colors.border} />
                            <Text className="text-border font-black ml-2 text-sm">{t('scan.points_reward')}</Text>
                          </View>
                          <Text className="text-border font-black text-lg">+{selectedPoi?.reward ?? 50} HZ</Text>
                        </View>
                      </>
                    )}
                    
                    <BrutalistButton 
                      title={mintedToken ? t('scan.view_in_passport') : t('scan.get_sticker')} 
                      colorClass="bg-accent1" 
                      onPress={mintedToken ? handleGoToPassport : handleSimulateMint} 
                    />
                    
                    <View className="mt-3">
                      <BrutalistButton 
                        title={t('common.close')} 
                        colorClass="bg-background" 
                        onPress={() => setModalVisible(false)} 
                      />
                    </View>
                 </View>
               </>
             )}
          </BrutalistCard>
        </View>
      </Modal>

      <TradeAcceptModal 
        visible={isTradeModalVisible} 
        onClose={() => setIsTradeModalVisible(false)} 
      />

      {/* Radar Tools Modal */}
      <Modal visible={isToolsModalVisible} transparent animationType="slide" onRequestClose={() => setIsToolsModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-end">
          <BrutalistCard colorClass="bg-background w-full p-4 rounded-t-3xl border-t-4 border-border">
            <View className="flex-row justify-between items-center mb-6">
               <Text className="text-border font-black text-xl uppercase">{t('scan.radar_tools')}</Text>
               <Pressable onPress={() => setIsToolsModalVisible(false)} className="bg-primary border-4 border-border p-2 active:scale-95">
                 <FontAwesome5 name="times" size={20} color="#FAF9F6" />
               </Pressable>
            </View>

            <LiveActivityFeed />

            <View className="mb-6 mt-4">
              <BrutalistButton 
                title={isRadarBoosted ? "RADAR POTENCIADO (ACTIVO)" : "POTENCIAR RADAR (100 HZ)"} 
                colorClass={isRadarBoosted ? "bg-accent2" : "bg-primary"}
                disabled={isRadarBoosted}
                onPress={() => activateRadarBoost(100)} 
              />
            </View>
          </BrutalistCard>
        </View>
      </Modal>
    </View>
  );
}
