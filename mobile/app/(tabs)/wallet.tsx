import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MOCK_USER } from '@/mocks/db';
import { useAuth } from '@/components/auth/auth-provider';

export default function WalletScreen() {
  const { isAuthenticated, signIn, signOut, user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-bold text-border mb-6 uppercase tracking-tight">Wallet</Text>
      
      {/* Wallet Connection */}
      <BrutalistCard colorClass="bg-secondary mb-6">
        <Text className="text-border font-bold uppercase mb-2">Web3 Identity</Text>
        {isAuthenticated ? (
          <View>
            <Text className="text-border text-sm mb-4" numberOfLines={1} ellipsizeMode="middle">
              Connected: {user?.pubkey || MOCK_USER.publicKey}
            </Text>
            <BrutalistButton title="Disconnect Wallet" colorClass="bg-primary" onPress={signOut} />
          </View>
        ) : (
          <View>
            <Text className="text-border text-sm mb-4">
              Connect your Solana wallet (e.g. Phantom) to pay and receive benefits.
            </Text>
            <BrutalistButton title="Connect Wallet" colorClass="bg-accent2" onPress={signIn} />
          </View>
        )}
      </BrutalistCard>

      <BrutalistCard title="Balance" colorClass="bg-accent1 mb-6 items-center py-8">
        <Text className="text-5xl font-black text-border mb-2">{MOCK_USER.balanceHuellazos}</Text>
        <Text className="text-border font-bold uppercase tracking-widest">$HUELLAZOS</Text>
        <Text className="text-border text-xs text-center mt-2 px-4 font-bold">
          * Redeemable points for discounts and benefits. Real payments are made in SOL.
        </Text>
      </BrutalistCard>

      <Text className="text-xl font-bold text-border mb-4 uppercase">Quick Actions</Text>
      <View className="flex-row justify-between mb-8">
        <View className="w-[48%]">
          <BrutalistButton title="Send" colorClass="bg-primary" />
        </View>
        <View className="w-[48%]">
          <BrutalistButton title="Receive" colorClass="bg-secondary" />
        </View>
      </View>

      <Text className="text-xl font-bold text-border mb-4 uppercase">History (Blinks)</Text>
      <BrutalistCard colorClass="bg-background mb-4 p-3 flex-row justify-between items-center">
        <View>
          <Text className="text-border font-bold uppercase">Don Porfirio Cafe</Text>
          <Text className="text-border text-xs">Solana Pay - May 12, 2026</Text>
        </View>
        <Text className="text-border font-bold text-lg text-primary">-150 HZ</Text>
      </BrutalistCard>
      
      <BrutalistCard colorClass="bg-background mb-4 p-3 flex-row justify-between items-center">
        <View>
          <Text className="text-border font-bold uppercase">Templo Mayor (Reward)</Text>
          <Text className="text-border text-xs">QR Scan - May 10, 2026</Text>
        </View>
        <Text className="text-border font-bold text-lg text-accent2">+50 HZ</Text>
      </BrutalistCard>

    </ScrollView>
  );
}
