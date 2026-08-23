import React, { useState, useRef, useMemo } from 'react';
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
import { checkGeofenceStatus } from '@/services/geofence-service';
import { ScanMapboxRadar } from '@/components/features/scan/ScanMapboxRadar';

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

// Coordenadas fijas del Centro Histórico de Huajuapan de León, Oaxaca
const HUAJUAPAN_CENTER: [number, number] = [-97.7786, 17.8067];

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

  // Solana Pay & Universal QR Modal State
  const [isUniversalQrModalVisible, setIsUniversalQrModalVisible] = useState(false);
  const [solanaPayModalVisible, setSolanaPayModalVisible] = useState(false);
  const [solanaPayData, setSolanaPayData] = useState<ParsedSolanaPay | null>(null);
  const [qrScanError, setQrScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Transformar MOCK_POIS a coordenadas GeoJSON de Huajuapan
  const geofencedPois = useMemo(() => {
    const poisWithCoords = MOCK_POIS.map((poi, idx) => {
      const coords: [number, number] = [
        -97.7786 + (idx * 0.0012 - 0.001),
        17.8067 + ((idx % 3) * 0.001 - 0.0008),
      ];
      return {
        id: poi.id,
        name: poi.name,
        category: poi.category,
        coords,
        address: (poi as any).address || 'Huajuapan de León, Oaxaca',
        rewardPoints: poi.reward || 50,
        rewardStamp: (poi as any).stampImage || (poi as any).nftReward,
        image: poi.image,
      };
    });

    return checkGeofenceStatus(HUAJUAPAN_CENTER, poisWithCoords, 50);
  }, []);

  // Static mock positions for PokeStops around the center
  const mapPoints: MapPoi[] = MOCK_POIS.slice(0, 5).map((poi, idx) => ({
    ...poi,
    top: `${15 + (idx * 37) % 70}%` as `${number}%`,
    left: `${10 + (idx * 43) % 75}%` as `${number}%`,
  }));

  const handlePoiClick = (poi: any) => {
    const matchedPoi = MOCK_POIS.find((p) => p.id === poi.id) || MOCK_POIS[0];
    setSelectedPoi(matchedPoi);
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

    // 1. Piñata Blink Reward QR Code (huellazo:pinata, solana-action, or /blinks/)
    if (qrString.includes('huellazo:pinata') || qrString.includes('solana-action:') || qrString.includes('blink')) {
      try {
        const urlStr = qrString.replace('huellazo:', 'https://huellazo.app/').replace('solana:', 'https://huellazo.app/');
        const urlObj = new URL(urlStr);
        const poiId = urlObj.searchParams.get('id') || urlObj.searchParams.get('poiId') || 'cerro_minas';
        const reward = Number(urlObj.searchParams.get('reward')) || 100;
        
        const matchedPoi = MOCK_POIS.find(p => p.id === poiId) || MOCK_POIS[0];
        
        // Award Piñata Reward Points ($HZ) directly in the app
        earnPoints(reward, `Recompensa de Piñata Blink: ${matchedPoi.name}`);

        setClaimedPoi(matchedPoi);
        setClaimedReward(reward);
        setModalVisible(false);
        setClaimAnimationVisible(true);
        return;
      } catch (err) {
        console.warn('Piñata Blink QR parse notice:', err);
      }
    }

    // 2. POI Place Check-in QR Code (huellazo:place or id=poi)
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
        setAlreadyMinted(result.alreadyMinted);
        setModalVisible(false);
        setClaimAnimationVisible(true);
        return;
      } catch (err) {
        console.warn('Place QR parse notice:', err);
      }
    }

    // 3. P2P Stamp Trade QR Code
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

    // 4. Solana Pay Payment QR Code
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
    
    if (Math.random() < 0.1) {
      applyPenalty(50, 'Inconsistencia de Ubicación GPS');
      setIsPenaltyFlagged(true);
      return;
    }

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
        
        {/* Mapbox 3D Standard Radar Header Component */}
        <ScanMapboxRadar
          userCoords={HUAJUAPAN_CENTER}
          pois={geofencedPois}
          onSelectPOI={handlePoiClick}
          onOpenFullMap={() => setIsFullMapModalVisible(true)}
        />

        {/* Section 1: Universal Intelligent Scanner Button */}
        <View className="mb-4">
          {qrScanError && (
            <Text className="text-primary font-black text-[10px] uppercase mb-2 text-center">{qrScanError}</Text>
          )}

          {/* Single Main Intelligent Scanner Button */}
          <BrutalistButton
            title={language === 'es' ? "📷 ESCANEAR CÓDIGO QR" : "📷 SCAN QR CODE"}
            colorClass="bg-primary"
            onPress={() => setIsUniversalQrModalVisible(true)}
          />

          {/* Hidden File Input for Image Upload */}
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef as any}
              onChange={handleWebFileUpload}
              style={{ display: 'none' }}
            />
          )}
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

      {/* Fullscreen Mapbox 3D Modal */}
      <Modal visible={isFullMapModalVisible} animationType="fade" onRequestClose={() => setIsFullMapModalVisible(false)}>
        <View className="flex-1 bg-background">
          <ScanMapboxRadar
            height="100%"
            isFullScreen={true}
            onCloseFullScreen={() => setIsFullMapModalVisible(false)}
            userCoords={HUAJUAPAN_CENTER}
            pois={geofencedPois}
            onSelectPOI={(poi) => {
              setIsFullMapModalVisible(false);
              handlePoiClick(poi);
            }}
          />
        </View>
      </Modal>

      {/* POI Scanner / Minting Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden rounded-2xl border-4 border-border shadow-brutal">
            
            {/* Header */}
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
              <View className="flex-row items-center flex-1 mr-2">
                <FontAwesome5 name="map-marker-alt" size={18} color="#FAF9F6" style={{ marginRight: 8 }} />
                <Text className="text-background font-black text-lg uppercase" numberOfLines={1}>
                  {isPenaltyFlagged ? t('scan.penalty_title') : selectedPoi ? selectedPoi.name : t('scan.found_title')}
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="w-8 h-8 rounded-full bg-background border-2 border-border justify-center items-center shadow-brutal-sm active:scale-95"
              >
                <FontAwesome5 name="times" size={14} color="#3D405B" />
              </Pressable>
            </View>

            <View className="p-5 bg-surface/30">
              {isPenaltyFlagged ? (
                <View className="items-center py-2">
                  <View className="w-16 h-16 bg-primary border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                    <FontAwesome5 name="exclamation-triangle" size={28} color="#FAF9F6" />
                  </View>
                  <Text className="text-primary font-black text-lg text-center uppercase mb-2">
                    {t('scan.penalty_wanted')}
                  </Text>
                  <Text className="text-border text-xs text-center font-bold mb-6 leading-relaxed">
                    {t('scan.penalty_desc')}
                  </Text>
                  <BrutalistButton title={t('scan.understood')} colorClass="bg-secondary" onPress={() => setModalVisible(false)} />
                </View>
              ) : (
                <View className="items-center">
                  {selectedPoi?.image ? (
                    <View className="w-full h-40 border-4 border-border shadow-brutal-sm mb-4 overflow-hidden rounded-xl bg-background">
                      <Image source={selectedPoi.image as any} className="w-full h-full" resizeMode="cover" />
                    </View>
                  ) : (
                    <View className="w-full h-32 bg-accent1/30 border-4 border-border justify-center items-center mb-4 rounded-xl">
                      <FontAwesome5 name="certificate" size={44} color="#3D405B" />
                    </View>
                  )}

                  <Text className="text-border font-black text-lg text-center uppercase mb-1 leading-tight">
                    {selectedPoi?.name || 'Lugar de Huajuapan'}
                  </Text>
                  <Text className="text-border text-xs font-bold opacity-75 text-center mb-3">
                    📍 {(selectedPoi as any)?.address || 'Huajuapan de León, Oaxaca'}
                  </Text>

                  <Text className="text-border text-xs font-bold text-center leading-relaxed mb-4">
                    {selectedPoi?.description || t('scan.subtitle')}
                  </Text>

                  {/* Recompensa prevista */}
                  <View className="bg-accent2/40 border-2 border-border p-3 rounded-xl w-full mb-5 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <FontAwesome5 name="coins" size={14} color="#3D405B" style={{ marginRight: 6 }} />
                      <Text className="text-border font-black text-xs uppercase">Recompensa por Escanear</Text>
                    </View>
                    <Text className="text-border font-black text-sm">+{selectedPoi?.reward || 50} $HZ</Text>
                  </View>

                  <BrutalistButton
                    title={language === 'es' ? 'OBTENER ESTAMPA NFT (cNFT)' : 'CLAIM STAMP cNFT'}
                    colorClass="bg-primary"
                    onPress={handleSimulateMint}
                  />
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

      {/* Universal Intelligent QR Scanner Modal */}
      <Modal
        visible={isUniversalQrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsUniversalQrModalVisible(false)}
      >
        <View className="flex-1 bg-black/85 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-md w-full p-0 overflow-hidden rounded-2xl border-4 border-border shadow-brutal">
            
            {/* Header */}
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
              <View className="flex-row items-center flex-1 mr-2">
                <FontAwesome5 name="qrcode" size={20} color="#FAF9F6" style={{ marginRight: 8 }} />
                <Text className="text-background font-black text-lg uppercase" numberOfLines={1}>
                  {language === 'es' ? 'Escáner Inteligente QR' : 'Smart QR Scanner'}
                </Text>
              </View>

              <Pressable
                onPress={() => setIsUniversalQrModalVisible(false)}
                className="w-9 h-9 rounded-full bg-background border-2 border-border justify-center items-center shadow-brutal-sm active:scale-95"
              >
                <FontAwesome5 name="times" size={14} color="#3D405B" />
              </Pressable>
            </View>

            <ScrollView className="p-4" style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
              
              {/* Subtítulo explicativo */}
              <Text className="text-border font-bold text-xs mb-4 text-center leading-relaxed opacity-80">
                {language === 'es'
                  ? 'Escanea con tu cámara o sube una imagen de QR. Nuestra dApp detectará automáticamente si es un pago con Solana Pay, estampa cNFT o Piñata Blink.'
                  : 'Scan with camera or upload a QR image. Automatic detection for Solana Pay, cNFTs, or Blinks.'}
              </Text>

              {/* Opción 1: Usar Cámara en Vivo / Visor de Escaneo */}
              <View className="mb-4">
                <BrutalistCard colorClass="bg-accent2/20 p-4 rounded-xl border-3 border-border items-center">
                  <View className="w-14 h-14 bg-accent2 border-3 border-border rounded-full justify-center items-center mb-2 shadow-brutal-sm">
                    <FontAwesome5 name="camera" size={24} color="#3D405B" />
                  </View>
                  <Text className="text-border font-black text-base uppercase mb-1">
                    {language === 'es' ? '1. Escanear con Cámara' : '1. Scan with Camera'}
                  </Text>
                  <Text className="text-border font-bold text-[10px] opacity-75 mb-3 text-center">
                    {language === 'es' ? 'Abre el visor en tiempo real para leer códigos QR en físico' : 'Real-time camera scanner'}
                  </Text>
                  <BrutalistButton
                    title={language === 'es' ? 'ACTIVAR CÁMARA EN VIVO' : 'OPEN LIVE CAMERA'}
                    colorClass="bg-primary"
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleOpenScanner();
                    }}
                  />
                </BrutalistCard>
              </View>

              {/* Opción 2: Subir Imagen de Galería / Archivo */}
              <View className="mb-5">
                <BrutalistCard colorClass="bg-secondary/30 p-4 rounded-xl border-3 border-border items-center">
                  <View className="w-14 h-14 bg-secondary border-3 border-border rounded-full justify-center items-center mb-2 shadow-brutal-sm">
                    <FontAwesome5 name="image" size={24} color="#3D405B" />
                  </View>
                  <Text className="text-border font-black text-base uppercase mb-1">
                    {language === 'es' ? '2. Subir Imagen de Galería' : '2. Upload QR Image'}
                  </Text>
                  <Text className="text-border font-bold text-[10px] opacity-75 mb-3 text-center">
                    {language === 'es' ? 'Carga una captura o fotografía guardada en tu dispositivo' : 'Select a saved QR photo from gallery'}
                  </Text>
                  <BrutalistButton
                    title={language === 'es' ? 'ELEGIR IMAGEN DE GALERÍA' : 'SELECT FROM GALLERY'}
                    colorClass="bg-accent2"
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      } else {
                        handleDemoSolanaPayQr();
                      }
                    }}
                  />
                </BrutalistCard>
              </View>

              {/* Opción 3: Accesos Rápidos de Prueba (Demostración de QRs del proyecto ./qrcodes) */}
              <View className="mb-2">
                <Text className="text-border font-black text-xs uppercase mb-2">
                  ⚡ Demostración Rápida de QRs (`./qrcodes`):
                </Text>

                {/* Sub-Sección A: Comercios Solana Pay */}
                <Text className="text-border font-black text-[10px] uppercase mb-1.5 opacity-80">
                  • Pagos con Solana Pay:
                </Text>
                <View className="flex-row justify-between mb-3">
                  <Pressable
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleProcessQrCode(`solana:8XbN77QkP11111111111111111111111111111111111?amount=0.035&label=${encodeURIComponent('Café Petirrojo Huajuapan')}&message=${encodeURIComponent('Consumo de Café Orgánico y Pan de Yema')}&memo=HZ-PETIRROJO`);
                    }}
                    className="w-[31%] bg-background border-2 border-border p-2 rounded-xl items-center shadow-brutal-sm active:scale-95"
                  >
                    <Text className="text-lg mb-0.5">☕</Text>
                    <Text className="text-border font-black text-[9px] uppercase text-center" numberOfLines={1}>Petirrojo</Text>
                    <Text className="text-border font-bold text-[8px] opacity-75">0.035 SOL</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleProcessQrCode(`solana:7YcM88RkP22222222222222222222222222222222222?amount=0.085&label=${encodeURIComponent('Casa del Humo Restaurante')}&message=${encodeURIComponent('Platillo Tradicional Mole de Caderas')}&memo=HZ-HUMO`);
                    }}
                    className="w-[31%] bg-background border-2 border-border p-2 rounded-xl items-center shadow-brutal-sm active:scale-95"
                  >
                    <Text className="text-lg mb-0.5">🥩</Text>
                    <Text className="text-border font-black text-[9px] uppercase text-center" numberOfLines={1}>Casa Humo</Text>
                    <Text className="text-border font-bold text-[8px] opacity-75">0.085 SOL</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleProcessQrCode(`solana:9ZpN99SkP33333333333333333333333333333333333?amount=0.045&label=${encodeURIComponent('Fonda Julita Huajuapan')}&message=${encodeURIComponent('Tacos de Cecina y Agua Fresca')}&memo=HZ-JULITA`);
                    }}
                    className="w-[31%] bg-background border-2 border-border p-2 rounded-xl items-center shadow-brutal-sm active:scale-95"
                  >
                    <Text className="text-lg mb-0.5">🌮</Text>
                    <Text className="text-border font-black text-[9px] uppercase text-center" numberOfLines={1}>Fonda Julita</Text>
                    <Text className="text-border font-bold text-[8px] opacity-75">0.045 SOL</Text>
                  </Pressable>
                </View>

                {/* Sub-Sección B: Reclamos cNFT / Blinks */}
                <Text className="text-border font-black text-[10px] uppercase mb-1.5 opacity-80">
                  • cNFTs y Piñata Blinks:
                </Text>
                <View className="flex-row justify-between mb-2">
                  <Pressable
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleProcessQrCode(`huellazo:pinata?id=cafe_petirrojo&reward=100`);
                    }}
                    className="w-[48%] bg-background border-2 border-border p-2 rounded-xl flex-row items-center shadow-brutal-sm active:scale-95"
                  >
                    <Text className="text-base mr-2">🪅</Text>
                    <View className="flex-1">
                      <Text className="text-border font-black text-[9px] uppercase" numberOfLines={1}>Piñata Blink Petirrojo</Text>
                      <Text className="text-border font-bold text-[8px] opacity-75">+100 $HZ</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setIsUniversalQrModalVisible(false);
                      handleProcessQrCode(`huellazo:place?id=cerro_minas&name=${encodeURIComponent('Cerro de las Minas')}&reward=75`);
                    }}
                    className="w-[48%] bg-background border-2 border-border p-2 rounded-xl flex-row items-center shadow-brutal-sm active:scale-95"
                  >
                    <Text className="text-base mr-2">🏛️</Text>
                    <View className="flex-1">
                      <Text className="text-border font-black text-[9px] uppercase" numberOfLines={1}>Cerro de las Minas</Text>
                      <Text className="text-border font-bold text-[8px] opacity-75">Mint cNFT +75 $HZ</Text>
                    </View>
                  </Pressable>
                </View>

              </View>

            </ScrollView>

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
      <TradeAcceptModal
        visible={isTradeModalVisible}
        onClose={() => setIsTradeModalVisible(false)}
        onGoToPassport={handleGoToPassport}
      />

      {/* Lightweight Stamp Claim Celebration Animation */}
      <StickerClaimAnimation
        visible={claimAnimationVisible}
        title={claimedPoi?.name || 'Estampa Reclamada'}
        location={(claimedPoi as any)?.location || 'Huajuapan de León, Oaxaca'}
        rewardPoints={claimedReward}
        image={claimedPoi?.image}
        mintAddress={mintedToken?.mintAddress}
        alreadyMinted={alreadyMinted}
        onClose={() => setClaimAnimationVisible(false)}
        onGoToPassport={handleGoToPassport}
      />

    </View>
  );
}
