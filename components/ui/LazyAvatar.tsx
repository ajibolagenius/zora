import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { Colors } from '../../constants/colors';
import { PlaceholderImages } from '../../constants/assets';
import { generateAvatarDataUrl } from '../../lib/avatarUtils';

interface LazyAvatarProps extends Omit<ImageProps, 'source'> {
  source?: string | { uri: string } | null;
  name?: string;
  userId?: string;
  size?: number;
  fallback?: string;
  /**
   * Loading strategy: 'eager' for above-the-fold avatars (headers, profile sections),
   * 'lazy' for below-the-fold avatars. Maps to expo-image priority prop.
   */
  loading?: 'eager' | 'lazy';
}

/**
 * LazyAvatar Component
 * Optimized avatar component with lazy loading and fallback to generated avatar
 */
export const LazyAvatar: React.FC<LazyAvatarProps> = ({
  source,
  name,
  userId,
  size = 40,
  fallback,
  loading,
  style,
  ...props
}) => {
  // Normalize source
  const imageUri = typeof source === 'string' 
    ? source 
    : source?.uri;

  // Generate fallback avatar if name is provided
  const fallbackUri = fallback || 
    (name ? generateAvatarDataUrl(name, userId, size) : null) ||
    PlaceholderImages.userAvatar;

  // Map loading prop to expo-image priority: eager -> high, lazy -> low, default -> normal
  const imagePriority = props.priority || 
    (loading === 'eager' ? 'high' : loading === 'lazy' ? 'low' : 'normal');

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Image
        source={imageUri || fallbackUri}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        contentFit="cover"
        placeholder={fallbackUri}
        transition={200}
        cachePolicy="memory-disk"
        priority={imagePriority}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.cardDark,
  },
});
