import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';
import { colors } from '@/theme/colors';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { burnTokens } = useAppState();
  
  const place = MOCK_POIS.find(p => p.id === id);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Reservation State
  const [guestCount, setGuestCount] = useState(2);
  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  if (!place) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-border font-black text-xl uppercase mb-4">Comercio no encontrado</Text>
        <BrutalistButton title={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  const handleOrderMenuItem = (item: any) => {
    setSelectedMenuItem(item);
    const discount = item.discountHZ || 10;
    const success = burnTokens(discount, `Compra en ${place.name}: ${item.name}`);
    setPaymentSuccess(success);
    setPaymentModalVisible(true);
  };

  const handleConfirmReservation = () => {
    setReservationConfirmed(true);
    setReservationModalVisible(true);
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
            className="absolute top-12 left-4 z-20 bg-background border-4 border-border shadow-brutal-sm p-3 rounded-none active:scale-95"
          >
            <FontAwesome5 name="arrow-left" size={20} color={colors.border} />
          </Pressable>

          <View className="absolute top-12 right-4 z-20 bg-primary border-4 border-border shadow-brutal-sm px-3 py-2">
            <Text className="text-background font-black text-xs uppercase">+{place.reward} HZ</Text>
          </View>
        </View>

        <View className="p-4 mt-2">
          {/* Main Title Brutalist Style */}
          <View className="bg-primary border-4 border-border shadow-brutal p-4 mb-6 -mt-10 mx-2 z-30">
            <Text className="text-2xl font-black text-background uppercase tracking-tight text-center">
              {place.name}
            </Text>
            <Text className="text-background text-xs font-bold text-center mt-1 uppercase opacity-90">
              {place.type}
            </Text>
          </View>
          
          {/* Features / Categories with Checkmarks */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
             {place.features?.map(feature => (
               <View key={feature} className="bg-background border-2 border-border shadow-brutal-sm rounded-full px-4 py-1.5 mr-3 flex-row items-center">
                 <FontAwesome5 name="check-circle" solid size={14} color={colors.primary} />
                 <Text className="text-border font-bold uppercase ml-2 text-xs">{feature}</Text>
               </View>
             ))}
          </ScrollView>

          {/* Description */}
          <Text className="text-xl font-black text-border mb-2 uppercase">
            {language === 'es' ? 'Acerca del Establecimiento' : 'About Us'}
          </Text>
          <Text className="text-border text-base leading-relaxed mb-6 font-bold bg-secondary/20 p-4 border-2 border-border">
            {place.description}
          </Text>

          {/* 🍔 MENU SECTION FOR RESTAURANTS & CAFES */}
          {place.menu && place.menu.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <FontAwesome5 name="utensils" size={20} color={colors.primary} className="mr-2" />
                <Text className="text-2xl font-black text-border uppercase">
                  {language === 'es' ? 'Menú & Especialidades' : 'Menu & Specialties'}
                </Text>
              </View>

              {place.menu.map((item: any) => (
                <BrutalistCard key={item.id} colorClass="bg-background p-4 mb-4" variant="info">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <View className="flex-row items-center">
                        <Text className="text-border font-black text-base uppercase">{item.name}</Text>
                        {item.isPopular && (
                          <View className="bg-accent1 px-2 py-0.5 border border-border ml-2">
                            <Text className="text-background font-black text-[8px] uppercase">POPULAR</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-border text-xs font-bold mt-1 opacity-80">{item.description}</Text>
                    </View>
                    <Text className="text-border font-black text-lg">${item.priceMXN} MXN</Text>
                  </View>

                  {/* Payment with HZ Action */}
                  <View className="mt-3 pt-3 border-t-2 border-dashed border-border/40 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <FontAwesome5 name="coins" size={14} color={colors.primary} />
                      <Text className="text-border font-bold text-xs ml-1">
                        -{item.discountHZ || 10} HZ {language === 'es' ? 'de descuento' : 'discount'}
                      </Text>
                    </View>

                    <Pressable 
                      onPress={() => handleOrderMenuItem(item)}
                      className="bg-accent2 border-2 border-border px-3 py-1.5 shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Text className="text-background font-black text-xs uppercase">
                        {language === 'es' ? 'Pagar con HZ' : 'Pay with HZ'}
                      </Text>
                    </Pressable>
                  </View>
                </BrutalistCard>
              ))}
            </View>
          )}

          {/* 📅 TABLE & EXPERIENCE RESERVATION SECTION */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <FontAwesome5 name="calendar-alt" size={20} color={colors.primary} className="mr-2" />
              <Text className="text-2xl font-black text-border uppercase">
                {language === 'es' ? 'Reservar Mesa / Visita' : 'Book Table / Visit'}
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
                title={language === 'es' ? 'CONFIRMAR RESERVACIÓN' : 'CONFIRM RESERVATION'} 
                colorClass="bg-primary"
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
                {language === 'es' ? 'Rango de Precios' : 'Price Range'}
              </Text>
              <Text className="text-border font-black">{place.price || 'Variado'}</Text>
            </BrutalistCard>
          </View>

          {/* Location / Address */}
          <Text className="text-xl font-black text-border mb-2 uppercase">
            {language === 'es' ? 'Ubicación en Huajuapan' : 'Location in Huajuapan'}
          </Text>
          <View className="bg-secondary/30 border-2 border-border p-3 mb-4">
             <Text className="text-border font-bold text-sm">{place.address}</Text>
          </View>

        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t-4 border-border p-4 pb-8 flex-row items-center justify-between z-10"
        style={{
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 8,
        }}
      >
        <View>
          <Text className="text-border font-bold uppercase text-xs">
            {language === 'es' ? 'Recompensa de Visita' : 'Visit Reward'}
          </Text>
          <Text className="text-primary font-black text-2xl">+{place.reward} HZ</Text>
        </View>
        <BrutalistButton 
          title={language === 'es' ? 'ESCANEAR QR DE LUGAR' : 'SCAN PLACE QR'} 
          colorClass="bg-accent2" 
          onPress={() => {
            router.push('/(tabs)/scan');
          }}
        />
      </View>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             <View className={`${paymentSuccess ? 'bg-accent2' : 'bg-primary'} p-4 border-b-4 border-border flex-row justify-between items-center`}>
                <Text className="text-background font-black text-xl uppercase">
                  {paymentSuccess ? (language === 'es' ? '¡Descuento Aplicado!' : 'Discount Applied!') : (language === 'es' ? 'Saldo Insuficiente' : 'Insufficient Points')}
                </Text>
                <FontAwesome5 name={paymentSuccess ? 'receipt' : 'exclamation-circle'} size={24} color="#FAF9F6" />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-base mb-6 font-bold text-center">
                  {paymentSuccess 
                    ? (language === 'es'
                        ? `Has canjeado ${selectedMenuItem?.discountHZ || 10} $HUELLAZOS para pagar "${selectedMenuItem?.name}" en ${place.name}.`
                        : `Successfully spent ${selectedMenuItem?.discountHZ || 10} $HUELLAZOS for "${selectedMenuItem?.name}" at ${place.name}.`)
                    : (language === 'es'
                        ? `No tienes suficientes $HUELLAZOS acumulados. ¡Explora Huajuapan para ganar más!`
                        : `You don't have enough $HUELLAZOS. Keep exploring to earn more!`)}
                </Text>

                <BrutalistButton 
                  title={t('common.okay')} 
                  colorClass="bg-primary" 
                  onPress={() => setPaymentModalVisible(false)} 
                />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Reservation Confirmation Modal */}
      <Modal
        visible={reservationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReservationModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-background font-black text-xl uppercase">
                  {language === 'es' ? '¡Reservación Confirmada!' : 'Reservation Confirmed!'}
                </Text>
                <FontAwesome5 name="check-circle" size={24} color="#FAF9F6" />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-base mb-6 font-bold text-center">
                  {language === 'es'
                    ? `Tu reservación para ${guestCount} personas en "${place.name}" ha sido registrada con éxito.`
                    : `Your reservation for ${guestCount} guests at "${place.name}" has been registered successfully.`}
                </Text>

                <BrutalistButton 
                  title={t('common.okay')} 
                  colorClass="bg-accent2" 
                  onPress={() => setReservationModalVisible(false)} 
                />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

    </View>
  );
}
