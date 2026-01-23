import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Product } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  compact = false,
}) => {
  const getBadgeColor = (badge: string) => {
    switch (badge?.toUpperCase()) {
      case 'HOT':
      case 'POPULAR':
        return Colors.badgeHot;
      case 'NEW':
        return Colors.badgeNew;
      case 'TOP RATED':
      case 'BESTSELLER':
        return Colors.badgeTopRated;
      case 'ORGANIC':
        return Colors.badgeOrganic;
      default:
        return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={[styles.image, compact && styles.imageCompact]}
          resizeMode="cover"
        />
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: getBadgeColor(product.badge) }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialCommunityIcons name="heart-outline" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.weight && (
          <Text style={styles.weight}>{product.weight}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <MaterialCommunityIcons name="plus" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: 160,
    ...Shadows.md,
  },
  containerCompact: {
    width: 140,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.backgroundDark,
  },
  imageCompact: {
    height: 120,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  weight: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: Colors.secondary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;
