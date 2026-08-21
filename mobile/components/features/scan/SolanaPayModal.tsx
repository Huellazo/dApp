import React, { useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state';
import { useHuellazoWeb3 } from '@/hooks/useHuellazoWeb3';
import type { ParsedSolanaPay } from '@/utils/solana-pay-parser';

interface Props {
  visible: boolean;
  solanaPayData: ParsedSolanaPay | null;
  onClose: () => void;
}

export function SolanaPayModal({ visible, solanaPayData, onClose }: Props) {
  const { t, language } = useLanguage();
  const { earnPoints } = useAppState();
  const { mintBusinessOnChain, walletAddress } = useHuellazoWeb3();

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!solanaPayData) return null;

  const solAmount = solanaPayData.amount || 0.025;
  const approxMxn = (solAmount * 3333).toFixed(2); // ~1 SOL = 3,333 MXN approx

  const handleConfirmPay = async () => {
    setErrorMsg(null);
    setLoading(true);

    const amountLamports = Math.round(solAmount * 1_000_000_000);

    try {
      const res = await mintBusinessOnChain({
        businessWallet: solanaPayData.recipient,
        amountLamports,
        businessName: solanaPayData.label || 'Comercio Solana Pay',
        latitude: 17.807,
        longitude: -97.776,
        allowSimulationFallback: true,
      });

      if (res.success) {
        // Award explorer bonus of +20 Puntos Huellazos ($HZ)
        earnPoints(20, `Pago con Solana Pay en ${solanaPayData.label}`);
        setSuccessModal(true);
      } else {
        setErrorMsg(res.error || (language === 'es' ? 'Pago no completado' : 'Payment failed'));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el pago de Solana Pay';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setSuccessModal(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <>
      {/* Main Confirmation Modal */}
      <Modal visible={visible && !successModal} transparent animationType="slide" onRequestClose={onClose}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            
            {/* Header */}
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
              <View className="flex-row items-center">
                <FontAwesome5 name="qrcode" size={20} color="#FAF9F6" className="mr-2" />
                <Text className="text-background font-black text-xl uppercase">
                  Solana Pay
                </Text>
              </View>
              <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={onClose} />
            </View>

            <View className="p-5 items-center">
              
              <View className="w-16 h-16 bg-accent2 border-4 border-border rounded-full justify-center items-center mb-3 shadow-brutal-sm">
                <FontAwesome5 name="store" size={28} color={colors.border} />
              </View>

              <Text className="text-border font-black text-2xl uppercase text-center mb-1">
                {solanaPayData.label || 'Comercio Local'}
              </Text>
              
              <Text className="text-border text-xs font-bold opacity-80 text-center mb-4">
                {solanaPayData.message || 'Pago por QR con Solana Pay'}
              </Text>

              {/* Amount Display */}
              <View className="bg-secondary/40 border-4 border-border p-4 w-full items-center mb-4 shadow-brutal-sm">
                <Text className="text-border text-xs font-black uppercase opacity-75 mb-0.5">
                  {language === 'es' ? 'Monto a pagar:' : 'Total amount:'}
                </Text>
                <Text className="text-border font-black text-3xl my-0.5">
                  {solAmount} SOL
                </Text>
                <Text className="text-border text-xs font-bold opacity-80">
                  ≈ ${approxMxn} MXN
                </Text>
              </View>

              {/* Reward Bonus Banner */}
              <View className="bg-accent2/30 border-2 border-border p-2.5 w-full flex-row justify-between items-center mb-5">
                 <View className="flex-row items-center">
                    <FontAwesome5 name="gift" size={14} color={colors.border} className="mr-2" />
                    <Text className="text-border font-black text-xs uppercase">Bono de Explorador:</Text>
                 </View>
                 <Text className="text-border font-black text-xs">+20 Puntos HZ</Text>
              </View>

              {errorMsg && (
                <View className="bg-primary/20 border-2 border-primary p-2 w-full mb-4">
                  <Text className="text-primary font-black text-xs uppercase text-center">{errorMsg}</Text>
                </View>
              )}

              <View className="w-full mb-2">
                <BrutalistButton 
                  title={
                    loading 
                      ? (language === 'es' ? 'FIRMANDO TRANSACCIÓN...' : 'SIGNING...')
                      : (language === 'es' ? 'CONFIRMAR Y PAGAR CON SOLANA' : 'CONFIRM & PAY WITH SOLANA')
                  } 
                  colorClass="bg-primary"
                  disabled={loading}
                  onPress={handleConfirmPay}
                />
              </View>

              <Pressable onPress={onClose} className="py-2">
                <Text className="text-border font-bold text-xs uppercase opacity-75">{t('common.cancel')}</Text>
              </Pressable>

            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Success Receipt Modal */}
      <Modal visible={successModal} transparent animationType="fade" onRequestClose={handleCloseAll}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
             <View className="bg-accent2 p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">
                  {language === 'es' ? '¡Pago Exitoso!' : 'Payment Success!'}
                </Text>
                <FontAwesome5 name="check-circle" size={24} color={colors.border} />
             </View>

             <View className="p-6 items-center">
                <View className="w-16 h-16 bg-accent2 border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                   <FontAwesome5 name="receipt" size={28} color={colors.border} />
                </View>

                <Text className="text-border font-black text-2xl uppercase text-center mb-1">
                  {solanaPayData.label}
                </Text>
                
                <Text className="text-border font-bold text-sm text-center opacity-80 mb-4">
                  {solAmount} SOL (≈ ${approxMxn} MXN)
                </Text>

                <Text className="text-border text-xs font-bold text-center mb-6 leading-relaxed bg-secondary/30 p-3 border-2 border-border">
                  {language === 'es'
                    ? `Transacción de Solana Pay confirmada en Solana Devnet. Muestra esta pantalla al comercio.`
                    : `Solana Pay transaction confirmed on Solana Devnet. Show this receipt to merchant.`}
                </Text>

                <View className="bg-accent2/30 p-3 border-2 border-border w-full mb-6 flex-row justify-between items-center">
                  <Text className="text-border font-black text-xs uppercase">Bono Recibido:</Text>
                  <Text className="text-border font-black text-sm">+20 Puntos HZ</Text>
                </View>

                <BrutalistButton title={t('common.okay')} colorClass="bg-accent1" onPress={handleCloseAll} />
             </View>
          </BrutalistCard>
        </View>
      </Modal>
    </>
  );
}
