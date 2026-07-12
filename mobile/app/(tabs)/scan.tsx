import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function ScanScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-background pt-12 px-4 items-center justify-center">
      <BrutalistCard title="Camera Active" className="w-full h-96 justify-center items-center mb-8">
        <Text className="text-border font-bold uppercase text-lg text-center mb-4">
          [ Camera View ]
        </Text>
        <Text className="text-border text-center px-4">
          Point the camera at the physical QR code located at the monument or tourist area.
        </Text>
      </BrutalistCard>

      <BrutalistButton 
        title="Simulate QR Scan" 
        colorClass="bg-primary"
        onPress={() => setModalVisible(true)} 
      />

      {/* Brutalist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <BrutalistCard title="NFT Discovered!" colorClass="bg-secondary w-full max-w-sm">
            <Text className="text-border text-base mb-6">
              GPS successfully validated. You have received a new NFT and 50 $HUELLAZOS in your wallet.
            </Text>
            <BrutalistButton 
              title="Accept" 
              colorClass="bg-accent2" 
              onPress={() => setModalVisible(false)} 
            />
          </BrutalistCard>
        </View>
      </Modal>
    </View>
  );
}
