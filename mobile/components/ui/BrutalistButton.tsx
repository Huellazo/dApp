import React, { useState } from 'react';
import { Pressable, Text, View, PressableProps } from 'react-native';

interface BrutalistButtonProps extends PressableProps {
  title?: string;
  colorClass?: string; // e.g., 'bg-primary'
  children?: React.ReactNode;
}

export function BrutalistButton({ 
  title, 
  colorClass = 'bg-primary', 
  children,
  className = '',
  ...props 
}: BrutalistButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
    >
      <View 
        className={`border-4 border-border flex-row justify-center items-center px-6 py-3 ${colorClass} ${
          isPressed 
            ? 'translate-x-[4px] translate-y-[4px] shadow-none' 
            : 'shadow-brutal'
        } ${className}`}
      >
        {children ? children : (
          <Text className="text-border font-bold text-lg uppercase tracking-wider">{title}</Text>
        )}
      </View>
    </Pressable>
  );
}
