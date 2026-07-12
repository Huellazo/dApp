import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BrutalistCardProps extends ViewProps {
  title?: string;
  colorClass?: string;
  children: React.ReactNode;
}

export function BrutalistCard({ 
  title, 
  colorClass = 'bg-background', 
  children,
  className = '',
  ...props 
}: BrutalistCardProps) {
  return (
    <View 
      className={`border-4 border-border shadow-brutal p-4 ${colorClass} ${className}`}
      {...props}
    >
      {title && (
        <View className="border-b-4 border-border pb-2 mb-3">
          <Text className="text-border font-bold text-xl uppercase">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}
