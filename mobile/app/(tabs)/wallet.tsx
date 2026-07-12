import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MOCK_USER } from '@/mocks/db';
import { useAuth } from '@/components/auth/auth-provider';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { AppConfig } from '@/constants/app-config';
import { ellipsify } from '@/utils/ellipsify';

const AVATAR_OPTIONS = [
  require('@/assets/images/profile_wallet.png'),
  require('@/assets/images/nft_eagle.png'),
  require('@/assets/images/nft_xochimilco.png'),
  require('@/assets/images/nft_luchador.png'),
  require('@/assets/images/nft_alebrije.png'),
];

export default function WalletScreen() {
  const { isLoading, signIn, signOut } = useAuth();
  const { account } = useMobileWallet();
  const walletAddress = account?.address.toString();
  const isWalletConnected = !!walletAddress;
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Local state for avatar customization
  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_USER.avatarUrl);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const handleConnectWallet = async () => {
    setConnectionError(null);

    try {
      await signIn();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not connect wallet';
      const isCancelled = /cancel|reject|declin|denied/i.test(message);

      setConnectionError(
        isCancelled
          ? 'Connection cancelled in the wallet.'
          : 'Could not connect. Make sure Phantom or another Solana MWA wallet is installed and unlocked.',
      );
    }
  };

  const handleDisconnectWallet = async () => {
    setConnectionError(null);
    await signOut();
  };

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      <Text className="text-3xl font-black text-border mb-6 uppercase tracking-tight">My Wallet</Text>
      
      {/* Wallet Connection */}
      <BrutalistCard colorClass="bg-accent2 mb-6 p-0 overflow-hidden">
        <View className="bg-primary p-4 border-b-4 border-border flex-row items-center">
          <Pressable 
            onPress={() => setAvatarModalVisible(true)}
            className="w-16 h-16 bg-background border-4 border-border shadow-brutal-sm rounded-full overflow-hidden mr-4 relative active:opacity-70 justify-center items-center"
          >
             {selectedAvatar ? (
               <Image source={selectedAvatar} style={{ width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: 'white' }} />
             ) : (
               <FontAwesome5 name="user" size={24} color={colors.border} className="m-auto" />
             )}
             <View className="absolute bottom-0 w-full bg-border/80 items-center py-0.5">
                <Text className="text-background font-black text-[8px] uppercase">Edit</Text>
             </View>
          </Pressable>
          <View className="flex-1">
             <Text className="text-border font-black uppercase text-xl">{MOCK_USER.name}</Text>
             <View className="flex-row mt-1">
               <View className="bg-background px-2 py-0.5 border-2 border-border shadow-brutal-sm mr-2">
                 <Text className="text-border font-bold text-[10px] uppercase">Lvl {MOCK_USER.passportLevel} Explorer</Text>
               </View>
               <View className="bg-accent1 px-2 py-0.5 border-2 border-border shadow-brutal-sm">
                 <Text className="text-border font-bold text-[10px] uppercase">{MOCK_USER.nfts.length} Stamps</Text>
               </View>
             </View>
          </View>
        </View>
        
        <View className="p-4 bg-background">
          {isWalletConnected ? (
            <View>
              <View className="bg-secondary/20 border-4 border-border p-3 mb-4 shadow-brutal-sm flex-row items-center justify-between">
                 <View className="flex-row items-center">
                   <FontAwesome5 name="wallet" size={16} color={colors.border} />
                   <Text className="text-border font-bold text-sm ml-3" numberOfLines={1} ellipsizeMode="middle">
                     {walletAddress}
                   </Text>
                 </View>
                 <FontAwesome5 name="link" size={14} color={colors.primary} />
              </View>
              <View className="flex-row justify-between mb-4">
                <View className="bg-accent2 px-2 py-1 border-2 border-border shadow-brutal-sm">
                  <Text className="text-border font-bold text-xs uppercase">{AppConfig.clusters[0].name}</Text>
                </View>
                <Text className="text-border font-bold text-xs uppercase">
                  {ellipsify(walletAddress, 6)}
                </Text>
              </View>
              <BrutalistButton
                title={isLoading ? 'Disconnecting...' : 'Disconnect'}
                colorClass="bg-primary"
                disabled={isLoading}
                onPress={handleDisconnectWallet}
              />
            </View>
          ) : (
            <View>
              <Text className="text-border font-bold text-sm mb-4 leading-5">
                Connect your Solana wallet with Mobile Wallet Adapter to pay and receive tourism benefits.
              </Text>
              {connectionError && (
                <Text className="text-primary font-black text-xs mb-4 uppercase leading-4">
                  {connectionError}
                </Text>
              )}
              <BrutalistButton
                title={isLoading ? 'Connecting...' : 'Connect Wallet'}
                colorClass="bg-secondary"
                disabled={isLoading}
                onPress={handleConnectWallet}
              />
            </View>
          )}
        </View>
      </BrutalistCard>

      <BrutalistCard colorClass="bg-accent1 mb-6 items-center py-8">
        <Text className="text-border font-bold uppercase mb-2 text-center">Explorer Fund</Text>
        <View className="flex-row items-center bg-background border-4 border-border px-6 py-2 shadow-brutal">
           <Text className="text-5xl font-black text-border">{MOCK_USER.balanceHuellazos}</Text>
        </View>
        <Text className="text-background font-black uppercase tracking-widest mt-3 text-xl">$HUELLAZOS</Text>
        <Text className="text-border text-xs text-center mt-4 px-4 font-bold bg-background/50 py-2">
          * Points redeemable for discounts. Real payments are processed in SOL.
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
            <Text className="text-border text-xs font-bold opacity-70">QR Reward - 10 May</Text>
          </View>
          <Text className="text-accent2 font-black text-xl">+50</Text>
        </View>
      </View>

      {/* Avatar Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAvatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">Select Avatar</Text>
                <FontAwesome5 name="user-astronaut" size={24} color={colors.border} />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-sm mb-4 font-bold">
                  Personalize your Web3 identity! Choose one of your unlocked assets.
                </Text>
                
                <View className="flex-row flex-wrap justify-between mb-4">
                  {AVATAR_OPTIONS.map((avatarImg, index) => (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedAvatar(avatarImg)}
                      style={{ aspectRatio: 1 }}
                      className={`w-[48%] mb-4 border-4 overflow-hidden shadow-brutal-sm justify-center items-center ${
                        selectedAvatar === avatarImg ? 'border-accent2 bg-accent2' : 'border-border bg-secondary'
                      }`}
                    >
                      <Image source={avatarImg} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                      {selectedAvatar === avatarImg && (
                        <View className="absolute top-1 right-1 bg-background border-2 border-border rounded-full p-1">
                          <FontAwesome5 name="check" size={10} color={colors.border} />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>

                <BrutalistButton 
                  title="Confirm" 
                  colorClass="bg-accent1" 
                  onPress={() => setAvatarModalVisible(false)} 
                />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

    </ScrollView>
  );
}
