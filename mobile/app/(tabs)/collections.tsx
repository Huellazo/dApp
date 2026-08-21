import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal } from 'react-native';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { NftDetailModal } from '@/components/features/passport/NftDetailModal';
import { TradeOfferModal } from '@/components/features/passport/TradeOfferModal';
import { PinataModal } from '@/components/features/wallet/PinataModal';
import { useAppState } from '@/context/app-state';
import { useLanguage } from '@/context/language-context';
import { MOCK_POIS, MOCK_LOCKED_STAMPS, LockedStamp } from '@/mocks/db';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

type FilterCategory = 'all' | 'stickers' | 'trophies' | 'inventory' | 'locked';

export default function CollectionsScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const { earnedTokens, inventory, ownedNfts } = useAppState();
  
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [selectedLockedStamp, setSelectedLockedStamp] = useState<LockedStamp | null>(null);
  const [isTradeOfferVisible, setTradeOfferVisible] = useState(false);
  const [isPinataModalVisible, setPinataModalVisible] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState<Record<string, boolean>>({});

  const toggleTechDetails = (id: string) => {
    setShowTechDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const inventoryNfts = inventory.filter(item => item.type === 'nft').map(item => ({
    id: item.id,
    title: item.name,
    location: item.description || 'Unknown',
    image: item.image,
    date: item.obtainedAt,
    style: item.style
  }));

  const nonNftInventory = inventory.filter(item => item.type !== 'nft');
  const allNfts = [...ownedNfts, ...inventoryNfts];

  // Set of all obtained names and titles (lowercase for comparison)
  const obtainedNames = [
    ...allNfts.map(nft => (nft.title || '').toLowerCase().trim()),
    ...earnedTokens.map(tok => (tok.name || '').toLowerCase().trim()),
    ...earnedTokens.map(tok => (tok.location || '').toLowerCase().trim())
  ];

  // Filter MOCK_LOCKED_STAMPS so that ONLY stamps NOT YET obtained appear in "Por Desbloquear"
  const lockedStamps = MOCK_LOCKED_STAMPS.filter(stamp => {
    const titleLower = stamp.title.toLowerCase().trim();
    const isObtained = obtainedNames.some(name => {
      if (!name) return false;
      return name.includes(titleLower) || titleLower.includes(name);
    });
    return !isObtained;
  });

  // Album progress metrics
  const totalCollectedStickers = earnedTokens.length + allNfts.length;
  const totalAvailableTarget = totalCollectedStickers + lockedStamps.length;
  const albumProgressPercent = Math.min(Math.round((totalCollectedStickers / Math.max(totalAvailableTarget, 1)) * 100), 100);

  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4 pb-24" showsVerticalScrollIndicator={false}>
      {/* Screen Title */}
      <Text className="text-3xl font-black text-border mb-4 uppercase tracking-tight">{t('collections.title')}</Text>
      
      {/* 📘 STICKER ALBUM COVER HEADER CARD */}
      <BrutalistCard colorClass="bg-secondary/40 mb-6 p-0 overflow-hidden">
        <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
          <View className="flex-row items-center">
            <FontAwesome5 name="book-open" size={24} color="#FAF9F6" className="mr-3" />
            <View>
              <Text className="text-background font-black text-lg uppercase leading-tight">{t('collections.album_title')}</Text>
              <Text className="text-background/90 text-xs font-bold">{t('collections.album_subtitle')}</Text>
            </View>
          </View>
          <View className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm">
            <Text className="text-border font-black text-xs">{albumProgressPercent}%</Text>
          </View>
        </View>

        <View className="p-4 bg-background">
          {/* Progress Bar */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-border font-bold text-xs uppercase">
              {t('collections.album_progress', { collected: totalCollectedStickers, total: totalAvailableTarget })}
            </Text>
            <FontAwesome5 name="stamp" size={14} color={colors.primary} />
          </View>
          
          <View className="w-full h-4 bg-background border-2 border-border flex-row overflow-hidden shadow-brutal-sm mb-4">
            <View style={{ width: `${albumProgressPercent}%` }} className="h-full bg-accent2" />
          </View>

          {/* Album Sticker Thumbnails Preview (Pinned Stickers) */}
          <View className="flex-row justify-between items-center bg-secondary/20 p-3 border-2 border-border">
            {earnedTokens.length === 0 && allNfts.length === 0 ? (
              <Text className="text-border font-bold text-xs text-center w-full opacity-70">
                ¡Explora el Radar para pegar tus primeras estampas aquí!
              </Text>
            ) : (
              <View className="flex-row items-center flex-wrap justify-start">
                {earnedTokens.slice(0, 4).map((tok) => (
                  <View key={`thumb-${tok.id}`} className="w-10 h-10 bg-accent2 border-2 border-border shadow-brutal-sm rounded-md mr-2 overflow-hidden justify-center items-center">
                    <FontAwesome5 name="map-marker-alt" size={16} color={colors.border} />
                  </View>
                ))}
                {allNfts.slice(0, 4).map((nft) => (
                  <View key={`thumb-${nft.id}`} className="w-10 h-10 bg-accent1 border-2 border-border shadow-brutal-sm rounded-md mr-2 overflow-hidden justify-center items-center">
                    <FontAwesome5 name="medal" size={16} color="#FAF9F6" />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </BrutalistCard>

      {/* 🎁 PIÑATA & SHOP COMPACT CARD */}
      <BrutalistCard colorClass="bg-accent1/30 mb-6 p-4 flex-row items-center justify-between" variant="info">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <FontAwesome5 name="gift" size={18} color={colors.primary} className="mr-2" />
            <Text className="text-border font-black text-base uppercase">{t('collections.loot_shop_title')}</Text>
          </View>
          <Text className="text-border text-xs font-bold opacity-80" numberOfLines={2}>
            {t('collections.loot_shop_desc')}
          </Text>
        </View>
        <BrutalistButton 
          title=" Romper (100 HZ)" 
          colorClass="bg-primary" 
          onPress={() => setPinataModalVisible(true)} 
        />
      </BrutalistCard>

      {/* 🗂️ CATEGORY FILTERS */}
      <View className="flex-row mb-6 bg-background border-2 border-border shadow-brutal-sm overflow-hidden p-1 justify-between flex-wrap">
        <Pressable 
          onPress={() => setActiveFilter('all')}
          className={`px-3 py-2 items-center rounded-sm mb-1 ${activeFilter === 'all' ? 'bg-primary' : 'bg-background'}`}
        >
          <Text className={`font-black text-xs uppercase ${activeFilter === 'all' ? 'text-background' : 'text-border'}`}>
            {t('collections.filter_all')}
          </Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveFilter('stickers')}
          className={`px-3 py-2 items-center rounded-sm mb-1 ${activeFilter === 'stickers' ? 'bg-accent2' : 'bg-background'}`}
        >
          <Text className={`font-black text-xs uppercase ${activeFilter === 'stickers' ? 'text-background' : 'text-border'}`}>
            {t('collections.filter_stickers')} ({earnedTokens.length})
          </Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveFilter('trophies')}
          className={`px-3 py-2 items-center rounded-sm mb-1 ${activeFilter === 'trophies' ? 'bg-accent1' : 'bg-background'}`}
        >
          <Text className={`font-black text-xs uppercase ${activeFilter === 'trophies' ? 'text-background' : 'text-border'}`}>
            {t('collections.filter_trophies')} ({allNfts.length})
          </Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveFilter('locked')}
          className={`px-3 py-2 items-center rounded-sm mb-1 ${activeFilter === 'locked' ? 'bg-secondary' : 'bg-background'}`}
        >
          <Text className={`font-black text-xs uppercase ${activeFilter === 'locked' ? 'text-border font-bold' : 'text-border'}`}>
            {t('collections.filter_locked')} ({lockedStamps.length})
          </Text>
        </Pressable>
      </View>

      {/* 🏛️ SECTION 1: VISIT STICKERS */}
      {(activeFilter === 'all' || activeFilter === 'stickers') && (
        <View className="mb-6">
          <Text className="text-xl font-black text-border mb-3 uppercase">{t('collections.visit_stickers')}</Text>
          {earnedTokens.length === 0 ? (
            <BrutalistCard colorClass="bg-background mb-4 p-6 items-center" variant="info">
              <FontAwesome5 name="map-marker-alt" size={32} color={colors.border} className="mb-2" />
              <Text className="text-border font-black text-lg uppercase mb-2 text-center">{t('collections.no_visit_stickers')}</Text>
              <Text className="text-border font-bold text-sm text-center">
                {t('collections.visit_stickers_desc')}
              </Text>
            </BrutalistCard>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {earnedTokens.map(token => {
                const poi = MOCK_POIS.find(item => item.id === token.poiId);
                const isTechShown = !!showTechDetails[token.id];

                return (
                  <View key={token.id} className="w-[48%] mb-4">
                    <BrutalistCard colorClass="bg-background p-0 overflow-hidden">
                      <View className="w-full h-32 bg-accent2/30 border-b-4 border-border justify-center items-center relative overflow-hidden p-2">
                        {(token.image || poi?.image) ? (
                          <Image 
                            source={(token.image || poi?.image) as any} 
                            style={{ width: '80%', height: '80%', resizeMode: 'contain' }} 
                          />
                        ) : (
                          <Text className="text-border font-black text-4xl opacity-50">H</Text>
                        )}
                      </View>
                      <View className="p-3 bg-secondary/30">
                        <Text className="text-border font-black text-sm uppercase" numberOfLines={2}>{token.name}</Text>
                        <Text className="text-border text-xs font-bold mt-1 opacity-80" numberOfLines={1}>{token.location}</Text>
                        
                        <View className="bg-background border-2 border-border p-2 mt-3">
                          <View className="flex-row justify-between items-center">
                            <Text className="text-border font-black text-[10px] uppercase">{t('collections.reward')}</Text>
                            <Text className="text-border font-black text-xs">+{token.reward} HZ</Text>
                          </View>
                          
                          <Pressable 
                            onPress={() => toggleTechDetails(token.id)}
                            className="mt-2 pt-2 border-t border-border/30 flex-row justify-between items-center"
                          >
                            <Text className="text-border text-[9px] font-bold opacity-70">{t('common.details')}</Text>
                            <FontAwesome5 name={isTechShown ? 'chevron-up' : 'chevron-down'} size={8} color={colors.border} />
                          </Pressable>

                          {isTechShown && (
                            <View className="mt-1 pt-1 border-t border-dashed border-border/40">
                              <Text className="text-border font-black text-[8px] uppercase">{t('collections.technical_hash')}</Text>
                              <Text className="text-border font-mono text-[9px]">{shortHash(token.mintAddress)}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </BrutalistCard>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* 🏆 SECTION 2: COLLECTIBLE TROPHIES & STICKERS */}
      {(activeFilter === 'all' || activeFilter === 'trophies') && (
        <View className="mb-6">
          <Text className="text-xl font-black text-border mb-3 uppercase">{t('collections.collectible_stickers')}</Text>
          <View className="flex-row flex-wrap justify-between">
            {allNfts.length === 0 ? (
              <BrutalistCard variant="info" colorClass="bg-background w-full p-6 items-center mb-4">
                <FontAwesome5 name="award" size={32} color={colors.border} className="mb-2" />
                <Text className="text-border font-black uppercase text-center text-lg mb-2">{t('collections.no_stickers')}</Text>
              </BrutalistCard>
            ) : (
              allNfts.map((nft: any) => (
                <View key={nft.id} className="w-[48%] mb-4">
                  <Pressable onPress={() => setSelectedNft(nft)} className="active:scale-95 transition-transform">
                    <BrutalistCard colorClass="bg-background p-0 overflow-hidden">
                      <View className={`w-full h-32 ${nft.style === 'chromatic' ? 'bg-[#FF00FF]/30' : nft.style === 'metallic' ? 'bg-[#C0C0C0]' : 'bg-accent1/30'} border-b-4 border-border justify-center items-center relative overflow-hidden p-2`}>
                        {nft.style && (
                          <View className="absolute top-2 left-[-10px] bg-primary border-y-4 border-r-4 border-border px-3 py-1 shadow-brutal-sm z-10">
                            <Text className="text-background font-black text-[8px] uppercase">{nft.style}</Text>
                          </View>
                        )}
                        {nft.image ? (
                          <Image 
                            source={nft.image as any} 
                            style={{ width: '80%', height: '80%', resizeMode: 'contain' }} 
                          />
                        ) : (
                          <Text className="text-border font-black text-4xl opacity-50">?</Text>
                        )}
                      </View>
                      <View className="p-3 bg-secondary/30">
                        <Text className="text-border font-black text-sm uppercase" numberOfLines={1}>{nft.title}</Text>
                        <Text className="text-border text-xs font-bold mt-1 opacity-80">{nft.location}</Text>
                      </View>
                    </BrutalistCard>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>
      )}

      {/* 🔒 SECTION 4: STAMPAS POR DESBLOQUEAR CERCA DE TU ZONA (ONLY UNCLAIMED ONES!) */}
      {(activeFilter === 'all' || activeFilter === 'locked') && (
        <View className="mb-8">
          <View className="mb-3">
            <View className="flex-row items-center">
              <FontAwesome5 name="lock" size={18} color={colors.primary} className="mr-2" />
              <Text className="text-xl font-black text-border uppercase">{t('collections.locked_section_title')}</Text>
            </View>
            <Text className="text-border text-xs font-bold opacity-70 mt-1">
              {t('collections.locked_section_desc')}
            </Text>
          </View>

          {lockedStamps.length === 0 ? (
            <BrutalistCard colorClass="bg-accent2/20 mb-4 p-6 items-center" variant="info">
              <FontAwesome5 name="check-circle" size={32} color={colors.accent2} className="mb-2" />
              <Text className="text-border font-black text-lg uppercase mb-2 text-center">¡Álbum de Zona Completado!</Text>
              <Text className="text-border font-bold text-sm text-center">
                ¡Felicidades! Has obtenido todas las estampas disponibles en esta zona.
              </Text>
            </BrutalistCard>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {lockedStamps.map((stamp) => (
                <View key={stamp.id} className="w-[48%] mb-4">
                  <Pressable onPress={() => setSelectedLockedStamp(stamp)} className="active:scale-95 transition-transform">
                    <BrutalistCard colorClass="bg-background p-0 overflow-hidden opacity-95">
                      
                      {/* Locked Image Container */}
                      <View className="w-full h-32 bg-secondary/60 border-b-4 border-border justify-center items-center relative overflow-hidden p-2">
                        <Image 
                          source={stamp.image} 
                          style={{ width: '80%', height: '80%', opacity: 0.45, resizeMode: 'contain' }} 
                        />
                        
                        {/* Lock Overlay Badge */}
                        <View className="absolute inset-0 bg-black/40 justify-center items-center">
                          <View className="w-12 h-12 bg-primary border-2 border-border shadow-brutal-sm rounded-full justify-center items-center">
                            <FontAwesome5 name="lock" size={20} color="#FAF9F6" />
                          </View>
                        </View>

                        {/* Zone Badge */}
                        <View className="absolute top-2 left-2 bg-accent2 border border-border px-2 py-0.5 shadow-brutal-sm">
                          <Text className="text-border font-black text-[9px] uppercase">{stamp.zone}</Text>
                        </View>
                      </View>

                      {/* Info */}
                      <View className="p-3 bg-background">
                        <Text className="text-border font-black text-sm uppercase" numberOfLines={1}>{stamp.title}</Text>
                        <Text className="text-border text-[10px] font-bold opacity-70 mt-0.5" numberOfLines={1}>{stamp.location}</Text>
                        
                        <View className="mt-2 bg-secondary/30 p-2 border border-border flex-row justify-between items-center">
                          <Text className="text-primary font-black text-[9px] uppercase">Puntos:</Text>
                          <Text className="text-border font-black text-xs">+{stamp.rewardPoints} HZ</Text>
                        </View>
                      </View>
                    </BrutalistCard>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 🎒 SECTION 3: INVENTORY LOOT */}
      {(activeFilter === 'all' || activeFilter === 'inventory') && (
        <View className="mb-12">
          <Text className="text-xl font-black text-border mb-3 uppercase">{t('collections.my_inventory')}</Text>
          
          {nonNftInventory.length === 0 ? (
            <BrutalistCard variant="info" colorClass="bg-background p-6 items-center mb-6">
              <FontAwesome5 name="box-open" size={32} color={colors.border} className="mb-2" />
              <Text className="text-border font-black uppercase text-center text-lg mb-2">{t('collections.inventory_empty')}</Text>
              <Text className="text-border text-xs text-center font-bold">{t('collections.inventory_empty_desc')}</Text>
            </BrutalistCard>
          ) : (
            <View>
              {nonNftInventory.map(item => (
                <View key={item.id} className="mb-4">
                  <BrutalistCard colorClass="bg-background p-0 overflow-hidden flex-row" variant="info">
                     <View className={`${item.type === 'trash' ? 'bg-secondary/30' : item.type === 'coupon' ? 'bg-primary/30' : 'bg-accent2/30'} w-24 h-24 border-r-4 border-border justify-center items-center`}>
                       {item.image ? (
                         <Image source={item.image as any} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                       ) : (
                         <Text className="text-border font-black text-2xl uppercase">?</Text>
                       )}
                     </View>
                     <View className="flex-1 p-3 bg-background justify-center">
                       <View className="bg-accent1 self-start px-2 py-0.5 border-2 border-border shadow-brutal-sm mb-1">
                         <Text className="text-background font-black text-[8px] uppercase">{item.type}</Text>
                       </View>
                       <Text className="text-border font-black text-base uppercase" numberOfLines={1}>{item.name}</Text>
                       <Text className="text-border text-xs font-bold mt-1">{item.description}</Text>
                     </View>
                  </BrutalistCard>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Locked Stamp Unlock Instructions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedLockedStamp}
        onRequestClose={() => setSelectedLockedStamp(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          {selectedLockedStamp && (
            <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
              <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
                 <Text className="text-background font-black text-xl uppercase">{t('collections.locked_modal_title')}</Text>
                 <FontAwesome5 name="lock" size={24} color="#FAF9F6" />
              </View>

              <View className="p-4 items-center">
                <View className="w-40 h-40 bg-secondary/50 border-4 border-border shadow-brutal-sm justify-center items-center mb-4 relative overflow-hidden">
                  <Image source={selectedLockedStamp.image} style={{ width: 130, height: 130, resizeMode: 'contain', opacity: 0.6 }} />
                  <View className="absolute inset-0 bg-black/30 justify-center items-center">
                    <FontAwesome5 name="lock" size={36} color="#FAF9F6" />
                  </View>
                </View>

                <Text className="text-border font-black text-xl uppercase mb-1 text-center">{selectedLockedStamp.title}</Text>
                <Text className="text-border font-bold text-xs opacity-70 mb-4 text-center">{selectedLockedStamp.location}</Text>

                <View className="bg-secondary/30 p-4 border-2 border-border w-full mb-6">
                  <Text className="text-primary font-black text-xs uppercase mb-1">{t('collections.locked_hint_prefix')}</Text>
                  <Text className="text-border font-bold text-sm leading-relaxed">{selectedLockedStamp.hint}</Text>
                  
                  <View className="mt-3 pt-2 border-t border-border/20 flex-row justify-between items-center">
                    <Text className="text-border font-black text-xs uppercase">Recompensa al desbloquear:</Text>
                    <Text className="text-accent2 font-black text-sm">+{selectedLockedStamp.rewardPoints} HZ</Text>
                  </View>
                </View>

                <View className="w-full flex-row justify-between">
                  <View className="flex-1 mr-2">
                    <BrutalistButton 
                      title={t('collections.locked_modal_action')} 
                      colorClass="bg-accent2" 
                      onPress={() => {
                        setSelectedLockedStamp(null);
                        router.push('/(tabs)/scan');
                      }} 
                    />
                  </View>
                  <View className="w-24">
                    <BrutalistButton 
                      title={t('common.close')} 
                      colorClass="bg-primary" 
                      onPress={() => setSelectedLockedStamp(null)} 
                    />
                  </View>
                </View>
              </View>
            </BrutalistCard>
          )}
        </View>
      </Modal>

      {/* Modals */}
      <NftDetailModal 
        visible={!!selectedNft && !isTradeOfferVisible} 
        nft={selectedNft} 
        onClose={() => setSelectedNft(null)} 
        onTradePress={() => setTradeOfferVisible(true)}
      />

      <TradeOfferModal 
        visible={isTradeOfferVisible} 
        nft={selectedNft} 
        onClose={() => setTradeOfferVisible(false)} 
      />
      
      <PinataModal 
        visible={isPinataModalVisible} 
        onClose={() => setPinataModalVisible(false)} 
      />

    </ScrollView>
  );
}
