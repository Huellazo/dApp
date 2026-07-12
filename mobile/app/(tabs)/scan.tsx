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

type MapPoi = (typeof MOCK_POIS)[number] & {
  top: `${number}%`;
  left: `${number}%`;
};

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function ScanScreen() {
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
    // Distribute them around the center (0 to 100%)
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
      <Text className="text-3xl font-black text-border px-4 mb-2 uppercase tracking-tight">Huellazo Radar</Text>
      <Text className="text-border px-4 mb-4 font-bold text-sm">Escanea lugares aliados y mintea tokens de recuerdo.</Text>

      {/* Static Map Area */}
      <View className={`flex-1 border-y-4 border-border ${isRadarBoosted ? 'bg-[#39FF14]' : 'bg-secondary'} relative overflow-hidden justify-center items-center transition-colors duration-500`}>
        
        {/* Background Grid Pattern (Neo-brutalist touch) */}
        <View style={StyleSheet.absoluteFillObject} className="opacity-20">
           {/* Simple lines to simulate a map grid */}
           <View className="absolute top-1/4 w-full h-1 bg-border" />
           <View className="absolute top-2/4 w-full h-1 bg-border" />
           <View className="absolute top-3/4 w-full h-1 bg-border" />
           <View className="absolute left-1/4 h-full w-1 bg-border" />
           <View className="absolute left-2/4 h-full w-1 bg-border" />
           <View className="absolute left-3/4 h-full w-1 bg-border" />
        </View>

        {/* User Radar Radius */}
        <View className={`w-64 h-64 rounded-full border-4 ${isRadarBoosted ? 'border-background border-dashed bg-[#39FF14]/50' : 'border-border bg-background/50'} absolute justify-center items-center`}>
           <View className={`w-48 h-48 rounded-full border-2 ${isRadarBoosted ? 'border-background' : 'border-border'} border-dashed opacity-50 absolute`} />
           {isRadarBoosted && (
             <Text className="absolute top-4 text-background font-black text-[10px] uppercase tracking-widest">BOOSTED</Text>
           )}
        </View>

        {/* User Center Avatar */}
        <View className="w-12 h-12 bg-primary rounded-full border-4 border-border shadow-brutal-sm justify-center items-center z-20">
          <FontAwesome5 name="street-view" size={20} color={colors.border} />
        </View>

        {/* POI 'PokeStops' */}
        {mapPoints.map(poi => (
          <Pressable 
            key={poi.id}
            onPress={() => handlePoiClick(poi)}
            className="absolute z-10 active:opacity-50 items-center justify-center"
            style={{ top: poi.top, left: poi.left }}
          >
            <View className={`w-10 h-10 ${poi.category === 'tourism' ? 'bg-accent1' : 'bg-accent2'} rounded-full border-4 border-border shadow-brutal-sm justify-center items-center`}>
              <FontAwesome5 name={poi.category === 'tourism' ? 'monument' : 'store'} size={14} color={colors.border} />
            </View>
            <View className="bg-background border-2 border-border mt-1 px-1">
               <Text className="text-border font-bold text-[10px] uppercase">{poi.distanceKm}km</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Bottom Action Area */}
      <View className="p-4 pb-24 bg-background border-t-4 border-border flex-row justify-between items-center">
        <View className="flex-1 mr-2">
           <BrutalistButton 
             title="RADAR TOOLS" 
             colorClass={isRadarBoosted ? "bg-[#39FF14]" : "bg-primary"}
             onPress={() => setIsToolsModalVisible(true)} 
           />
        </View>
        
        <View className="flex-row flex-1 ml-2">
           <View className="flex-1 mr-1">
             <BrutalistButton 
               title="SCAN" 
               colorClass="bg-accent2"
               onPress={handleOpenScanner} 
             />
           </View>
           <View className="flex-1 ml-1">
             <BrutalistButton 
               title="TRADE" 
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
                   <Text className="text-border font-black text-xl uppercase">WARNING</Text>
                   <FontAwesome5 name="exclamation-triangle" size={24} color={colors.border} />
                 </View>
                 <View className="p-4 items-center">
                   <FontAwesome5 name="user-secret" size={64} color={colors.border} className="mb-4 mt-2" />
                   <Text className="text-border font-black text-2xl uppercase mb-2 text-center">WANTED</Text>
                   <Text className="text-border text-center font-bold mb-6">
                     Anomaly detected in your scan (Fake GPS or Spoofing). 
                     A penalty of 50 $HUELLAZOS has been applied and your XP has dropped!
                   </Text>
                   <View className="w-full mt-2">
                     <BrutalistButton title="Understood" colorClass="bg-secondary" onPress={() => setModalVisible(false)} />
                   </View>
                 </View>
               </>
             ) : (
               <>
                 <View className={`${mintedToken ? 'bg-accent2' : 'bg-primary'} p-4 border-b-4 border-border flex-row justify-between items-center`}>
                    <Text className="text-border font-black text-xl uppercase">
                      {mintedToken ? 'Token Earned!' : 'Footprint Found!'}
                    </Text>
                    <FontAwesome5 name={mintedToken ? 'certificate' : 'qrcode'} size={24} color={colors.border} />
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
                          You received this token:
                        </Text>
                        <Text className="text-border text-base mb-4 font-bold">
                          {mintedToken.name} for validating your visit at {mintedToken.location}. It is saved in your passport as a Huellazo NFT on Simulated Solana Devnet.
                        </Text>

                        <View className="bg-secondary p-3 border-4 border-border shadow-brutal-sm mb-3">
                          <Text className="text-border font-black uppercase text-xs mb-1">Mint address</Text>
                          <Text className="text-border font-bold text-sm">{shortHash(mintedToken.mintAddress)}</Text>
                        </View>

                        <View className="bg-background p-3 border-4 border-border mb-4">
                          <Text className="text-border font-black uppercase text-xs mb-1">Transaction signature</Text>
                          <Text className="text-border font-bold text-sm">{shortHash(mintedToken.transactionSignature)}</Text>
                        </View>

                        {alreadyMinted ? (
                          <Text className="text-border font-bold text-xs mb-4 uppercase text-primary">
                            You already had this token, so it wasn't duplicated in your profile.
                          </Text>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Text className="text-border text-base mb-6 font-bold">
                          {selectedPoi 
                            ? `You arrived at ${selectedPoi.name}. Simulating the scan will mint a visit token related to this project milestone.`
                            : 'Point the camera at the physical QR of the monument or allied business to validate your visit.'}
                        </Text>
                        
                        <View className="bg-secondary p-3 border-4 border-border shadow-brutal-sm mb-6 flex-row items-center">
                          <FontAwesome5 name="coins" size={20} color={colors.border} />
                          <Text className="text-border font-black ml-3">Reward: {selectedPoi?.reward ?? 50} $HUELLAZOS</Text>
                        </View>
                      </>
                    )}
                    
                    <BrutalistButton 
                      title={mintedToken ? 'VIEW IN PROFILE' : 'MINT NFT'} 
                      colorClass="bg-accent1" 
                      onPress={mintedToken ? handleGoToPassport : handleSimulateMint} 
                    />
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
               <Text className="text-border font-black text-xl uppercase">Radar Tools</Text>
               <Pressable onPress={() => setIsToolsModalVisible(false)} className="bg-primary border-4 border-border p-2 active:scale-95">
                 <FontAwesome5 name="times" size={20} color={colors.border} />
               </Pressable>
            </View>

            <LiveActivityFeed />

            <View className="mb-6 mt-4">
              <BrutalistButton 
                title={isRadarBoosted ? "RADAR OVERCLOCKED (ACTIVE)" : "OVERCLOCK RADAR (100 $HUELLAZOS)"} 
                colorClass={isRadarBoosted ? "bg-[#39FF14]" : "bg-primary"}
                disabled={isRadarBoosted}
                onPress={() => activateRadarBoost(100)} 
              />
              <Text className="text-border text-xs font-bold text-center mt-2 opacity-80">
                Boost your radar for 30 minutes to discover hidden POIs and rare drops.
              </Text>
            </View>
          </BrutalistCard>
        </View>
      </Modal>
    </View>
  );
}
