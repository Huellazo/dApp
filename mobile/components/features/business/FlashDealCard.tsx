import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { useAppState } from '@/context/app-state';
import { useLanguage } from '@/context/language-context';

export function FlashDealCard({ deal }: { deal: any }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { burnTokens } = useAppState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | null>(null);

  if (!deal) return null;

  const handleClaim = () => {
    const success = burnTokens(deal.costHZ, `Flash Deal: ${deal.title}`);
    if (success) {
      setModalType('success');
    } else {
      setModalType('error');
    }
    setModalVisible(true);
  };

  return (
    <View className="mb-8 relative">
       {/* Background offset for brutalist pop */}
       <View className="absolute inset-0 bg-border translate-x-2 translate-y-2" />
       
       <View className="bg-accent2/40 border-4 border-border p-4">
         <View className="flex-row justify-between items-start mb-2">
           <View className="bg-background px-2 py-1 border-2 border-border shadow-brutal-sm flex-row items-center">
             <FontAwesome5 name="bolt" solid size={12} color={colors.accent1} />
             <Text className="text-border font-black text-xs uppercase ml-1">{t('business.flash_deal')}</Text>
           </View>
           <View className="bg-primary px-2 py-1 border-2 border-border shadow-brutal-sm flex-row items-center">
             <FontAwesome5 name="clock" solid size={12} color="#FAF9F6" />
             <Text className="text-background font-black text-xs uppercase ml-1">{deal.expiresIn}</Text>
           </View>
         </View>

         <Text className="text-border font-black text-3xl uppercase tracking-tight leading-none mt-2 mb-1">
           {deal.discount}
         </Text>
         <Text className="text-border font-bold text-lg mb-2">
           {deal.title} - {deal.businessName}
         </Text>

         <View className="flex-row items-center justify-between mt-2 border-t-4 border-border pt-3">
           <View className="flex-row items-center">
             <Text className="text-border font-black uppercase text-xs mr-2">{t('business.cost')}</Text>
             <Text className="bg-background px-2 py-1 border-2 border-border font-black text-border">{deal.costHZ} HZ</Text>
           </View>
           <BrutalistButton 
             title={t('business.claim_now')} 
             colorClass="bg-primary" 
             onPress={handleClaim} 
             style={{ paddingVertical: 8, paddingHorizontal: 16 }}
           />
         </View>
       </View>

       <Modal
         animationType="fade"
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}
       >
         <View className="flex-1 justify-center items-center bg-black/60 px-4">
           <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
              <View className={`${modalType === 'success' ? 'bg-accent2' : 'bg-primary'} p-4 border-b-4 border-border flex-row justify-between items-center`}>
                 <Text className="text-border font-black text-xl uppercase">
                   {modalType === 'success' ? t('business.deal_claimed') : t('business.not_enough_funds')}
                 </Text>
                 <FontAwesome5 name={modalType === 'success' ? 'ticket-alt' : 'exclamation-circle'} size={24} color={colors.border} />
              </View>
              
              <View className="p-4">
                 <Text className="text-border text-base mb-6 font-bold text-center">
                   {modalType === 'success' 
                     ? t('business.deal_success_desc', { cost: deal.costHZ, discount: deal.discount, businessName: deal.businessName })
                     : t('business.deal_error_desc')}
                 </Text>
                 
                 <View className="flex-row">
                   <View className="flex-1">
                     <BrutalistButton 
                       title={t('common.okay')} 
                       colorClass="bg-secondary" 
                       onPress={() => setModalVisible(false)} 
                     />
                   </View>
                   {modalType === 'success' && (
                     <View className="flex-1 ml-2">
                       <BrutalistButton 
                         title={t('business.view_biz')} 
                         colorClass="bg-accent1" 
                         onPress={() => {
                           setModalVisible(false);
                           router.push(`/business/${deal.businessId}`);
                         }} 
                       />
                     </View>
                   )}
                 </View>
              </View>
           </BrutalistCard>
         </View>
       </Modal>
    </View>
  );
}
