import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MOCK_USER } from '@/mocks/db';
import { useAuth } from '@/components/auth/auth-provider';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AppConfig } from '@/constants/app-config';
import { ellipsify } from '@/utils/ellipsify';
import { useGetBalance } from '@/components/account/use-get-balance';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { useAppState } from '@/context/app-state';
import { useLanguage } from '@/context/language-context';
import { PublicKey } from '@solana/web3.js';

const AVATAR_OPTIONS = [
  require('@/assets/images/profile_wallet.png'),
  require('@/assets/images/nft_eagle.png'),
  require('@/assets/images/nft_xochimilco.png'),
  require('@/assets/images/nft_luchador.png'),
  require('@/assets/images/nft_alebrije.png'),
];

function formatSolBalance(balance: number) {
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export default function PassportScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { isLoading, signIn, signOut, walletAddress } = useAuth();
  const isWalletConnected = !!walletAddress;
  
  const pubkey = useMemo(() => {
    return walletAddress ? new PublicKey(walletAddress) : undefined;
  }, [walletAddress]);

  const balanceQuery = useGetBalance({ address: pubkey });
  const solBalance = balanceQuery.data == null ? null : lamportsToSol(balanceQuery.data);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { 
    xp, points, status, faction, transactions, joinFaction 
  } = useAppState();

  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_USER.avatarUrl);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isFactionModalVisible, setFactionModalVisible] = useState(false);

  const statusBorderColor = 
    status === 'wanted' ? 'border-primary' : 
    status === 'premium' ? 'border-accent2' : 
    status === 'dusty' ? 'border-gray-500' : 
    'border-border';

  // XP Progress Calculation
  let currentLevelBaseXp = 0;
  let nextLevelXp = 1000;
  
  if (xp >= 5000) {
    currentLevelBaseXp = 5000;
    nextLevelXp = 5000;
  } else if (xp >= 1000) {
    currentLevelBaseXp = 1000;
    nextLevelXp = 5000;
  }
  
  const xpProgress = xp >= 5000 ? 100 : ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

  const handleConnectWallet = async () => {
    setConnectionError(null);

    try {
      await signIn();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not connect wallet';
      const isCancelled = /cancel|reject|declin|denied/i.test(message);

      setConnectionError(
        isCancelled
          ? (language === 'es' ? 'Conexión cancelada.' : 'Connection cancelled.')
          : (language === 'es' ? 'No se pudo conectar. Verifica que Phantom o Solflare estén instalados.' : 'Could not connect. Ensure Phantom or Solflare is installed.'),
      );
    }
  };

  const handleDisconnectWallet = async () => {
    setConnectionError(null);
    await signOut();
  };

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24">
      {/* Header with Title and Language Toggle */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-black text-border uppercase tracking-tight">{t('passport.title')}</Text>
        
        {/* Language Switcher */}
        <View className="flex-row bg-background border-2 border-border shadow-brutal-sm overflow-hidden">
          <Pressable 
            onPress={() => setLanguage('es')}
            className={`px-3 py-1 ${language === 'es' ? 'bg-primary' : 'bg-background'}`}
          >
            <Text className={`font-black text-xs ${language === 'es' ? 'text-background' : 'text-border'}`}>🇲🇽 ES</Text>
          </Pressable>
          <Pressable 
            onPress={() => setLanguage('en')}
            className={`px-3 py-1 ${language === 'en' ? 'bg-primary' : 'bg-background'}`}
          >
            <Text className={`font-black text-xs ${language === 'en' ? 'text-background' : 'text-border'}`}>🇺🇸 EN</Text>
          </Pressable>
        </View>
      </View>
      
      {/* Identity Card */}
      <BrutalistCard colorClass="bg-accent2/20 mb-6 p-0 overflow-hidden" variant="info">
        <View className="bg-primary p-4 border-b-4 border-border flex-row items-center">
          <Pressable 
            onPress={() => setAvatarModalVisible(true)}
            className={`w-16 h-16 bg-background border-4 ${statusBorderColor} shadow-brutal-sm rounded-full overflow-hidden mr-4 relative active:opacity-70 justify-center items-center`}
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
             <Text className="text-background font-black uppercase text-xl">{MOCK_USER.name}</Text>
             <View className="flex-row mt-1 mb-2 flex-wrap">
               <View className="bg-background px-2 py-0.5 border-2 border-border shadow-brutal-sm mr-2 mb-1">
                 <Text className="text-border font-bold text-[10px] uppercase">
                   {t('passport.explorer_level', { level: MOCK_USER.passportLevel })}
                 </Text>
               </View>
               <Pressable onPress={() => setFactionModalVisible(true)} className="bg-accent1 px-2 py-0.5 border-2 border-border shadow-brutal-sm mb-1 active:opacity-70">
                 <Text className="text-background font-bold text-[10px] uppercase">
                   {faction ? `${t('passport.faction')}: ${faction}` : t('passport.join_faction')}
                 </Text>
               </Pressable>
             </View>
             {/* XP Progress Bar */}
             <View className="w-full h-3 bg-background border-2 border-border flex-row overflow-hidden shadow-brutal-sm">
                <View style={{ width: `${xpProgress}%` }} className={`h-full ${status === 'wanted' ? 'bg-primary' : 'bg-accent2'}`} />
             </View>
             <View className="flex-row justify-between mt-1">
               <Text className="text-background text-[9px] font-black uppercase">XP: {xp}</Text>
               <Text className="text-background text-[9px] font-black uppercase">{xp >= 5000 ? 'MAX LVL' : `NEXT: ${nextLevelXp}`}</Text>
             </View>
          </View>
        </View>
        
        {/* Wallet / Identity Details */}
        <View className="p-4 bg-background">
          {isWalletConnected ? (
            <View>
              <View className="bg-secondary/20 border-2 border-border p-3 mb-4 flex-row items-center justify-between">
                 <View className="flex-row items-center flex-1 mr-2">
                   <FontAwesome5 name="id-card" size={16} color={colors.border} />
                   <Text className="text-border font-bold text-sm ml-3 flex-1" numberOfLines={1} ellipsizeMode="middle">
                     {walletAddress}
                   </Text>
                 </View>
                 <FontAwesome5 name="check-circle" size={16} color={colors.accent2} />
              </View>
              <View className="flex-row justify-between mb-4">
                <View className="bg-accent2/30 px-2 py-1 border-2 border-border">
                  <Text className="text-border font-bold text-xs uppercase">{AppConfig.clusters[0].name}</Text>
                </View>
                <Text className="text-border font-bold text-xs uppercase">
                  {ellipsify(walletAddress, 6)}
                </Text>
              </View>

              {/* Balances Section */}
              <View className="flex-row justify-between mb-4">
                {/* SOL Balance Card */}
                <View className="bg-background border-4 border-border p-3 shadow-brutal-sm w-[48%]">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-border font-black text-[11px] uppercase">{t('passport.solana_balance')}</Text>
                    <Pressable onPress={() => balanceQuery.refetch()} disabled={balanceQuery.isFetching}>
                      <FontAwesome5
                        name="sync-alt"
                        size={12}
                        color={colors.border}
                        style={{ opacity: balanceQuery.isFetching ? 0.45 : 1 }}
                      />
                    </Pressable>
                  </View>
                  <Text className="text-border font-black text-2xl" numberOfLines={1} adjustsFontSizeToFit>
                    {balanceQuery.isLoading
                      ? '...'
                      : solBalance == null
                        ? '0.0000'
                        : formatSolBalance(solBalance)}
                  </Text>
                  <Text className="text-border font-black text-[10px] uppercase">SOL</Text>
                </View>

                {/* Explorer Fund Card */}
                <View className="bg-secondary border-4 border-border p-3 shadow-brutal-sm w-[48%]">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-border font-black text-[11px] uppercase">{t('passport.explorer_fund')}</Text>
                    <FontAwesome5 name="coins" size={14} color={colors.border} />
                  </View>
                  <Text className="text-border font-black text-2xl" numberOfLines={1} adjustsFontSizeToFit>
                    {points}
                  </Text>
                  <Text className="text-border font-black text-[10px] uppercase">$HUELLAZOS</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-border text-[10px] text-center font-bold bg-background/50 py-1">
                  {t('passport.points_disclaimer')}
                </Text>
              </View>

              <BrutalistButton
                title={isLoading ? t('passport.disconnecting') : t('passport.disconnect')}
                colorClass="bg-primary"
                disabled={isLoading}
                onPress={handleDisconnectWallet}
              />
            </View>
          ) : (
            <View>
              <Text className="text-border font-bold text-sm mb-4 leading-5">
                {t('passport.connect_desc')}
              </Text>
              {connectionError && (
                <Text className="text-primary font-black text-xs mb-4 uppercase leading-4">
                  {connectionError}
                </Text>
              )}
              <BrutalistButton
                title={isLoading ? t('passport.connecting') : t('passport.connect_cta')}
                colorClass="bg-secondary"
                disabled={isLoading}
                onPress={handleConnectWallet}
              />
            </View>
          )}
        </View>
      </BrutalistCard>

      <View className="mb-4">
        <Text className="text-xl font-black text-border uppercase">{t('passport.quick_actions')}</Text>
        <Text className="text-border text-xs font-bold opacity-80 mt-0.5">
          {language === 'es' ? 'Transferencia directa de Stickers y Medallas entre exploradores' : 'Direct Sticker & Achievement transfer between explorers'}
        </Text>
      </View>
      <View className="flex-row justify-between mb-8">
        <View className="w-[48%]">
          <BrutalistButton title={t('passport.send')} colorClass="bg-primary" />
        </View>
        <View className="w-[48%]">
          <BrutalistButton title={t('passport.receive')} colorClass="bg-accent2" />
        </View>
      </View>

      <Text className="text-xl font-black text-border mb-4 uppercase">{t('passport.history')}</Text>
      
      {transactions.length === 0 ? (
        <BrutalistCard variant="info" colorClass="bg-background p-6 items-center mb-8">
          <FontAwesome5 name="ghost" size={32} color={colors.border} className="mb-2" />
          <Text className="text-border font-black uppercase text-center">{t('passport.no_history')}</Text>
          <Text className="text-border text-xs text-center font-bold opacity-70 mt-1">{t('passport.start_exploring')}</Text>
        </BrutalistCard>
      ) : (
        transactions.map((tx) => (
          <View key={tx.id} className="bg-background border-4 border-border mb-4 p-0 shadow-brutal-sm overflow-hidden flex-row">
            <View className={`${tx.type === 'earn' ? 'bg-accent2' : tx.type === 'penalty' ? 'bg-primary' : 'bg-secondary'} w-14 justify-center items-center border-r-4 border-border`}>
               <FontAwesome5 name={tx.type === 'earn' ? 'arrow-down' : tx.type === 'penalty' ? 'exclamation-triangle' : 'arrow-up'} size={20} color={colors.border} />
            </View>
            <View className="flex-1 p-3 flex-row justify-between items-center">
              <View className="flex-1 pr-2">
                <Text className="text-border font-black uppercase text-base" numberOfLines={1}>{tx.description}</Text>
                <Text className="text-border text-[10px] font-bold opacity-70">
                  {new Date(tx.timestamp).toLocaleDateString()} - {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text className={`${tx.type === 'earn' ? 'text-accent2' : 'text-primary'} font-black text-lg`}>
                {tx.type === 'earn' ? '+' : '-'}{tx.amount}
              </Text>
            </View>
          </View>
        ))
      )}

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
                <Text className="text-background font-black text-xl uppercase">{t('passport.select_avatar')}</Text>
                <FontAwesome5 name="user-astronaut" size={24} color="#FAF9F6" />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-sm mb-4 font-bold">
                  {t('passport.avatar_desc')}
                </Text>
                
                <View className="flex-row flex-wrap justify-between mb-4">
                  {AVATAR_OPTIONS.map((avatarImg, index) => (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedAvatar(avatarImg)}
                      style={{ aspectRatio: 1 }}
                      className={`w-[48%] mb-4 border-4 overflow-hidden shadow-brutal-sm justify-center items-center ${
                        selectedAvatar === avatarImg ? 'border-accent2 bg-accent2/30' : 'border-border bg-secondary/30'
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
                  title={t('common.confirm')} 
                  colorClass="bg-accent1" 
                  onPress={() => setAvatarModalVisible(false)} 
                />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Faction Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFactionModalVisible}
        onRequestClose={() => setFactionModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             <View className="bg-secondary p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">{t('passport.join_faction_title')}</Text>
                <FontAwesome5 name="users" size={24} color={colors.border} />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-sm mb-4 font-bold text-center">
                  {t('passport.join_faction_desc')}
                </Text>
                
                {['Ajolotes', 'Eagles', 'Jaguars'].map((f) => (
                  <Pressable
                    key={f}
                    onPress={() => {
                      joinFaction(f as any);
                      setFactionModalVisible(false);
                    }}
                    className={`mb-3 p-4 border-4 shadow-brutal-sm flex-row justify-between items-center ${faction === f ? 'border-accent2 bg-accent2/30' : 'border-border bg-background'}`}
                  >
                    <Text className="text-border font-black uppercase text-lg">{f}</Text>
                    {faction === f && <FontAwesome5 name="check-circle" solid size={20} color={colors.border} />}
                  </Pressable>
                ))}

                <View className="mt-2">
                  <BrutalistButton 
                    title={t('common.cancel')} 
                    colorClass="bg-primary" 
                    onPress={() => setFactionModalVisible(false)} 
                  />
                </View>
             </View>
          </BrutalistCard>
        </View>
      </Modal>

    </ScrollView>
  );
}
