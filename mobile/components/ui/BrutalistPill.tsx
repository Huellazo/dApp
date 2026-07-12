import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BrutalistPillProps extends ViewProps {
  label: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

export function BrutalistPill({ 
  label, 
  colorClass = 'bg-background', 
  icon,
  className = '',
  ...props 
}: BrutalistPillProps) {
  return (
    <View 
      className={`border-2 border-border shadow-brutal-sm rounded-full px-3 py-1 flex-row items-center justify-center mr-2 mb-2 ${colorClass} ${className}`}
      {...props}
    >
      {icon && <View className="mr-1">{icon}</View>}
      <Text className="text-border font-bold text-xs uppercase tracking-wider">{label}</Text>
    </View>
  );
}
