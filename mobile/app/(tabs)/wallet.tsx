import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MOCK_USER } from '@/mocks/db';
import { useAuth } from '@/components/auth/auth-provider';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function WalletScreen() {
  const { isAuthenticated, signIn, signOut, user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-black text-border mb-6 uppercase tracking-tight">Mi Billetera</Text>
      
      {/* Wallet Connection */}
      <BrutalistCard colorClass="bg-accent2 mb-6">
        <Text className="text-border font-black uppercase mb-2 text-xl">Identidad Web3</Text>
        {isAuthenticated ? (
          <View>
            <View className="bg-background border-4 border-border p-3 mb-4 shadow-brutal-sm flex-row items-center">
               <FontAwesome5 name="wallet" size={16} color={colors.border} />
               <Text className="text-border font-bold text-sm ml-3" numberOfLines={1} ellipsizeMode="middle">
                 {user?.pubkey || MOCK_USER.publicKey}
               </Text>
            </View>
            <BrutalistButton title="Desconectar" colorClass="bg-primary" onPress={signOut} />
          </View>
        ) : (
          <View>
            <Text className="text-border font-bold text-sm mb-4 leading-5">
              Conecta tu billetera Solana (ej. Phantom) para pagar y recibir beneficios de turismo.
            </Text>
            <BrutalistButton title="Conectar Billetera" colorClass="bg-background" onPress={signIn} />
          </View>
        )}
      </BrutalistCard>

      <BrutalistCard colorClass="bg-accent1 mb-6 items-center py-8">
        <Text className="text-border font-bold uppercase mb-2 text-center">Fondo de Explorador</Text>
        <View className="flex-row items-center bg-background border-4 border-border px-6 py-2 shadow-brutal">
           <Text className="text-5xl font-black text-border">{MOCK_USER.balanceHuellazos}</Text>
        </View>
        <Text className="text-background font-black uppercase tracking-widest mt-3 text-xl">$HUELLAZOS</Text>
        <Text className="text-border text-xs text-center mt-4 px-4 font-bold bg-background/50 py-2">
          * Puntos canjeables por descuentos. Pagos reales procesados en SOL.
        </Text>
      </BrutalistCard>

      <Text className="text-xl font-bold text-border mb-4 uppercase">Acciones Rápidas</Text>
      <View className="flex-row justify-between mb-8">
        <View className="w-[48%]">
          <BrutalistButton title="Enviar" colorClass="bg-primary" />
        </View>
        <View className="w-[48%]">
          <BrutalistButton title="Recibir" colorClass="bg-secondary" />
        </View>
      </View>

      <Text className="text-xl font-bold text-border mb-4 uppercase">Historial (Blinks)</Text>
      
      {/* Transaction Item - Expense */}
      <View className="bg-background border-4 border-border mb-4 p-0 shadow-brutal overflow-hidden flex-row">
        <View className="bg-primary w-16 justify-center items-center border-r-4 border-border">
           <FontAwesome5 name="arrow-up" size={24} color={colors.border} />
        </View>
        <View className="flex-1 p-3 flex-row justify-between items-center">
          <View>
            <Text className="text-border font-bold uppercase text-lg">Don Porfirio Cafe</Text>
            <Text className="text-border text-xs font-bold opacity-70">Solana Pay - 12 May</Text>
          </View>
          <Text className="text-primary font-black text-xl">-150</Text>
        </View>
      </View>
      
      {/* Transaction Item - Income */}
      <View className="bg-background border-4 border-border mb-8 p-0 shadow-brutal overflow-hidden flex-row">
        <View className="bg-accent2 w-16 justify-center items-center border-r-4 border-border">
           <FontAwesome5 name="arrow-down" size={24} color={colors.border} />
        </View>
        <View className="flex-1 p-3 flex-row justify-between items-center">
          <View>
            <Text className="text-border font-bold uppercase text-lg">Templo Mayor</Text>
            <Text className="text-border text-xs font-bold opacity-70">Recompensa QR - 10 May</Text>
          </View>
          <Text className="text-accent2 font-black text-xl">+50</Text>
        </View>
      </View>

    </ScrollView>
  );
}
