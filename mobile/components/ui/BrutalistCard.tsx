import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BrutalistCardProps extends ViewProps {
  title?: string;
  colorClass?: string;
  variant?: 'action' | 'info';
  children: React.ReactNode;
}

export function BrutalistCard({ 
  title, 
  colorClass = 'bg-background', 
  variant = 'action',
  children,
  className = '',
  ...props 
}: BrutalistCardProps) {
  const shadowClass = variant === 'info' ? '' : 'shadow-brutal';
  const borderClass = variant === 'info' ? 'border-2 border-border' : 'border-4 border-border';

  return (
    <View 
      className={`${borderClass} ${shadowClass} p-4 ${colorClass} ${className}`}
      {...props}
    >
      {title && (
        <View className="border-b-2 border-border pb-2 mb-3">
          <Text className="text-border font-black text-xl uppercase">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}
