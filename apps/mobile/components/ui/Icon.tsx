import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

import { PHOSPHOR_ICON_MAP } from '@zora/shared';
// ... (imports)

// Map of common icon names to Phosphor icon components
// Moved to @zora/shared

type IconWeight = 'duotone' | 'regular' | 'bold' | 'fill' | 'light' | 'thin';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  weight?: IconWeight;
  focused?: boolean;
  style?: any;
}

/**
 * Icon Component - Zora Design System
 * 
 * Uses Phosphor Icons (Duotone) as primary library
 * Falls back to MaterialCommunityIcons for unsupported icons
 * 
 * @param name - Icon name (uses mapping to convert common names)
 * @param size - Icon size (default: 24)
 * @param color - Icon color (default: textPrimary)
 * @param weight - Phosphor icon weight (default: 'duotone')
 * @param focused - If true, uses 'fill' weight for focused state
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.textPrimary,
  weight = 'duotone',
  focused = false,
  style,
}) => {
  // Determine the icon weight based on focused state
  const iconWeight: IconWeight = focused ? 'fill' : weight;

  // Check if we have a Phosphor mapping for this icon
  const phosphorName = PHOSPHOR_ICON_MAP[name] || PHOSPHOR_ICON_MAP[name.replace('-outline', '')];

  if (phosphorName && PhosphorIcons[phosphorName]) {
    // eslint-disable-next-line import/namespace
    const PhosphorIcon = PhosphorIcons[phosphorName] as React.ComponentType<any>;
    return (
      <View style={style}>
        <PhosphorIcon
          size={size}
          color={color}
          weight={iconWeight}
        />
      </View>
    );
  }

  // Fallback to MaterialCommunityIcons
  return (
    <View style={style}>
      <MaterialCommunityIcons
        name={name as any}
        size={size}
        color={color}
      />
    </View>
  );
};

// Pre-configured icon variants for common use cases
export const TabIcon: React.FC<Omit<IconProps, 'weight'> & { focused: boolean }> = (props) => (
  <Icon {...props} weight={props.focused ? 'fill' : 'duotone'} />
);

export const ActionIcon: React.FC<Omit<IconProps, 'weight'>> = (props) => (
  <Icon {...props} weight="bold" />
);

export const OutlineIcon: React.FC<Omit<IconProps, 'weight'>> = (props) => (
  <Icon {...props} weight="regular" />
);

export default Icon;
