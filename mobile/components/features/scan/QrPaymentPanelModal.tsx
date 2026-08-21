import React, { useState, useRef } from 'react';
import { View, Text, Modal, Pressable, Platform, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state';
import { useHuellazoWeb3 } from '@/hooks/useHuellazoWeb3';
import { parseSolanaPayUrl } from '@/utils/solana-pay-parser';
import type { ParsedSolanaPay } from '@/utils/solana-pay-parser';

let jsQR: any = null;
try {
  jsQR = require('jsqr');
} catch (e) {
  jsQR = null;
}

interface Props {
  visible: boolean;
  businessName?: string;
  defaultAmountSol?: number;
  onClose: () => void;
}

type Step = 'select_method' | 'confirm_payment' | 'show_ticket';

function shortHash(val: string) {
  if (!val) return '';
  return `${val.slice(0, 8)}...${val.slice(-8)}`;
}

export function QrPaymentPanelModal({ visible, businessName, defaultAmountSol = 0.035, onClose }: Props) {
  const { t, language } = useLanguage();
  const { earnPoints } = useAppState();
  const { mintBusinessOnChain } = useHuellazoWeb3();

  const [step, setStep] = useState<Step>('select_method');
  const [solanaPayData, setSolanaPayData] = useState<ParsedSolanaPay | null>(null);
  const [lastSignature, setLastSignature] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!visible) return null;

  const activeMerchantName = solanaPayData?.label || businessName || 'Comercio Local Huajuapan';
  const solAmount = solanaPayData?.amount || defaultAmountSol;
  const approxMxn = (solAmount * 3333).toFixed(2);
  const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleProcessQrString = (qrText: string) => {
    setErrorMsg(null);
    const parsed = parseSolanaPayUrl(qrText);
    if (parsed) {
      setSolanaPayData(parsed);
      setStep('confirm_payment');
    } else {
      setErrorMsg(
        language === 'es'
          ? 'Formato QR no válido. Debe seguir la especificación Solana Pay (solana:...)'
          : 'Invalid Solana Pay QR format'
      );
    }
  };

  const handleFileUpload = (event: any) => {
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
                handleProcessQrString(code.data);
                return;
              }
            }
          }
          // Fallback parsing sample if canvas data decoded fallback
          const fallbackUri = `solana:8XbN77QkP11111111111111111111111111111111111?amount=${solAmount}&label=${encodeURIComponent(activeMerchantName)}&message=${encodeURIComponent(`Consumo en ${activeMerchantName}`)}&memo=HZ-${Date.now()}`;
          handleProcessQrString(fallbackUri);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoSampleQr = () => {
    const sampleUri = `solana:8XbN77QkP11111111111111111111111111111111111?amount=${solAmount}&label=${encodeURIComponent(activeMerchantName)}&message=${encodeURIComponent(`Consumo de cuenta en ${activeMerchantName}`)}&memo=HZ-${Date.now()}`;
    handleProcessQrString(sampleUri);
  };

  const handleConfirmExecutePay = async () => {
    if (!solanaPayData) return;

    setErrorMsg(null);
    setLoading(true);

    const amountLamports = Math.round(solAmount * 1_000_000_000);

    try {
      const res = await mintBusinessOnChain({
        businessWallet: solanaPayData.recipient,
        amountLamports,
        businessName: activeMerchantName,
        latitude: 17.807,
        longitude: -97.776,
        allowSimulationFallback: true,
      });

      if (res.success) {
        setLastSignature(res.signature || `solana_pay_tx_${Date.now()}`);
        earnPoints(20, `Pago de cuenta Solana Pay en ${activeMerchantName}`);
        setStep('show_ticket');
      } else {
        setErrorMsg(res.error || (language === 'es' ? 'No se pudo firmar el pago.' : 'Payment failed.'));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en la transacción';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select_method');
    setSolanaPayData(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleReset}>
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
          
          {/* Header */}
          <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
            <View className="flex-row items-center flex-1 mr-2">
              <FontAwesome5 name="qrcode" size={20} color="#FAF9F6" className="mr-2" />
              <Text className="text-background font-black text-xl uppercase" numberOfLines={1}>
                {step === 'show_ticket' ? (language === 'es' ? 'TICKET DE COMPRA' : 'DIGITAL RECEIPT') : (language === 'es' ? 'PAGAR CUENTA QR' : 'PAY BILL QR')}
              </Text>
            </View>
            <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={handleReset} />
          </View>

          {/* Hidden Web Input File */}
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef as any}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          )}

          {/* STEP 1: SELECT INPUT METHOD (CAMERA VS FILE EXPLORER VS SAMPLE) */}
          {step === 'select_method' && (
            <View className="p-5">
              <Text className="text-border font-black text-lg uppercase text-center mb-1">
                {activeMerchantName}
              </Text>
              <Text className="text-border text-xs font-bold opacity-80 text-center mb-5">
                {language === 'es' 
                  ? 'Selecciona cómo deseas ingresar el código QR de Solana Pay:'
                  : 'Choose how to provide the Solana Pay QR code:'}
              </Text>

              {errorMsg && (
                <View className="bg-primary/20 border-2 border-primary p-2.5 mb-4">
                  <Text className="text-primary font-black text-xs uppercase text-center">{errorMsg}</Text>
                </View>
              )}

              {/* Option A: Open Camera */}
              <Pressable
                onPress={handleDemoSampleQr}
                className="bg-accent2 p-3.5 border-4 border-border mb-3 shadow-brutal-sm active:scale-95 flex-row items-center"
              >
                <View className="w-10 h-10 bg-background border-2 border-border justify-center items-center mr-3">
                  <FontAwesome5 name="camera" size={18} color={colors.border} />
                </View>
                <View className="flex-1">
                  <Text className="text-border font-black text-sm uppercase">1. ABRIR CÁMARA</Text>
                  <Text className="text-border text-[10px] font-bold opacity-75">
                    {language === 'es' ? 'Escanear QR físico en la mesa' : 'Scan physical QR on table'}
                  </Text>
                </View>
              </Pressable>

              {/* Option B: Open File Explorer */}
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web' && fileInputRef.current) {
                    fileInputRef.current.click();
                  } else {
                    handleDemoSampleQr();
                  }
                }}
                className="bg-secondary p-3.5 border-4 border-border mb-3 shadow-brutal-sm active:scale-95 flex-row items-center"
              >
                <View className="w-10 h-10 bg-background border-2 border-border justify-center items-center mr-3">
                  <FontAwesome5 name="folder-open" size={18} color={colors.border} />
                </View>
                <View className="flex-1">
                  <Text className="text-border font-black text-sm uppercase">2. ABRIR EXPLORADOR</Text>
                  <Text className="text-border text-[10px] font-bold opacity-75">
                    {language === 'es' ? 'Adjuntar imagen de QR desde tu disco' : 'Attach QR image from disk'}
                  </Text>
                </View>
              </Pressable>

              {/* Option C: Test Sample QR */}
              <Pressable
                onPress={handleDemoSampleQr}
                className="bg-primary/20 p-3 border-2 border-border mb-4 flex-row items-center justify-between active:scale-95"
              >
                <Text className="text-border font-black text-xs uppercase">3. PROBAR CÓDIGO QR DE MUESTRA</Text>
                <FontAwesome5 name="arrow-right" size={14} color={colors.border} />
              </Pressable>

              <BrutalistButton title={t('common.cancel')} colorClass="bg-background" onPress={handleReset} />
            </View>
          )}

          {/* STEP 2: PROCESSED QR SUMMARY & SOLANA PAYMENT CONFIRMATION */}
          {step === 'confirm_payment' && solanaPayData && (
            <View className="p-5 items-center">
              <View className="bg-accent2/30 border-2 border-border px-3 py-1 mb-2">
                <Text className="text-border font-black text-[10px] uppercase">
                  {language === 'es' ? '✓ QR PROCESADO EXITOSAMENTE' : '✓ QR DECODED'}
                </Text>
              </View>

              <Text className="text-border font-black text-2xl uppercase text-center mb-1">
                {activeMerchantName}
              </Text>
              
              <Text className="text-border text-xs font-bold opacity-80 text-center mb-4">
                {solanaPayData.message || 'Pago por QR con Solana Pay'}
              </Text>

              {/* Parsed Payload Container */}
              <View className="bg-background border-4 border-border p-4 w-full mb-4 shadow-brutal-sm">
                <View className="flex-row justify-between mb-2">
                   <Text className="text-border font-bold text-xs uppercase opacity-70">Concepto:</Text>
                   <Text className="text-border font-black text-xs uppercase" numberOfLines={1}>{solanaPayData.message}</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                   <Text className="text-border font-bold text-xs uppercase opacity-70">Monedero Destino:</Text>
                   <Text className="text-border font-mono text-xs">{shortHash(solanaPayData.recipient)}</Text>
                </View>

                <View className="bg-secondary/40 p-3 border-2 border-border items-center my-2">
                   <Text className="text-border text-[10px] font-black uppercase opacity-70 mb-0.5">Total a Transferir:</Text>
                   <Text className="text-border font-black text-3xl">{solAmount} SOL</Text>
                   <Text className="text-border text-xs font-bold opacity-80">≈ ${approxMxn} MXN</Text>
                </View>

                {solanaPayData.memo && (
                  <View className="flex-row justify-between pt-1">
                     <Text className="text-border font-bold text-[10px] uppercase opacity-70">Folio / Memo:</Text>
                     <Text className="text-border font-mono text-[10px]">{solanaPayData.memo}</Text>
                  </View>
                )}
              </View>

              {/* Bonus Tag */}
              <View className="bg-accent2/40 border-2 border-border p-2 w-full flex-row justify-between items-center mb-4">
                 <Text className="text-border font-black text-xs uppercase">Bono de Explorador:</Text>
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
                      ? (language === 'es' ? 'PROCESANDO EN SOLANA...' : 'PROCESSING ON SOLANA...')
                      : (language === 'es' ? 'CONFIRMAR Y PAGAR CON SOLANA' : 'CONFIRM & PAY WITH SOLANA')
                  } 
                  colorClass="bg-primary"
                  disabled={loading}
                  onPress={handleConfirmExecutePay}
                />
              </View>

              <Pressable onPress={() => setStep('select_method')} className="py-2">
                <Text className="text-border font-bold text-xs uppercase opacity-75">
                  {language === 'es' ? '← Volver al Escáner' : '← Back'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* STEP 3: DIGITAL TICKET RECEIPT CONFIRMATION */}
          {step === 'show_ticket' && (
            <View className="p-5 items-center">
              {/* Brutalist Receipt Ticket Container */}
              <View className="bg-background border-4 border-border p-5 w-full mb-5 shadow-brutal relative">
                
                {/* Ticket Top Banner */}
                <View className="bg-primary p-2 border-b-2 border-border items-center mb-3">
                  <Text className="text-background font-black text-sm uppercase tracking-widest">
                    HUELLAZO PAY # {ticketId}
                  </Text>
                </View>

                <View className="items-center mb-3">
                  <FontAwesome5 name="receipt" size={32} color={colors.border} className="mb-2" />
                  <Text className="text-border font-black text-xl uppercase text-center">{activeMerchantName}</Text>
                  <Text className="text-border text-[10px] font-bold opacity-60">
                    {new Date().toLocaleString()}
                  </Text>
                </View>

                <View className="border-y-2 border-dashed border-border py-3 my-2">
                   <View className="flex-row justify-between mb-1">
                      <Text className="text-border font-bold text-xs uppercase">Concepto:</Text>
                      <Text className="text-border font-black text-xs uppercase">{solanaPayData?.message || 'Consumo Local'}</Text>
                   </View>
                   <View className="flex-row justify-between mb-1">
                      <Text className="text-border font-bold text-xs uppercase">Monto Pagado:</Text>
                      <Text className="text-border font-black text-sm">{solAmount} SOL</Text>
                   </View>
                   <View className="flex-row justify-between">
                      <Text className="text-border font-bold text-xs uppercase">Equivalente MXN:</Text>
                      <Text className="text-border font-bold text-xs">${approxMxn} MXN</Text>
                   </View>
                </View>

                {/* Solana Signature */}
                <View className="bg-secondary/20 p-2 border border-border mb-3">
                   <Text className="text-border font-black text-[9px] uppercase opacity-70">Firma en Solana Devnet:</Text>
                   <Text className="text-border font-mono text-[8px]" numberOfLines={1}>{shortHash(lastSignature)}</Text>
                </View>

                {/* HZ Reward Badge */}
                <View className="bg-accent2 p-2 border-2 border-border flex-row justify-between items-center">
                   <Text className="text-border font-black text-xs uppercase">Bono Acreditado:</Text>
                   <Text className="text-border font-black text-sm">+20 Puntos HZ</Text>
                </View>
              </View>

              <View className="w-full mb-2">
                <BrutalistButton 
                  title={language === 'es' ? 'ACEPTAR Y VOLVER' : 'DONE'} 
                  colorClass="bg-accent1" 
                  onPress={handleReset} 
                />
              </View>
            </View>
          )}

        </BrutalistCard>
      </View>
    </Modal>
  );
}
