import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

// Map of common icon names to Phosphor icon components
const phosphorIconMap: Record<string, keyof typeof PhosphorIcons> = {
  // Navigation
  'home': 'House',
  'home-outline': 'House',
  'explore': 'Compass',
  'compass': 'Compass',
  'compass-outline': 'Compass',
  'orders': 'ClipboardText',
  'clipboard-text': 'ClipboardText',
  'clipboard-text-outline': 'ClipboardText',
  'cart': 'ShoppingCart',
  'cart-outline': 'ShoppingCart',
  'profile': 'User',
  'account': 'User',
  'account-outline': 'User',
  
  // Common Actions
  'search': 'MagnifyingGlass',
  'magnify': 'MagnifyingGlass',
  'filter': 'Funnel',
  'tune': 'Sliders',
  'plus': 'Plus',
  'minus': 'Minus',
  'close': 'X',
  'check': 'Check',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'chevron-down': 'CaretDown',
  'chevron-up': 'CaretUp',
  'chevron-left': 'CaretLeft',
  'chevron-right': 'CaretRight',
  
  // Features
  'heart': 'Heart',
  'heart-outline': 'Heart',
  'star': 'Star',
  'star-outline': 'Star',
  'bell': 'Bell',
  'bell-outline': 'Bell',
  'map-marker': 'MapPin',
  'location': 'MapPin',
  'clock': 'Clock',
  'clock-outline': 'Clock',
  'truck-delivery': 'Truck',
  'truck-delivery-outline': 'Truck',
  'qrcode': 'QrCode',
  'qrcode-scan': 'QrCode',
  
  // Products & Shopping
  'basket': 'Basket',
  'bag': 'Bag',
  'tag': 'Tag',
  'percent': 'Percent',
  'gift': 'Gift',
  'package': 'Package',
  'receipt': 'Receipt',
  'credit-card': 'CreditCard',
  'wallet': 'Wallet',
  
  // User & Settings
  'settings': 'Gear',
  'cog': 'Gear',
  'logout': 'SignOut',
  'login': 'SignIn',
  'email': 'Envelope',
  'email-outline': 'Envelope',
  'lock': 'Lock',
  'lock-outline': 'Lock',
  'eye': 'Eye',
  'eye-outline': 'Eye',
  'eye-off': 'EyeSlash',
  'eye-off-outline': 'EyeSlash',
  
  // Social
  'google': 'GoogleLogo',
  'apple': 'AppleLogo',
  'facebook': 'FacebookLogo',
  'share': 'ShareNetwork',
  
  // Categories
  'food': 'CookingPot',
  'pot-steam': 'CookingPot',
  'leaf': 'Leaf',
  'coffee': 'Coffee',
  'tshirt-crew': 'TShirt',
  'palette': 'Palette',
  'flower': 'Flower',
  'fire': 'Fire',
  'diamond-stone': 'Diamond',
  
  // Misc
  'information': 'Info',
  'help-circle': 'Question',
  'phone': 'Phone',
  'camera': 'Camera',
  'image': 'Image',
  'trash': 'Trash',
  'pencil': 'Pencil',
  'edit': 'PencilSimple',
  'crosshairs-gps': 'Crosshair',
};

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
  const phosphorName = phosphorIconMap[name] || phosphorIconMap[name.replace('-outline', '')];
  
  if (phosphorName && PhosphorIcons[phosphorName]) {
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
