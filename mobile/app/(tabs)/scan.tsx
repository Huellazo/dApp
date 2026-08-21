import React, { useState, useRef } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Image, Platform, ScrollView } from 'react-native';
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
import { SolanaPayModal } from '@/components/features/scan/SolanaPayModal';
import { parseSolanaPayUrl } from '@/utils/solana-pay-parser';
import type { ParsedSolanaPay } from '@/utils/solana-pay-parser';
import { getMetadataJsonUrl } from '@/services/metadata-service';

import { StickerClaimAnimation } from '@/components/features/scan/StickerClaimAnimation';

let jsQR: any = null;
try {
  jsQR = require('jsqr');
} catch (e) {
  jsQR = null;
}

type MapPoi = (typeof MOCK_POIS)[number] & {
  top: `${number}%`;
  left: `${number}%`;
};

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

export default function ScanScreen() {
  const { t, language } = useLanguage();
  const { mintPoiToken, applyPenalty, isRadarBoosted, activateRadarBoost, earnPoints } = useAppState();
  const { mintPlaceOnChain } = useHuellazoWeb3();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<MintablePoi | null>(null);
  const [mintedToken, setMintedToken] = useState<EarnedSolanaToken | null>(null);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  
  // Full Map View Modal State
  const [isFullMapModalVisible, setIsFullMapModalVisible] = useState(false);

  // Lightweight Claim Celebration Animation State
  const [claimAnimationVisible, setClaimAnimationVisible] = useState(false);
  const [claimedPoi, setClaimedPoi] = useState<MintablePoi | null>(null);
  const [claimedReward, setClaimedReward] = useState(50);

  // Penalty state
  const [isPenaltyFlagged, setIsPenaltyFlagged] = useState(false);
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);
  const [isToolsModalVisible, setIsToolsModalVisible] = useState(false);

  // Solana Pay QR Modal State
  const [solanaPayModalVisible, setSolanaPayModalVisible] = useState(false);
  const [solanaPayData, setSolanaPayData] = useState<ParsedSolanaPay | null>(null);
  const [qrScanError, setQrScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    // Open scanner demo with place check-in QR
    const samplePlaceQr = `huellazo:place?id=poi1&name=${encodeURIComponent('Palacio Municipal Huajuapan')}&reward=50`;
    handleProcessQrCode(samplePlaceQr);
  };

  const handleProcessQrCode = (qrString: string) => {
    setQrScanError(null);

    // 1. POI Place Check-in QR Code (huellazo:place or id=poi)
    if (qrString.includes('huellazo:place') || qrString.includes('solana:place') || qrString.includes('id=poi')) {
      try {
        const urlStr = qrString.replace('huellazo:', 'https://huellazo.app/').replace('solana:', 'https://huellazo.app/');
        const urlObj = new URL(urlStr);
        const poiId = urlObj.searchParams.get('id') || 'poi1';
        const poiName = urlObj.searchParams.get('name') ? decodeURIComponent(urlObj.searchParams.get('name')!) : 'Lugar Reclamado';
        const reward = Number(urlObj.searchParams.get('reward')) || 50;

        const matchedPoi = MOCK_POIS.find(p => p.id === poiId) || MOCK_POIS[0];

        // Trigger Solana Devnet cNFT mint in background
        const metadataUri = getMetadataJsonUrl(matchedPoi.id);
        mintPlaceOnChain({
          tokenId: Number(matchedPoi.id.replace(/\D/g, '')) || 101,
          tokenUri: metadataUri,
          latitude: (matchedPoi as any).coordinates?.latitude || 17.807,
          longitude: (matchedPoi as any).coordinates?.longitude || -97.776,
          placeName: poiName,
          allowSimulationFallback: true,
        }).catch(err => console.log('Web3 Devnet place mint notice:', err));

        const result = mintPoiToken(matchedPoi);
        setClaimedPoi(matchedPoi);
        setClaimedReward(reward);
        setMintedToken(result.token);
        setModalVisible(false);
        setClaimAnimationVisible(true);
        return;
      } catch (err) {
        console.warn('Place QR parse notice:', err);
      }
    }

    // 2. P2P Stamp Trade QR Code
    if (qrString.includes('huellazo:trade') || qrString.includes('solana:trade') || qrString.includes('stampId=')) {
      try {
        const urlStr = qrString.replace('huellazo:', 'https://huellazo.app/').replace('solana:', 'https://huellazo.app/');
        const urlObj = new URL(urlStr);
        const stampId = urlObj.searchParams.get('stampId') || 'poi1';
        const stampTitle = urlObj.searchParams.get('title') ? decodeURIComponent(urlObj.searchParams.get('title')!) : 'Estampa Intercambiada';
        
        const matchedPoi = MOCK_POIS.find(p => p.id === stampId) || MOCK_POIS[0];
        
        const result = mintPoiToken(matchedPoi);
        earnPoints(50, `Intercambio P2P: Estampa ${stampTitle}`);
        
        setClaimedPoi(matchedPoi);
        setClaimedReward(50);
        setMintedToken(result.token);
        setModalVisible(false);
        setClaimAnimationVisible(true);
        return;
      } catch (err) {
        console.warn('Trade QR parse notice:', err);
      }
    }

    // 3. Solana Pay Payment QR Code
    const parsed = parseSolanaPayUrl(qrString);
    if (parsed) {
      setSolanaPayData(parsed);
      setSolanaPayModalVisible(true);
    } else {
      setQrScanError(
        language === 'es'
          ? 'El código QR no es un formato válido de Lugar, Solana Pay o Intercambio P2P'
          : 'Invalid Place, Solana Pay or Trade QR format'
      );
    }
  };

  // Web Image Upload QR Handler
  const handleWebFileUpload = (event: any) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (typeof window !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);

            if (jsQR) {
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code && code.data) {
                handleProcessQrCode(code.data);
                return;
              }
            }
          }
          // Fallback sample QR simulation if canvas decode didn't match raw pixels
          handleProcessQrCode(`solana:8XbN77QkP11111111111111111111111111111111111?amount=0.035&label=${encodeURIComponent('Café Petirrojo Huajuapan')}&message=${encodeURIComponent('Consumo de Café Organico')}&memo=HZ-${Date.now()}`);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoSolanaPayQr = () => {
    const sampleUri = `solana:8XbN77QkP11111111111111111111111111111111111?amount=0.035&label=${encodeURIComponent('Café Petirrojo Huajuapan')}&message=${encodeURIComponent('Consumo de Café y Pan de Yema')}&memo=HZ-${Date.now()}`;
    handleProcessQrCode(sampleUri);
  };

  const handleSimulateMint = async () => {
    const poiToMint = selectedPoi ?? mapPoints[0];
    if (!poiToMint) return;
    
    // Simulate 10% chance of a GPS spoofing penalty
    if (Math.random() < 0.1) {
      applyPenalty(50, 'Inconsistencia de Ubicación GPS');
      setIsPenaltyFlagged(true);
      return;
    }

    // Trigger Solana Devnet mint_place transaction
    const lat = (poiToMint as any).coordinates?.latitude || 17.807;
    const lng = (poiToMint as any).coordinates?.longitude || -97.776;

    const metadataUri = getMetadataJsonUrl(poiToMint.id);

    mintPlaceOnChain({
      tokenId: Number(poiToMint.id.replace(/\D/g, '')) || 101,
      tokenUri: metadataUri,
      latitude: lat,
      longitude: lng,
      placeName: poiToMint.name,
      allowSimulationFallback: true,
    }).catch(err => console.log('Web3 Devnet background mint notice:', err));

    const result = mintPoiToken(poiToMint);
    setSelectedPoi(poiToMint);
    setClaimedPoi(poiToMint);
    setClaimedReward(poiToMint.reward || 50);
    setMintedToken(result.token);
    setAlreadyMinted(result.alreadyMinted);
    setIsPenaltyFlagged(false);
    setModalVisible(false);
    setClaimAnimationVisible(true);
  };

  const handleGoToPassport = () => {
    setModalVisible(false);
    setClaimAnimationVisible(false);
    router.push('/(tabs)/passport');
  };

  return (
    <View className="flex-1 bg-background pt-12">
      <Text className="text-3xl font-black text-border px-4 mb-1 uppercase tracking-tight">{t('scan.title')}</Text>
      <Text className="text-border px-4 mb-3 font-bold text-sm">{t('scan.subtitle')}</Text>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Interactive Minimap Preview Card */}
        <Pressable 
          onPress={() => setIsFullMapModalVisible(true)} 
          className="mb-4 border-4 border-border rounded-xl shadow-brutal-md overflow-hidden active:scale-98 transition-transform"
        >
          <View className={`w-full h-56 ${isRadarBoosted ? 'bg-accent2/30' : 'bg-secondary/40'} relative justify-center items-center`}>
            
            {/* Background Grid Pattern */}
            <View style={StyleSheet.absoluteFillObject} className="opacity-25">
               <View className="absolute top-1/4 w-full h-1 bg-border" />
               <View className="absolute top-2/4 w-full h-1 bg-border" />
               <View className="absolute top-3/4 w-full h-1 bg-border" />
               <View className="absolute left-1/4 h-full w-1 bg-border" />
               <View className="absolute left-2/4 h-full w-1 bg-border" />
               <View className="absolute left-3/4 h-full w-1 bg-border" />
            </View>

            {/* User Radar Radius */}
            <View className={`w-44 h-44 rounded-full border-4 ${isRadarBoosted ? 'border-primary border-dashed bg-accent2/20' : 'border-border bg-background/50'} absolute justify-center items-center`}>
               <View className={`w-32 h-32 rounded-full border-2 ${isRadarBoosted ? 'border-primary' : 'border-border'} border-dashed opacity-50 absolute`} />
            </View>

            {/* User Center Avatar */}
            <View className="w-12 h-12 bg-primary border-4 border-border rounded-full justify-center items-center z-20 shadow-brutal-sm">
               <FontAwesome5 name="user-astronaut" size={18} color="#FAF9F6" />
            </View>

            {/* Render POI Pins */}
            {mapPoints.map((poi) => (
              <View
                key={poi.id}
                style={{ top: poi.top, left: poi.left }}
                className="absolute z-30 items-center"
              >
                <View className="bg-accent1 p-2 border-2 border-border shadow-brutal-sm rounded-full justify-center items-center">
                  <FontAwesome5 name={poi.category === 'business' ? 'store' : 'landmark'} size={12} color="#FAF9F6" />
                </View>
              </View>
            ))}

            {/* Expand Map Badge */}
            <View className="absolute bottom-3 bg-background border-2 border-border px-3 py-1 shadow-brutal-sm rounded-full flex-row items-center z-40">
               <FontAwesome5 name="expand-arrows-alt" size={10} color={colors.border} style={{ marginRight: 6 }} />
               <Text className="text-border font-black text-[10px] uppercase">
                 {language === 'es' ? 'TOCA PARA ABRIR MAPA COMPLETO' : 'TAP TO OPEN FULL MAP'}
               </Text>
            </View>

          </View>
        </Pressable>

        {/* Section 1: Main Scanning Actions */}
        <View className="mb-4">
          {qrScanError && (
            <Text className="text-primary font-black text-[10px] uppercase mb-2 text-center">{qrScanError}</Text>
          )}

          <View className="flex-row justify-between items-center">
            {/* Scan POI Location */}
            <View className="w-[48%]">
               <BrutalistButton 
                 title={language === 'es' ? "ESCANEAR LUGAR" : "SCAN LOCATION"} 
                 colorClass="bg-primary" 
                 onPress={handleOpenScanner} 
               />
            </View>

            {/* Solana Pay QR Reader */}
            <View className="w-[48%]">
               {Platform.OS === 'web' ? (
                 <>
                   <input
                     type="file"
                     accept="image/*"
                     ref={fileInputRef as any}
                     onChange={handleWebFileUpload}
                     style={{ display: 'none' }}
                   />
                   <BrutalistButton 
                     title={language === 'es' ? "SUBIR QR SOLANA PAY" : "UPLOAD SOLANA QR"} 
                     colorClass="bg-accent2" 
                     onPress={() => {
                       if (fileInputRef.current) {
                         fileInputRef.current.click();
                       } else {
                         handleDemoSolanaPayQr();
                       }
                     }} 
                   />
                 </>
               ) : (
                 <BrutalistButton 
                   title={language === 'es' ? "ESCANEAR QR SOLANA" : "SCAN SOLANA QR"} 
                   colorClass="bg-accent2" 
                   onPress={handleDemoSolanaPayQr} 
                 />
               )}
            </View>
          </View>
        </View>

        {/* Section 2: Secondary Tools & P2P Trade */}
        <View className="flex-row justify-between items-center mb-6">
           <View className="w-[48%]">
             <BrutalistButton title={t('scan.radar_tools')} colorClass="bg-secondary" onPress={() => setIsToolsModalVisible(true)} />
           </View>
           <View className="w-[48%]">
             <BrutalistButton title={t('scan.trade_button')} colorClass="bg-accent2" onPress={() => setIsTradeModalVisible(true)} />
           </View>
        </View>

        {/* Section 3: Live Activity Feed */}
        <View className="mb-6">
           <LiveActivityFeed />
        </View>

      </ScrollView>

      {/* Fullscreen Simulated Interactive Map Modal */}
      <Modal visible={isFullMapModalVisible} animationType="slide" onRequestClose={() => setIsFullMapModalVisible(false)}>
        <View className="flex-1 bg-background pt-10">
          
          {/* Fullscreen Map Header */}
          <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center z-50">
            <View className="flex-row items-center">
              <FontAwesome5 name="map-marked-alt" size={20} color="#FAF9F6" style={{ marginRight: 8 }} />
              <Text className="text-background font-black text-xl uppercase">
                {language === 'es' ? 'Mapa de Exploración' : 'Exploration Map'}
              </Text>
            </View>
            
            <Pressable 
              onPress={() => setIsFullMapModalVisible(false)}
              className="w-9 h-9 rounded-full bg-background border-2 border-border justify-center items-center shadow-brutal-sm active:scale-95"
            >
              <FontAwesome5 name="times" size={16} color={colors.border} />
            </Pressable>
          </View>

          {/* Map Environment View */}
          <View className={`flex-1 ${isRadarBoosted ? 'bg-accent2/30' : 'bg-secondary/40'} relative justify-center items-center overflow-hidden`}>
             
             {/* Background Grid Pattern */}
             <View style={StyleSheet.absoluteFillObject} className="opacity-20">
                <View className="absolute top-1/4 w-full h-1 bg-border" />
                <View className="absolute top-2/4 w-full h-1 bg-border" />
                <View className="absolute top-3/4 w-full h-1 bg-border" />
                <View className="absolute left-1/4 h-full w-1 bg-border" />
                <View className="absolute left-2/4 h-full w-1 bg-border" />
                <View className="absolute left-3/4 h-full w-1 bg-border" />
             </View>

             {/* Radar Radius */}
             <View className={`w-72 h-72 rounded-full border-4 ${isRadarBoosted ? 'border-primary border-dashed bg-accent2/20' : 'border-border bg-background/50'} absolute justify-center items-center`}>
                <View className={`w-52 h-52 rounded-full border-2 ${isRadarBoosted ? 'border-primary' : 'border-border'} border-dashed opacity-50 absolute`} />
                {isRadarBoosted && (
                  <Text className="absolute top-4 text-primary font-black text-[10px] uppercase tracking-widest">{t('scan.boosted')}</Text>
                )}
             </View>

             {/* User Astronaut Center Avatar */}
             <View className="w-16 h-16 bg-primary border-4 border-border rounded-full justify-center items-center z-20 shadow-brutal-md">
                <FontAwesome5 name="user-astronaut" size={24} color="#FAF9F6" />
             </View>

             {/* Render Interactive POI Pins in Full Map */}
             {mapPoints.map((poi) => (
               <Pressable
                 key={poi.id}
                 onPress={() => {
                   setIsFullMapModalVisible(false);
                   handlePoiClick(poi);
                 }}
                 style={{ top: poi.top, left: poi.left }}
                 className="absolute z-30 items-center active:scale-110"
               >
                 <View className="bg-accent1 p-3 border-4 border-border shadow-brutal-md rounded-full justify-center items-center">
                   <FontAwesome5 name={poi.category === 'business' ? 'store' : 'landmark'} size={16} color="#FAF9F6" />
                 </View>
                 <View className="bg-background border-2 border-border px-2 py-1 mt-1 shadow-brutal-sm max-w-[100px]">
                   <Text className="text-border font-black text-[9px] uppercase text-center" numberOfLines={1}>
                     {poi.name}
                   </Text>
                 </View>
               </Pressable>
             ))}

             {/* Info Footer Overlay */}
             <View className="absolute bottom-6 left-4 right-4 bg-background border-4 border-border p-3 shadow-brutal-md">
                <Text className="text-border font-black text-xs uppercase mb-0.5">
                  {language === 'es' ? '📍 Entorno Huajuapan de León' : '📍 Huajuapan Environment'}
                </Text>
                <Text className="text-border text-[10px] font-bold opacity-80">
                  {language === 'es' ? 'Toca cualquier punto de interés en el mapa para reclamar tu estampa.' : 'Tap any POI on the map to claim your stamp.'}
                </Text>
             </View>

          </View>

        </View>
      </Modal>

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

      {/* Solana Pay Confirmation Modal */}
      <SolanaPayModal
        visible={solanaPayModalVisible}
        solanaPayData={solanaPayData}
        onClose={() => setSolanaPayModalVisible(false)}
      />

      {/* Trade Accept Modal */}
      <TradeAcceptModal visible={isTradeModalVisible} onClose={() => setIsTradeModalVisible(false)} />

      {/* Lightweight Stamp Claim Celebration Animation */}
      <StickerClaimAnimation
        visible={claimAnimationVisible}
        title={claimedPoi?.name || 'Estampa Reclamada'}
        location={(claimedPoi as any)?.location || 'Huajuapan de León, Oaxaca'}
        rewardPoints={claimedReward}
        image={claimedPoi?.image}
        mintAddress={mintedToken?.mintAddress}
        onClose={() => setClaimAnimationVisible(false)}
        onGoToPassport={handleGoToPassport}
      />

    </View>
  );
}
