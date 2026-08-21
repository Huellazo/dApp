import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, Pressable, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { colors } from '@/theme/colors';
import { useAppState, LootItem } from '@/context/app-state';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function PinataModal({ visible, onClose }: Props) {
  const { openPinata, points } = useAppState();
  const [hits, setHits] = useState(0);
  const [state, setState] = useState<'idle' | 'breaking' | 'broken'>('idle');
  const [loot, setLoot] = useState<LootItem | null>(null);
  
  useEffect(() => {
    if (visible) {
      setHits(0);
      setState('idle');
      setLoot(null);
    }
  }, [visible]);

  const handleHit = () => {
    if (state !== 'idle') return;
    
    if (points < 100) {
      Alert.alert("Atención", "¡No tienes suficientes Puntos Huellazos acumulados para romper la piñata!");
      onClose();
      return;
    }

    const newHits = hits + 1;
    setHits(newHits);
    
    if (newHits >= 3) {
      setState('breaking');
      
      const newLoot = openPinata();
      if (!newLoot) {
        onClose();
        return;
      }
      
      setLoot(newLoot);
      setState('broken');
    }
  };
  
  const getShakeClass = () => {
    if (hits === 1) return 'rotate-3 scale-105';
    if (hits === 2) return '-rotate-6 scale-110';
    return '';
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center px-4">
        {state === 'idle' && (
          <View className="items-center">
            <Text className="text-white font-black text-3xl uppercase mb-2">¡Toca 3 Veces la Piñata!</Text>
            <Text className="text-white font-bold mb-8 text-center bg-primary px-4 py-2 border-2 border-border shadow-brutal-sm">
              Costo: 100 Puntos Huellazos
            </Text>
            
            <Pressable onPress={handleHit} className={`active:opacity-80 transition-transform ${getShakeClass()}`}>
              <Image 
                source={require('@/assets/images/pinata_intact_1783886291640.png')} 
                style={{ width: 250, height: 250, resizeMode: 'contain' }}
              />
            </Pressable>
            
            <View className="mt-12">
              <BrutalistButton title="Cancelar" colorClass="bg-secondary" onPress={onClose} />
            </View>
          </View>
        )}

        {state === 'broken' && loot && (
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
            <View className="bg-accent2 p-4 border-b-4 border-border flex-row justify-between items-center">
               <Text className="text-background font-black text-xl uppercase">¡PIÑATA ROTA!</Text>
               <FontAwesome5 name="star" size={24} color="#FAF9F6" />
            </View>
            
            <View className="p-4 items-center">
               <Image 
                 source={require('@/assets/images/pinata_broken_1783886298855.png')} 
                 style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 16 }}
               />

               <Text className="text-border font-black text-xl uppercase mb-2">¡Ganaste este premio!</Text>
               
               <View className="bg-secondary p-4 border-4 border-border shadow-brutal-sm flex-row items-center w-full mb-6">
                 {loot.image ? (
                   <Image source={loot.image as any} style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 12 }} />
                 ) : (
                   <View className="w-10 h-10 bg-primary border-2 border-border justify-center items-center mr-3">
                     <FontAwesome5 name="coins" size={20} color={colors.border} />
                   </View>
                 )}
                 <View className="flex-1">
                   <Text className="text-border font-black uppercase">{loot.name}</Text>
                   <Text className="text-border text-xs font-bold">{loot.description}</Text>
                 </View>
               </View>

               <View className="w-full">
                 <BrutalistButton title="GUARDAR MI PREMIO" colorClass="bg-accent1" onPress={onClose} />
               </View>
            </View>
          </BrutalistCard>
        )}
      </View>
    </Modal>
  );
}
