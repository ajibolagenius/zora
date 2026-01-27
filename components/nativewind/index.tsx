/**
 * NativeWind UI Components
 * 
 * Pre-styled components using NativeWind/Tailwind CSS classes
 * that match the Zora African Market design system.
 * 
 * Usage:
 * import { ZoraButton, ZoraCard, ZoraText } from '@/components/nativewind';
 */

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import type { ViewProps, TextProps, TouchableOpacityProps, TextInputProps, ImageProps } from 'react-native';

// ============== Button Components ==============

interface ZoraButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function ZoraButton({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children, 
  className = '',
  disabled,
  ...props 
}: ZoraButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-full';
  
  const variantClasses = {
    primary: 'bg-zora-red',
    secondary: 'bg-card-dark',
    outline: 'bg-transparent border-2 border-zora-red',
    ghost: 'bg-transparent',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };
  
  const textClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-zora-red font-semibold',
    ghost: 'text-zora-red font-semibold',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-body',
    lg: 'text-body-lg',
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#CC0000'} />
      ) : (
        <Text className={`${textClasses[variant]} ${textSizeClasses[size]}`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ============== Card Components ==============

interface ZoraCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

export function ZoraCard({ 
  variant = 'default', 
  children, 
  className = '',
  ...props 
}: ZoraCardProps) {
  const baseClasses = 'rounded-xl p-4';
  
  const variantClasses = {
    default: 'bg-card-dark',
    elevated: 'bg-card-dark shadow-lg',
    outlined: 'bg-transparent border border-white/10',
  };

  return (
    <View className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </View>
  );
}

// ============== Text Components ==============

interface ZoraTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLg' | 'sm' | 'caption' | 'tiny';
  color?: 'primary' | 'secondary' | 'muted' | 'red' | 'yellow' | 'success';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

export function ZoraText({ 
  variant = 'body', 
  color = 'primary',
  weight,
  children, 
  className = '',
  ...props 
}: ZoraTextProps) {
  const variantClasses = {
    display: 'text-display',
    h1: 'text-h1 font-bold',
    h2: 'text-h2 font-bold',
    h3: 'text-h3 font-semibold',
    h4: 'text-h4 font-semibold',
    body: 'text-body',
    bodyLg: 'text-body-lg',
    sm: 'text-sm',
    caption: 'text-caption',
    tiny: 'text-tiny',
  };
  
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    red: 'text-zora-red',
    yellow: 'text-zora-yellow',
    success: 'text-success',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Text 
      className={`${variantClasses[variant]} ${colorClasses[color]} ${weight ? weightClasses[weight] : ''} ${className}`} 
      {...props}
    >
      {children}
    </Text>
  );
}

// ============== Input Components ==============

interface ZoraInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function ZoraInput({ 
  label, 
  error, 
  className = '',
  ...props 
}: ZoraInputProps) {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-sm text-text-muted font-medium">{label}</Text>
      )}
      <TextInput
        className={`bg-card-dark rounded-xl px-4 py-3 text-white text-body border ${error ? 'border-error' : 'border-white/10'} ${className}`}
        placeholderTextColor="rgba(255,255,255,0.3)"
        {...props}
        onBlur={(e) => {
          const { Keyboard } = require('react-native');
          Keyboard.dismiss();
          props.onBlur?.(e);
        }}
      />
      {error && (
        <Text className="text-caption text-error">{error}</Text>
      )}
    </View>
  );
}

// ============== Badge Components ==============

interface ZoraBadgeProps extends ViewProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export function ZoraBadge({ 
  variant = 'default', 
  children, 
  className = '',
  ...props 
}: ZoraBadgeProps) {
  const variantClasses = {
    default: 'bg-zora-red/20',
    success: 'bg-success/20',
    warning: 'bg-warning/20',
    error: 'bg-error/20',
    info: 'bg-info/20',
  };
  
  const textClasses = {
    default: 'text-zora-red',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };

  return (
    <View className={`px-3 py-1 rounded-full ${variantClasses[variant]} ${className}`} {...props}>
      <Text className={`text-tiny font-semibold ${textClasses[variant]}`}>
        {children}
      </Text>
    </View>
  );
}

// ============== Avatar Components ==============

interface ZoraAvatarProps extends Omit<ImageProps, 'source'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source: { uri: string };
}

export function ZoraAvatar({ 
  size = 'md', 
  source, 
  className = '',
  ...props 
}: ZoraAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <Image
      source={source}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

// ============== Divider Component ==============

interface ZoraDividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

export function ZoraDivider({ 
  orientation = 'horizontal', 
  className = '',
  ...props 
}: ZoraDividerProps) {
  const orientationClasses = {
    horizontal: 'h-px w-full',
    vertical: 'w-px h-full',
  };

  return (
    <View 
      className={`bg-white/10 ${orientationClasses[orientation]} ${className}`} 
      {...props} 
    />
  );
}

// ============== Container Components ==============

interface ZoraContainerProps extends ViewProps {
  children: React.ReactNode;
}

export function ZoraContainer({ 
  children, 
  className = '',
  ...props 
}: ZoraContainerProps) {
  return (
    <View className={`flex-1 bg-bg-dark ${className}`} {...props}>
      {children}
    </View>
  );
}

// ============== Row & Column Layout ==============

interface ZoraRowProps extends ViewProps {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  children: React.ReactNode;
}

export function ZoraRow({ 
  gap = 'md', 
  align = 'center',
  justify = 'start',
  children, 
  className = '',
  ...props 
}: ZoraRowProps) {
  const gapClasses = {
    none: '',
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    lg: 'gap-lg',
    xl: 'gap-xl',
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <View 
      className={`flex-row ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}

interface ZoraColumnProps extends ViewProps {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: React.ReactNode;
}

export function ZoraColumn({ 
  gap = 'md', 
  align = 'stretch',
  children, 
  className = '',
  ...props 
}: ZoraColumnProps) {
  const gapClasses = {
    none: '',
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    lg: 'gap-lg',
    xl: 'gap-xl',
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <View 
      className={`flex-col ${gapClasses[gap]} ${alignClasses[align]} ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}

// Export all components
export default {
  Button: ZoraButton,
  Card: ZoraCard,
  Text: ZoraText,
  Input: ZoraInput,
  Badge: ZoraBadge,
  Avatar: ZoraAvatar,
  Divider: ZoraDivider,
  Container: ZoraContainer,
  Row: ZoraRow,
  Column: ZoraColumn,
};
