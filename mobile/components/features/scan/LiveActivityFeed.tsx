import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

const MOCK_EVENTS = [
  { action: 'minted', item: 'Taco Al Pastor Stamp', user: '0x8F2...4aA' },
  { action: 'found', item: '50 $HUELLAZOS at Chapultepec', user: '0x1B9...eC2' },
  { action: 'traded', item: 'Lucha Libre for Axolotl', user: '0x99D...zP1' },
  { action: 'minted', item: 'Teotihuacan Visit Token', user: '0x3F4...119' },
  { action: 'found', item: 'Chromatic Quetzal', user: '0xAA1...b00' },
  { action: 'burned', item: '100 $HUELLAZOS to Overclock', user: '0x7C2...aE1' },
];

export function LiveActivityFeed() {
  const [events, setEvents] = useState(MOCK_EVENTS.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
        return [newEvent, prev[0], prev[1]];
      });
    }, 4000); // Shift events every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <BrutalistCard colorClass="bg-secondary p-0 overflow-hidden mb-4">
      <View className="bg-primary p-2 border-b-4 border-border flex-row items-center">
         <FontAwesome5 name="satellite-dish" size={14} color={colors.border} className="mr-2" />
         <Text className="text-border font-black text-xs uppercase tracking-widest">Local Node Feed</Text>
      </View>
      <View className="p-2 h-24 justify-around bg-background">
        {events.map((ev, idx) => (
          <View key={idx} className="flex-row items-center opacity-80">
            <Text className="text-primary font-black text-[10px] mr-2">[{ev.user}]</Text>
            <Text className="text-border font-bold text-xs flex-1 truncate" numberOfLines={1}>
              {ev.action} <Text className="font-black">{ev.item}</Text>
            </Text>
          </View>
        ))}
      </View>
    </BrutalistCard>
  );
}
