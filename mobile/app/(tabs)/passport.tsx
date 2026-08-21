import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
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
import { useHuellazoWeb3 } from '@/hooks/useHuellazoWeb3';
import { TradeAcceptModal } from '@/components/features/passport/TradeAcceptModal';
import { PublicKey } from '@solana/web3.js';

const AVATAR_OPTIONS = [
  require('@/assets/images/profile_wallet.png'),
  require('@/assets/images/huajuapan/nft_jaguarcito_nuiñe.png'),
  require('@/assets/images/huajuapan/nft_sol_mixteca.png'),
  require('@/assets/images/huajuapan/nft_jarabe_mixteco.png'),
  require('@/assets/images/huajuapan/nft_guaje_oro.png'),
];

function formatSolBalance(balance: number) {
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

const TOPUP_PACKAGES = [
  { id: 'pkg1', hzAmount: 35, solCost: 0.01, label: 'Paquete Inicial (Aprox. $35 MXN)' },
  { id: 'pkg2', hzAmount: 100, solCost: 0.03, label: 'Paquete Explorador Pro (Aprox. $100 MXN)', popular: true },
  { id: 'pkg3', hzAmount: 175, solCost: 0.05, label: 'Paquete Leyenda Mixteca (Aprox. $175 MXN)' },
];

export default function PassportScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { isLoading, signIn, signOut, walletAddress } = useAuth();
  const { mintBusinessOnChain } = useHuellazoWeb3();
  const isWalletConnected = !!walletAddress;
  
  const pubkey = useMemo(() => {
    return walletAddress ? new PublicKey(walletAddress) : undefined;
  }, [walletAddress]);

  const balanceQuery = useGetBalance({ address: pubkey });
  const solBalance = balanceQuery.data == null ? null : lamportsToSol(balanceQuery.data);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { 
    userName, setUserName, userAvatar, setUserAvatar,
    xp, points, status, faction, transactions, ownedNfts, earnedTokens,
    joinFaction, earnPoints 
  } = useAppState();

  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isFactionModalVisible, setFactionModalVisible] = useState(false);

  // Edit Username State
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState(userName);
  
  // Topup State
  const [isTopupModalVisible, setTopupModalVisible] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(TOPUP_PACKAGES[0]);
  const [topupSuccessModal, setTopupSuccessModal] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);

  // Trade Modal State
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);

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
          : (language === 'es' ? 'No se pudo conectar. Revisa tu aplicación de monedero.' : 'Could not connect. Check your wallet app.'),
      );
    }
  };

  const handleDisconnectWallet = async () => {
    setConnectionError(null);
    await signOut();
  };

  const handleSwitchWallet = async () => {
    setConnectionError(null);
    await signOut();
    setTimeout(() => {
      signIn().catch(console.warn);
    }, 300);
  };

  const handleExecuteTopup = async () => {
    setTopupError(null);
    setTopupLoading(true);

    try {
      const lamports = Math.round(selectedPkg.solCost * 1_000_000_000);

      // Prompt wallet signature & execute payment on Solana Devnet
      const res = await mintBusinessOnChain({
        amountLamports: lamports,
        businessName: `Recarga de Puntos HZ - ${selectedPkg.label}`,
        latitude: 17.807,
        longitude: -97.776,
      });

      if (!res.success) {
        setTopupError(
          res.error || 
          (language === 'es' ? 'Transacción rechazada en el monedero.' : 'Transaction rejected in wallet.')
        );
        return;
      }

      // Update user's Puntos Huellazos balance and log transaction ONLY on verified wallet signature
      earnPoints(
        selectedPkg.hzAmount, 
        `Recarga de ${selectedPkg.hzAmount} Puntos HZ (${selectedPkg.solCost} SOL)`
      );

      setTopupModalVisible(false);
      setTopupSuccessModal(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en la transacción';
      setTopupError(msg);
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24" showsVerticalScrollIndicator={false}>
      {/* Header with Title and Language Toggle */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-black text-border uppercase tracking-tight">{t('passport.title')}</Text>
        
        <View className="flex-row items-center">
          {isWalletConnected && (
            <Pressable 
              onPress={handleSwitchWallet}
              className="bg-primary px-2.5 py-1 border-2 border-border shadow-brutal-sm mr-2 active:scale-95 flex-row items-center"
            >
              <FontAwesome5 name="exchange-alt" size={10} color="#FAF9F6" className="mr-1" />
              <Text className="text-background font-black text-[9px] uppercase">
                {language === 'es' ? 'CAMBIAR' : 'SWITCH'}
              </Text>
            </Pressable>
          )}

          {/* Language Switcher without Emojis */}
          <View className="flex-row bg-background border-2 border-border shadow-brutal-sm overflow-hidden">
            <Pressable 
              onPress={() => setLanguage('es')}
              className={`px-3 py-1 ${language === 'es' ? 'bg-primary' : 'bg-background'}`}
            >
              <Text className={`font-black text-xs ${language === 'es' ? 'text-background' : 'text-border'}`}>ES</Text>
            </Pressable>
            <Pressable 
              onPress={() => setLanguage('en')}
              className={`px-3 py-1 ${language === 'en' ? 'bg-primary' : 'bg-background'}`}
            >
              <Text className={`font-black text-xs ${language === 'en' ? 'text-background' : 'text-border'}`}>EN</Text>
            </Pressable>
          </View>
        </View>
      </View>
      
      {/* Identity Card - Tapping Avatar opens avatar modal directly */}
      <BrutalistCard colorClass="bg-accent2/20 mb-6 p-0 overflow-hidden" variant="info">
        <View className="bg-primary p-4 border-b-4 border-border flex-row items-center">
          <Pressable 
            onPress={() => setAvatarModalVisible(true)}
            className={`w-16 h-16 bg-background border-4 ${statusBorderColor} shadow-brutal-sm rounded-full overflow-hidden mr-4 relative active:opacity-70 justify-center items-center`}
          >
             {userAvatar ? (
               <Image source={typeof userAvatar === 'string' ? { uri: userAvatar } : userAvatar} style={{ width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: 'white' }} />
             ) : (
               <FontAwesome5 name="user" size={24} color={colors.border} className="m-auto" />
             )}
             <View className="absolute bottom-0 w-full bg-border/80 items-center py-0.5">
                <Text className="text-background font-black text-[8px] uppercase">{language === 'es' ? 'Cambiar' : 'Edit'}</Text>
             </View>
          </Pressable>
          <View className="flex-1">
             <View className="flex-row items-center mb-1">
               <Text className="text-background font-black uppercase text-xl flex-1 mr-2" numberOfLines={1}>{userName}</Text>
               <Pressable 
                 onPress={() => {
                   setNewUsernameInput(userName);
                   setIsEditNameModalVisible(true);
                 }}
                 className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm flex-row items-center active:scale-95"
               >
                 <FontAwesome5 name="pen" size={10} color={colors.border} className="mr-1" />
                 <Text className="text-border font-black text-[9px] uppercase">{language === 'es' ? 'EDITAR' : 'EDIT'}</Text>
               </Pressable>
             </View>
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
               <Text className="text-background text-[9px] font-black uppercase">PUNTOS XP: {xp}</Text>
               <Text className="text-background text-[9px] font-black uppercase">{xp >= 5000 ? (language === 'es' ? 'NIVEL MÁXIMO' : 'MAX LVL') : `${language === 'es' ? 'SIG. NIVEL:' : 'NEXT:'} ${nextLevelXp}`}</Text>
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
                <View className="bg-background border-4 border-border p-3 shadow-brutal-sm w-[48%] justify-between">
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
                  <Text className="text-border font-black text-xl my-1" numberOfLines={1} adjustsFontSizeToFit>
                    {balanceQuery.isLoading
                      ? '...'
                      : solBalance == null
                        ? '0.0000'
                        : formatSolBalance(solBalance)}
                  </Text>
                  <Text className="text-border font-black text-[10px] uppercase">SOL</Text>
                </View>

                {/* Explorer Fund HZ Card with Topup Trigger */}
                <View className="bg-secondary border-4 border-border p-3 shadow-brutal-sm w-[48%] justify-between">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-border font-black text-[11px] uppercase">{t('passport.explorer_fund')}</Text>
                    <FontAwesome5 name="coins" size={14} color={colors.border} />
                  </View>
                  <Text className="text-border font-black text-2xl my-1" numberOfLines={1} adjustsFontSizeToFit>
                    {points}
                  </Text>
                  <Pressable 
                    onPress={() => setTopupModalVisible(true)} 
                    className="bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm active:scale-95 flex-row justify-between items-center"
                  >
                    <Text className="text-background font-black text-[9px] uppercase">
                      {language === 'es' ? '+ RECARGAR HZ' : '+ TOP UP HZ'}
                    </Text>
                    <FontAwesome5 name="plus-circle" size={10} color="#FAF9F6" />
                  </Pressable>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-border text-[10px] text-center font-bold bg-background/50 py-1">
                  {t('passport.points_disclaimer')}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-1 mr-1.5">
                  <BrutalistButton
                    title={isLoading ? "CERRANDO..." : "CERRAR SESIÓN"}
                    colorClass="bg-primary"
                    disabled={isLoading}
                    onPress={handleDisconnectWallet}
                  />
                </View>
                <View className="flex-1 ml-1.5">
                  <BrutalistButton
                    title="CAMBIAR MONEDERO"
                    colorClass="bg-accent2"
                    disabled={isLoading}
                    onPress={handleSwitchWallet}
                  />
                </View>
              </View>
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

      {/* Quick Actions Header */}
      <View className="mb-4">
        <Text className="text-xl font-black text-border uppercase">{t('passport.quick_actions')}</Text>
        <Text className="text-border text-xs font-bold opacity-80 mt-0.5">
          {language === 'es' ? 'Envía estampas generando un QR o escanea para recibir coleccionables P2P' : 'Send stamps by generating a QR or scan to receive P2P collectibles'}
        </Text>
      </View>

      {/* Quick Action Buttons: Enviar Estampa & Escanear QR */}
      <View className="flex-row justify-between mb-8">
        <View className="w-[48%]">
           <BrutalistButton 
             title={language === 'es' ? "ENVIAR ESTAMPA" : "SEND STAMP"} 
             colorClass="bg-accent2" 
             onPress={() => setIsTradeModalVisible(true)} 
           />
        </View>
        <View className="w-[48%]">
           <BrutalistButton 
             title={language === 'es' ? "ESCANEAR QR" : "SCAN QR"} 
             colorClass="bg-primary" 
             onPress={() => router.push('/(tabs)/scan')} 
           />
        </View>
      </View>

      {/* Transaction History Section */}
      <Text className="text-2xl font-black text-border mb-4 uppercase">{t('passport.transaction_history')}</Text>
      <View className="mb-12">
        {transactions.length === 0 ? (
          <View className="bg-background border-4 border-border p-4 items-center">
             <Text className="text-border text-xs font-bold uppercase opacity-60">
               {language === 'es' ? 'Aún no hay transacciones registradas' : 'No transactions logged yet'}
             </Text>
          </View>
        ) : (
          transactions.map((tx) => (
            <BrutalistCard key={tx.id} colorClass="bg-background mb-3 p-3 flex-row items-center justify-between" variant="info">
               <View className="flex-row items-center flex-1 mr-2">
                   {tx.image ? (
                     <View className="w-9 h-9 border-2 border-border mr-3 rounded-md overflow-hidden shadow-brutal-sm bg-accent2/20">
                       <Image source={typeof tx.image === 'string' ? { uri: tx.image } : tx.image} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                     </View>
                   ) : (
                     <View className={`w-8 h-8 ${tx.type === 'earn' ? 'bg-accent2' : tx.type === 'penalty' ? 'bg-primary' : 'bg-secondary'} border-2 border-border justify-center items-center mr-3 shadow-brutal-sm`}>
                        <FontAwesome5 name={tx.type === 'earn' ? 'arrow-down' : tx.type === 'penalty' ? 'exclamation' : 'arrow-up'} size={12} color={colors.border} />
                     </View>
                   )}
                  <View className="flex-1">
                     <Text className="text-border font-black text-xs uppercase" numberOfLines={1}>{tx.description}</Text>
                     <Text className="text-border text-[9px] font-bold opacity-60">{tx.timestamp}</Text>
                  </View>
               </View>

               <Text className={`font-black text-sm ${tx.type === 'earn' ? 'text-accent2' : 'text-primary'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount} HZ
               </Text>
            </BrutalistCard>
          ))
        )}
      </View>

      {/* Edit Username Modal */}
      <Modal visible={isEditNameModalVisible} transparent animationType="slide" onRequestClose={() => setIsEditNameModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">{language === 'es' ? 'Editar Nombre' : 'Edit Name'}</Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setIsEditNameModalVisible(false)} />
            </View>

            <View className="p-4">
              <Text className="text-border font-bold text-xs mb-2 uppercase">{language === 'es' ? 'Nombre de Explorador:' : 'Explorer Name:'}</Text>
              <TextInput
                value={newUsernameInput}
                onChangeText={setNewUsernameInput}
                placeholder="Ej. Mario Explorador"
                placeholderTextColor="#888"
                className="bg-background border-4 border-border p-3 text-border font-bold text-base mb-4 shadow-brutal-sm"
              />
              <BrutalistButton 
                title={language === 'es' ? 'GUARDAR CAMBIOS' : 'SAVE CHANGES'}
                colorClass="bg-accent2"
                onPress={() => {
                  if (newUsernameInput.trim()) {
                    setUserName(newUsernameInput.trim());
                  }
                  setIsEditNameModalVisible(false);
                }}
              />
            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Topup / Recharge HZ Modal */}
      <Modal visible={isTopupModalVisible} transparent animationType="slide" onRequestClose={() => setTopupModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">
                 {language === 'es' ? 'Recargar Puntos Huellazos' : 'Top Up Huellazos Points'}
               </Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setTopupModalVisible(false)} />
            </View>

            <View className="p-4">
              <Text className="text-border text-xs font-bold mb-3 leading-relaxed">
                {language === 'es' 
                  ? 'Selecciona un paquete para adquirir Puntos HZ utilizando tu monedero de Solana:' 
                  : 'Select a package to buy HZ Points using your Solana wallet:'}
              </Text>

              <View className="bg-secondary/30 p-2.5 border-2 border-border mb-3">
                <Text className="text-border text-[10px] font-bold text-center uppercase">
                  {language === 'es' 
                    ? '1 Punto HZ equivale a $1.00 MXN en consumos' 
                    : '1 HZ Point equals $1.00 MXN in purchases'}
                </Text>
              </View>

              {topupError && (
                <View className="bg-primary/20 border-2 border-primary p-2 mb-3">
                   <Text className="text-primary font-black text-xs uppercase text-center">{topupError}</Text>
                </View>
              )}

              {TOPUP_PACKAGES.map((pkg) => (
                <Pressable
                  key={pkg.id}
                  onPress={() => setSelectedPkg(pkg)}
                  className={`p-3 border-4 border-border mb-3 flex-row justify-between items-center ${selectedPkg.id === pkg.id ? 'bg-accent2/40' : 'bg-background'}`}
                >
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-border font-black text-base uppercase mr-2">{pkg.hzAmount} HZ</Text>
                      {pkg.popular && (
                        <View className="bg-primary px-2 py-0.5 border border-border">
                          <Text className="text-background font-black text-[9px] uppercase">POPULAR</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-border text-xs font-bold opacity-70">{pkg.label}</Text>
                  </View>
                  <Text className="text-border font-black text-sm">{pkg.solCost} SOL</Text>
                </Pressable>
              ))}

              <View className="mt-2 mb-4 bg-secondary/30 p-3 border-2 border-border flex-row justify-between items-center">
                 <Text className="text-border font-bold text-xs uppercase">Total a pagar:</Text>
                 <Text className="text-border font-black text-base">{selectedPkg.solCost} SOL</Text>
              </View>

              <BrutalistButton 
                title={
                  topupLoading
                    ? (language === 'es' ? 'CONFIRMANDO EN MONEDERO...' : 'CONFIRMING IN WALLET...')
                    : (language === 'es' ? 'PAGAR CON SOLANA & RECARGAR' : 'PAY WITH SOLANA & RECHARGE')
                } 
                colorClass="bg-primary"
                disabled={topupLoading}
                onPress={handleExecuteTopup}
              />
            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Topup Success Modal */}
      <Modal visible={topupSuccessModal} transparent animationType="fade" onRequestClose={() => setTopupSuccessModal(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
             <View className="bg-accent2 p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">
                  {language === 'es' ? 'Recarga Exitosa' : 'Recharge Successful'}
                </Text>
                <FontAwesome5 name="check-circle" size={24} color={colors.border} />
             </View>

             <View className="p-6 items-center">
                <View className="w-16 h-16 bg-accent2 border-4 border-border rounded-full justify-center items-center mb-4 shadow-brutal-sm">
                   <FontAwesome5 name="coins" size={28} color={colors.border} />
                </View>
                <Text className="text-border font-black text-2xl uppercase mb-1">+{selectedPkg.hzAmount} HZ</Text>
                <Text className="text-border text-sm font-bold text-center mb-6 leading-relaxed">
                  {language === 'es' 
                    ? `Se han añadido ${selectedPkg.hzAmount} Puntos Huellazos a tu monedero mediante una transacción confirmada en Solana.`
                    : `Added ${selectedPkg.hzAmount} Huellazos Points to your wallet via Solana.`}
                </Text>
                <BrutalistButton title={t('common.okay')} colorClass="bg-primary" onPress={() => setTopupSuccessModal(false)} />
             </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Dynamic Avatar Change Modal with Earned Stamps */}
      <Modal visible={isAvatarModalVisible} transparent animationType="slide" onRequestClose={() => setAvatarModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-md w-full p-0 overflow-hidden max-h-[85%]">
            <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">{language === 'es' ? 'Foto de Perfil' : 'Profile Picture'}</Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setAvatarModalVisible(false)} />
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
               {/* Section 1: Default Avatars */}
               <Text className="text-border font-black text-xs uppercase mb-3 opacity-80">
                 {language === 'es' ? 'Avatares Predeterminados:' : 'Default Avatars:'}
               </Text>
               <View className="flex-row flex-wrap justify-around mb-6">
                  {AVATAR_OPTIONS.map((imgSrc, idx) => (
                    <Pressable
                      key={`def-${idx}`}
                      onPress={() => {
                        setUserAvatar(imgSrc);
                        setAvatarModalVisible(false);
                      }}
                      className="w-16 h-16 bg-background border-4 border-border m-1.5 rounded-full overflow-hidden shadow-brutal-sm active:scale-95"
                    >
                       <Image source={imgSrc} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </Pressable>
                  ))}
               </View>

               {/* Section 2: Earned Stamps / NFTs */}
               <Text className="text-border font-black text-xs uppercase mb-3 opacity-80">
                 {language === 'es' ? 'Tus Estampas Conseguidas:' : 'Your Unlocked Stamps:'}
               </Text>
               {ownedNfts.length === 0 ? (
                 <View className="bg-secondary/30 p-3 border-2 border-border mb-4 items-center">
                    <Text className="text-border text-xs font-bold text-center">
                      {language === 'es' ? '¡Explora la ciudad y escanea lugares para desbloquear más estampas!' : 'Explore and scan places to unlock stamps!'}
                    </Text>
                 </View>
               ) : (
                 <View className="flex-row flex-wrap justify-start mb-4">
                    {ownedNfts.map((nft) => (
                      <Pressable
                        key={`nft-${nft.id}`}
                        onPress={() => {
                          if (nft.image) {
                            setUserAvatar(nft.image);
                            setAvatarModalVisible(false);
                          }
                        }}
                        className="w-16 h-16 bg-accent1 border-4 border-border m-1.5 rounded-full overflow-hidden shadow-brutal-sm active:scale-95 justify-center items-center"
                      >
                         {nft.image ? (
                           <Image source={typeof nft.image === 'string' ? { uri: nft.image } : nft.image} style={{ width: '90%', height: '90%', resizeMode: 'contain' }} />
                         ) : (
                           <FontAwesome5 name="award" size={20} color={colors.border} />
                         )}
                      </Pressable>
                    ))}
                 </View>
               )}
            </ScrollView>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Faction Join Modal */}
      <Modal visible={isFactionModalVisible} transparent animationType="slide" onRequestClose={() => setFactionModalVisible(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <BrutalistCard colorClass="bg-background max-w-sm w-full p-0 overflow-hidden">
            <View className="bg-accent1 p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">{t('passport.join_faction')}</Text>
               <FontAwesome5 name="times" size={24} color="#FAF9F6" onPress={() => setFactionModalVisible(false)} />
            </View>

            <View className="p-4">
              <Text className="text-border text-xs font-bold mb-4">{t('passport.faction_desc')}</Text>

              {(['Ajolotes', 'Eagles', 'Jaguars'] as const).map((facName) => (
                <Pressable
                  key={facName}
                  onPress={() => {
                    joinFaction(facName);
                    setFactionModalVisible(false);
                  }}
                  className={`p-3 border-4 border-border mb-3 flex-row items-center justify-between active:scale-95 ${faction === facName ? 'bg-accent2' : 'bg-secondary/40'}`}
                >
                   <View className="flex-row items-center">
                      <FontAwesome5 name={facName === 'Ajolotes' ? 'water' : facName === 'Eagles' ? 'feather-alt' : 'paw'} size={18} color={colors.border} className="mr-3" />
                      <Text className="text-border font-black text-lg uppercase">{facName}</Text>
                   </View>
                   {faction === facName && <FontAwesome5 name="check" size={16} color={colors.border} />}
                </Pressable>
              ))}
            </View>
          </BrutalistCard>
        </View>
      </Modal>

      {/* Trade Modal for collectible stamps */}
      <TradeAcceptModal visible={isTradeModalVisible} onClose={() => setIsTradeModalVisible(false)} />

    </ScrollView>
  );
}
