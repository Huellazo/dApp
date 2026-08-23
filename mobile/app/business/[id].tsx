import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state';
import { useHuellazoWeb3 } from '@/hooks/useHuellazoWeb3';
import { QrPaymentPanelModal } from '@/components/features/scan/QrPaymentPanelModal';
import { PlaceMapboxMinimap } from '@/components/features/radar/PlaceMapboxMinimap';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { earnPoints } = useAppState();
  const { mintBusinessOnChain, walletAddress } = useHuellazoWeb3();

  const place = MOCK_POIS.find(p => p.id === id);

  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [noWalletModalVisible, setNoWalletModalVisible] = useState(false);

  const [guestCount, setGuestCount] = useState(2);
  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  // Dedicated QR Bill Payment Panel Modal
  const [qrPanelVisible, setQrPanelVisible] = useState(false);

  if (!place) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-border font-black text-xl uppercase mb-4">Comercio no encontrado</Text>
        <BrutalistButton title={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  // Execute Solana Commercial Payment
  const executePayment = async (allowSimulation = false) => {
    if (!selectedMenuItem) return;

    setPaymentError(null);
    setPaymentLoading(true);

    const solAmount = Math.max(0.005, Number((selectedMenuItem.priceMXN * 0.0003).toFixed(4)));
    const amountLamports = Math.round(solAmount * 1_000_000_000);
    const lat = place.coordinates?.latitude || 17.807;
    const lng = place.coordinates?.longitude || -97.776;

    try {
      const res = await mintBusinessOnChain({
        amountLamports,
        businessName: `${place.name} - ${selectedMenuItem.name}`,
        latitude: lat,
        longitude: lng,
        allowSimulationFallback: allowSimulation,
      });

      if (res.success) {
        earnPoints(15, `Consumo en ${place.name}: ${selectedMenuItem.name}`);
        setPaymentSuccess(true);
        setPaymentModalVisible(true);
      } else if (res.error === 'NO_WALLET') {
        setNoWalletModalVisible(true);
      } else {
        setPaymentError(res.error || (language === 'es' ? 'Transacción rechazada en el monedero.' : 'Payment rejected in wallet.'));
        setPaymentSuccess(false);
        setPaymentModalVisible(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el pago';
      setPaymentError(msg);
      setPaymentSuccess(false);
      setPaymentModalVisible(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleOrderMenuItem = (item: any) => {
    setSelectedMenuItem(item);
    if (!walletAddress) {
      setNoWalletModalVisible(true);
    } else {
      executePayment(false);
    }
  };

  const handleConfirmReservation = async () => {
    setReservationLoading(true);
    const solAmount = 0.01;
    const amountLamports = Math.round(solAmount * 1_000_000_000);
    const lat = place.coordinates?.latitude || 17.807;
    const lng = place.coordinates?.longitude || -97.776;

    try {
      await mintBusinessOnChain({
        amountLamports,
        businessName: `Reservación ${place.name} (${guestCount} personas)`,
        latitude: lat,
        longitude: lng,
        allowSimulationFallback: true,
      });

      earnPoints(20, `Reservación confirmada en ${place.name}`);
    } catch (err) {
      console.log('Reservation notice:', err);
    } finally {
      setReservationLoading(false);
      setReservationModalVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>

        {/* Banner Header */}
        <View className="h-64 w-full border-b-4 border-border relative bg-accent2/30 overflow-hidden items-center justify-center">
          {place.image ? (
            <Image
              source={place.image as any}
              className="w-11/12 h-5/6"
              resizeMode="contain"
            />
          ) : (
            <View className="flex-1 justify-center items-center opacity-50">
              <Text className="text-border font-black text-2xl uppercase">[ IMAGEN DE LUGAR ]</Text>
            </View>
          )}

          {/* Top Navigation */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-12 h-12 bg-background border-4 border-border justify-center items-center shadow-brutal-sm rounded-full active:scale-95 z-20"
          >
            <FontAwesome5 name="arrow-left" size={20} color={colors.border} />
          </Pressable>

          <View className="absolute bottom-4 left-4 bg-primary border-4 border-border px-4 py-1.5 shadow-brutal-sm">
            <Text className="text-background font-black text-sm uppercase">{place.type}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View className="p-4 bg-background">

          {/* Header Title & Rating */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-3xl font-black text-border uppercase leading-none mb-1">{place.name}</Text>
              <Text className="text-border text-xs font-bold opacity-80">{place.address}</Text>
            </View>

            <View className="bg-secondary border-4 border-border p-2 shadow-brutal-sm items-center">
              <FontAwesome5 name="star" size={16} color={colors.border} solid />
              <Text className="text-border font-black text-sm mt-1">{place.rating || 4.9}</Text>
            </View>
          </View>

          {/* Features horizontal scroll */}
          {place.features && place.features.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {place.features.map((feature, idx) => (
                <View key={idx} className="bg-accent2/30 border-2 border-border px-3 py-1 mr-2 shadow-brutal-sm">
                  <Text className="text-border font-bold text-xs uppercase">✓ {feature}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* ⚡ DEDICATED SOLANA PAY QR BILL PAYMENT PANEL TRIGGER */}
          <BrutalistCard colorClass="bg-accent2/30 p-4 mb-6" variant="info">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <FontAwesome5 name="qrcode" size={20} color={colors.border} className="mr-2" />
                <Text className="text-border font-black text-lg uppercase">
                  {language === 'es' ? 'Pagar Cuenta con QR' : 'Pay Bill with QR'}
                </Text>
              </View>
              <View className="bg-primary px-2 py-0.5 border border-border">
                <Text className="text-background font-black text-[9px] uppercase">+20 HZ</Text>
              </View>
            </View>
            <Text className="text-border text-xs font-bold opacity-80 mb-4">
              {language === 'es'
                ? `Escanea con tu cámara o adjunta desde tus archivos el código QR de Solana Pay de ${place.name}.`
                : `Scan with camera or attach QR file from disk for ${place.name}.`}
            </Text>

            <Pressable
              onPress={() => setQrPanelVisible(true)}
              className="bg-primary p-3.5 border-4 border-border shadow-brutal-sm active:scale-95 flex-row items-center justify-center"
            >
              <FontAwesome5 name="qrcode" size={16} color="#FAF9F6" className="mr-2" />
              <Text className="text-background font-black text-sm uppercase">
                {language === 'es' ? 'ABRIR PANEL DE PAGO CON QR' : 'OPEN QR BILL PAYMENT PANEL'}
              </Text>
            </Pressable>
          </BrutalistCard>

          {/* Description Card */}
          <Text className="text-xl font-black text-border mb-2 uppercase">
            {language === 'es' ? 'Acerca del Establecimiento' : 'About Us'}
          </Text>
          <Text className="text-border text-base leading-relaxed mb-6 font-bold bg-secondary/20 p-4 border-2 border-border">
            {place.description}
          </Text>

          {/* 🍔 MENU SECTION - DIRECT SOLANA COMMERCIAL PURCHASES */}
          {place.menu && place.menu.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <FontAwesome5 name="utensils" size={20} color={colors.primary} className="mr-2" />
                <Text className="text-2xl font-black text-border uppercase">
                  {language === 'es' ? 'Menú & Especialidades' : 'Menu & Specialties'}
                </Text>
              </View>

              {place.menu.map((item: any) => {
                const solCost = Math.max(0.005, Number((item.priceMXN * 0.0003).toFixed(4)));
                return (
                  <BrutalistCard key={item.id} colorClass="bg-background mb-4 p-4" variant="info">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center mb-1">
                          <Text className="text-border font-black text-lg uppercase mr-2">{item.name}</Text>
                          {item.isPopular && (
                            <View className="bg-accent1 px-2 py-0.5 border border-border">
                              <Text className="text-background font-black text-[9px] uppercase">TOP</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-border text-xs font-bold opacity-80">{item.description}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-border font-black text-lg">${item.priceMXN} MXN</Text>
                        <Text className="text-border font-bold text-xs opacity-75">≈ {solCost} SOL</Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between items-center mt-3 pt-3 border-t-2 border-border">
                      <View className="bg-accent2/40 px-2 py-1 border border-border flex-row items-center">
                        <FontAwesome5 name="gift" size={12} color={colors.border} className="mr-1" />
                        <Text className="text-border font-black text-xs uppercase">
                          Recompensa: +15 HZ
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => handleOrderMenuItem(item)}
                        disabled={paymentLoading}
                        className="bg-primary px-4 py-2 border-2 border-border shadow-brutal-sm active:scale-95 flex-row items-center"
                      >
                        <FontAwesome5 name="wallet" size={12} color="#FAF9F6" className="mr-1.5" />
                        <Text className="text-background font-black text-xs uppercase">
                          {paymentLoading && selectedMenuItem?.id === item.id
                            ? (language === 'es' ? 'PROCESANDO...' : 'PAYING...')
                            : (language === 'es' ? `PAGAR (${solCost} SOL)` : `PAY (${solCost} SOL)`)}
                        </Text>
                      </Pressable>
                    </View>
                  </BrutalistCard>
                );
              })}
            </View>
          )}

          {/* 📅 TABLE RESERVATION SECTION */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <FontAwesome5 name="calendar-alt" size={20} color={colors.primary} className="mr-2" />
              <Text className="text-2xl font-black text-border uppercase">
                {language === 'es' ? 'Reservar Mesa en Restaurante' : 'Book Restaurant Table'}
              </Text>
            </View>

            <BrutalistCard colorClass="bg-secondary/30 p-4" variant="info">
              <Text className="text-border font-black text-sm uppercase mb-2">
                {language === 'es' ? 'Número de Personas:' : 'Number of Guests:'}
              </Text>

              <View className="flex-row justify-between items-center bg-background border-2 border-border p-3 mb-4">
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-10 h-10 bg-primary border-2 border-border justify-center items-center active:scale-95"
                  >
                    <FontAwesome5 name="minus" size={14} color="#FAF9F6" />
                  </Pressable>
                  <Text className="text-border font-black text-xl mx-4">{guestCount}</Text>
                  <Pressable
                    onPress={() => setGuestCount(guestCount + 1)}
                    className="w-10 h-10 bg-primary border-2 border-border justify-center items-center active:scale-95"
                  >
                    <FontAwesome5 name="plus" size={14} color="#FAF9F6" />
                  </Pressable>
                </View>

                <Text className="text-border font-bold text-xs uppercase">
                  {guestCount === 1 ? (language === 'es' ? '1 Persona' : '1 Person') : `${guestCount} ${language === 'es' ? 'Personas' : 'Guests'}`}
                </Text>
              </View>

              <BrutalistButton
                title={
                  reservationLoading
                    ? (language === 'es' ? 'PROCESANDO...' : 'PROCESSING...')
                    : (language === 'es' ? 'RESERVAR CON SOLANA (0.01 SOL)' : 'BOOK WITH SOLANA (0.01 SOL)')
                }
                colorClass="bg-primary"
                disabled={reservationLoading}
                onPress={handleConfirmReservation}
              />
            </BrutalistCard>
          </View>

          {/* Info Cards (Duration & Price) */}
          <View className="flex-row justify-between mb-6">
            <BrutalistCard colorClass="bg-background w-[48%] items-center py-4" variant="info">
              <View className="bg-primary/20 rounded-full p-3 border-2 border-border mb-2 shadow-brutal-sm">
                <FontAwesome5 name="clock" size={20} color={colors.primary} />
              </View>
              <Text className="text-border text-xs uppercase mb-1 font-bold">
                {language === 'es' ? 'Permanencia' : 'Duration'}
              </Text>
              <Text className="text-border font-black">{place.duration || '1 hora'}</Text>
            </BrutalistCard>

            <BrutalistCard colorClass="bg-background w-[48%] items-center py-4" variant="info">
              <View className="bg-accent2/20 rounded-full p-3 border-2 border-border mb-2 shadow-brutal-sm">
                <FontAwesome5 name="tag" size={20} color={colors.border} />
              </View>
              <Text className="text-border text-xs uppercase mb-1 font-bold">
                {language === 'es' ? 'Acceso / Consumo' : 'Price'}
              </Text>
              <Text className="text-border font-black">{place.price || 'Variable'}</Text>
            </BrutalistCard>
          </View>

          {/* Location & Address */}
          <PlaceMapboxMinimap
            placeName={place.name}
            coords={[place.coordinates.longitude, place.coordinates.latitude]}
            address={place.address}
            category={place.category}
            type={place.type}
          />

        </View>
      </ScrollView>

      {/* Multi-Step Dedicated QR Bill Payment Panel Modal */}
      <QrPaymentPanelModal
        visible={qrPanelVisible}
        businessName={place.name}
        defaultAmountSol={0.035}
        onClose={() => setQrPanelVisible(false)}
      />

      {/* No Wallet Connected Modal */}
      <Modal visible={noWalletModalVisible} transparent animationType="slide" onRequestClose={() => setNoWalletModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
              <Text className="text-background font-black text-xl uppercase">
                {language === 'es' ? 'Conectar Monedero' : 'Connect Wallet'}
              </Text>
              <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setNoWalletModalVisible(false)} />
            </View>

            <View className="p-6 items-center">
              <View className="w-16 h-16 bg-secondary border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                <FontAwesome5 name="wallet" size={28} color={colors.border} />
              </View>

              <Text className="text-border font-black text-lg text-center uppercase mb-2">
                {language === 'es' ? 'Pago en Solana' : 'Solana Payment'}
              </Text>
              <Text className="text-border text-xs font-bold text-center mb-6 leading-relaxed">
                {language === 'es'
                  ? `Para comprar en ${place.name} pagando directamente con Solana, necesitas conectar tu monedero o realizar una prueba simulada.`
                  : `To buy directly with Solana, connect your wallet or execute a test simulation.`}
              </Text>

              <View className="w-full mb-3">
                <BrutalistButton
                  title={language === 'es' ? 'CONECTAR EN PASAPORTE' : 'CONNECT IN PASSPORT'}
                  colorClass="bg-accent2"
                  onPress={() => {
                    setNoWalletModalVisible(false);
                    router.push('/(tabs)/passport');
                  }}
                />
              </View>

              <View className="w-full">
                <BrutalistButton
                  title={language === 'es' ? 'PROBAR PAGO SIMULADO' : 'TRY SIMULATED PAY'}
                  colorClass="bg-primary"
                  onPress={() => {
                    setNoWalletModalVisible(false);
                    executePayment(true);
                  }}
                />
              </View>
            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Commercial Solana Payment Confirmation Modal */}
      <Modal visible={paymentModalVisible} transparent animationType="slide" onRequestClose={() => setPaymentModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className={`p-4 border-b-4 border-border flex-row justify-between items-center ${paymentSuccess ? 'bg-accent2' : 'bg-primary'}`}>
              <Text className="text-border font-black text-xl uppercase">
                {paymentSuccess ? (language === 'es' ? '¡Pago Confirmado!' : 'Payment Confirmed!') : (language === 'es' ? 'Error en Pago' : 'Payment Failed')}
              </Text>
              <FontAwesome5 name={paymentSuccess ? 'check-circle' : 'exclamation-circle'} size={24} color={colors.border} />
            </View>

            <View className="p-6 items-center">
              {paymentSuccess ? (
                <View className="items-center">
                  <View className="w-16 h-16 bg-accent2 border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                    <FontAwesome5 name="receipt" size={28} color={colors.border} />
                  </View>
                  <Text className="text-border font-black text-lg text-center uppercase mb-1">
                    {selectedMenuItem?.name}
                  </Text>
                  <Text className="text-border text-xs font-bold text-center opacity-80 uppercase mb-4">
                    ${selectedMenuItem?.priceMXN} MXN (Solana Devnet)
                  </Text>
                  <Text className="text-border text-sm font-bold text-center mb-4 leading-relaxed">
                    {language === 'es'
                      ? `Se ha procesado tu compra en Solana. Muestra este recibo digital en el mostrador de ${place.name}.`
                      : `Your purchase was confirmed on Solana. Show this receipt at ${place.name}.`}
                  </Text>
                  <View className="bg-accent2/30 p-3 border-2 border-border w-full mb-6 flex-row justify-between items-center">
                    <Text className="text-border font-black text-xs uppercase">Bono Ganado:</Text>
                    <Text className="text-border font-black text-sm">+15 Puntos HZ</Text>
                  </View>
                  <BrutalistButton title={t('common.okay')} colorClass="bg-accent1" onPress={() => setPaymentModalVisible(false)} />
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-border text-sm font-bold text-center mb-6">
                    {paymentError || (language === 'es'
                      ? 'No se pudo completar la transacción en el monedero.'
                      : 'Could not complete wallet transaction.')}
                  </Text>
                  <BrutalistButton title={t('common.close')} colorClass="bg-primary" onPress={() => setPaymentModalVisible(false)} />
                </View>
              )}
            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Reservation Confirmation Modal */}
      <Modal visible={reservationModalVisible} transparent animationType="slide" onRequestClose={() => setReservationModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
              <Text className="text-background font-black text-xl uppercase">
                {language === 'es' ? '¡Reservación Confirmada!' : 'Reservation Confirmed!'}
              </Text>
              <FontAwesome5 name="check-circle" size={24} color="#FAF9F6" />
            </View>

            <View className="p-6 items-center">
              <View className="w-16 h-16 bg-accent2 border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                <FontAwesome5 name="calendar-check" size={28} color={colors.border} />
              </View>

              <Text className="text-border font-black text-xl text-center uppercase mb-1">{place.name}</Text>
              <Text className="text-border font-bold text-sm text-center mb-4">{place.address}</Text>

              <View className="bg-secondary/30 p-4 border-2 border-border w-full mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-border font-bold text-xs uppercase">Reservado para:</Text>
                  <Text className="text-border font-black text-xs uppercase">{guestCount} {guestCount === 1 ? 'Persona' : 'Personas'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-border font-bold text-xs uppercase">Depósito de Garantía:</Text>
                  <Text className="text-accent2 font-black text-xs uppercase">0.01 SOL (Confirmado)</Text>
                </View>
              </View>

              <View className="bg-accent2/30 p-3 border-2 border-border w-full mb-6 flex-row justify-between items-center">
                <Text className="text-border font-black text-xs uppercase">Bono de Reservación:</Text>
                <Text className="text-border font-black text-sm">+20 Puntos HZ</Text>
              </View>

              <BrutalistButton title={t('common.okay')} colorClass="bg-accent1" onPress={() => setReservationModalVisible(false)} />
            </View>
          </BrutalistCard>
        </View>
      </Modal>

    </View>
  );
}
