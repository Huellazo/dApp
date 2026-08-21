import React, { useState, useRef } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Image, Platform } from 'react-native';
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
    const nearestPoi = mapPoints[0];
    if (!nearestPoi) return;

    setSelectedPoi(nearestPoi);
    setMintedToken(null);
    setAlreadyMinted(false);
    setModalVisible(true);
  };

  const handleProcessQrCode = (qrString: string) => {
    setQrScanError(null);

    // 1. P2P Stamp Trade QR Code
    if (qrString.includes('huellazo:trade') || qrString.includes('solana:trade') || qrString.includes('stampId=')) {
      try {
        const urlStr = qrString.replace('huellazo:', 'https://huellazo.app/').replace('solana:', 'https://huellazo.app/');
        const urlObj = new URL(urlStr);
        const stampId = urlObj.searchParams.get('stampId') || 'poi1';
        const stampTitle = urlObj.searchParams.get('title') ? decodeURIComponent(urlObj.searchParams.get('title')!) : 'Estampa Intercambiada';
        
        const matchedPoi = MOCK_POIS.find(p => p.id === stampId) || MOCK_POIS[0];
        
        mintPoiToken(matchedPoi);
        earnPoints(50, `Intercambio P2P: Estampa ${stampTitle}`);
        
        setSelectedPoi(matchedPoi);
        setModalVisible(true);
        return;
      } catch (err) {
        console.warn('Trade QR parse notice:', err);
      }
    }

    // 2. Solana Pay Payment QR Code
    const parsed = parseSolanaPayUrl(qrString);
    if (parsed) {
      setSolanaPayData(parsed);
      setSolanaPayModalVisible(true);
    } else {
      setQrScanError(
        language === 'es'
          ? 'El código QR no es un formato válido de Solana Pay o Intercambio P2P'
          : 'Invalid Solana Pay or Trade QR format'
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

        {/* Render POI Pins */}
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

      {/* Action Footer with POI Scan & Solana Pay QR Scanner */}
      <View className="p-3 bg-background border-b-4 border-border">
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

           {/* Solana Pay QR Reader (File Upload on Web / Camera on Mobile) */}
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

      {/* Solana Pay Confirmation Modal */}
      <SolanaPayModal
        visible={solanaPayModalVisible}
        solanaPayData={solanaPayData}
        onClose={() => setSolanaPayModalVisible(false)}
      />

      {/* Trade Accept Modal */}
      <TradeAcceptModal visible={isTradeModalVisible} onClose={() => setIsTradeModalVisible(false)} />

    </View>
  );
}
