import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { colors } from '@/theme/colors';
import { MOCK_POIS } from '@/mocks/db';

export default function ScanScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<any>(null);

  // Static mock positions for the "PokeStops" around the center
  const mapPoints = MOCK_POIS.slice(0, 5).map((poi, idx) => ({
    ...poi,
    // Distribute them around the center (0 to 100%)
    top: `${15 + (idx * 37) % 70}%`,
    left: `${10 + (idx * 43) % 75}%`,
  }));

  const handlePoiClick = (poi: any) => {
    setSelectedPoi(poi);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-background pt-12">
      <Text className="text-3xl font-black text-border px-4 mb-2 uppercase tracking-tight">Huellazo Radar</Text>
      <Text className="text-border px-4 mb-4 font-bold text-sm">Find footprints near you.</Text>

      {/* Static Map Area */}
      <View className="flex-1 border-y-4 border-border bg-secondary relative overflow-hidden justify-center items-center">
        
        {/* Background Grid Pattern (Neo-brutalist touch) */}
        <View style={StyleSheet.absoluteFillObject} className="opacity-20">
           {/* Simple lines to simulate a map grid */}
           <View className="absolute top-1/4 w-full h-1 bg-border" />
           <View className="absolute top-2/4 w-full h-1 bg-border" />
           <View className="absolute top-3/4 w-full h-1 bg-border" />
           <View className="absolute left-1/4 h-full w-1 bg-border" />
           <View className="absolute left-2/4 h-full w-1 bg-border" />
           <View className="absolute left-3/4 h-full w-1 bg-border" />
        </View>

        {/* User Radar Radius */}
        <View className="w-64 h-64 rounded-full border-4 border-border bg-background/50 absolute justify-center items-center">
           <View className="w-48 h-48 rounded-full border-2 border-border border-dashed opacity-50 absolute" />
        </View>

        {/* User Center Avatar */}
        <View className="w-12 h-12 bg-primary rounded-full border-4 border-border shadow-brutal-sm justify-center items-center z-20">
          <FontAwesome5 name="street-view" size={20} color={colors.border} />
        </View>

        {/* POI 'PokeStops' */}
        {mapPoints.map(poi => (
          <Pressable 
            key={poi.id}
            onPress={() => handlePoiClick(poi)}
            className="absolute z-10 active:opacity-50 items-center justify-center"
            style={{ top: poi.top, left: poi.left }}
          >
            <View className={`w-10 h-10 ${poi.category === 'tourism' ? 'bg-accent1' : 'bg-accent2'} rounded-full border-4 border-border shadow-brutal-sm justify-center items-center`}>
              <FontAwesome5 name={poi.category === 'tourism' ? 'monument' : 'store'} size={14} color={colors.border} />
            </View>
            <View className="bg-background border-2 border-border mt-1 px-1">
               <Text className="text-border font-bold text-[10px] uppercase">{poi.distanceKm}km</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Bottom Action Area */}
      <View className="p-4 pb-24 bg-background">
        <BrutalistButton 
          title="SCAN QR CODE" 
          colorClass="bg-accent2"
          onPress={() => {
            setSelectedPoi(null);
            setModalVisible(true);
          }} 
        />
      </View>

      {/* Brutalist Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <BrutalistCard colorClass="bg-background w-full max-w-sm p-0 overflow-hidden">
             <View className="bg-primary p-4 border-b-4 border-border flex-row justify-between items-center">
                <Text className="text-border font-black text-xl uppercase">Footprint Found!</Text>
                <FontAwesome5 name="qrcode" size={24} color={colors.border} />
             </View>
             
             <View className="p-4">
                <Text className="text-border text-base mb-6 font-bold">
                  {selectedPoi 
                    ? `You have arrived at ${selectedPoi.name}. Scan the physical code at the location to claim your reward.`
                    : 'Point the camera at the physical QR code of the monument or business to validate it.'}
                </Text>
                
                <View className="bg-secondary p-3 border-4 border-border shadow-brutal-sm mb-6 flex-row items-center">
                   <FontAwesome5 name="coins" size={20} color={colors.border} />
                   <Text className="text-border font-black ml-3">Reward: 50 $HUELLAZOS</Text>
                </View>

                <BrutalistButton 
                  title="Simulate Scan" 
                  colorClass="bg-accent1" 
                  onPress={() => setModalVisible(false)} 
                />
             </View>
          </BrutalistCard>
        </View>
      </Modal>
    </View>
  );
}
