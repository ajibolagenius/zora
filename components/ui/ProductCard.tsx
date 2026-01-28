import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Plus, Star, ShieldCheck } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { useWishlistStore } from '../../stores/wishlistStore';
import { LazyImage } from './LazyImage';

// Updated Product interface for mock database
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  unit_price_label?: string;
  stock_quantity?: number;
  category?: string;
  cultural_region?: string;
  region?: string;
  image_urls?: string[];
  image_url?: string;
  weight?: string;
  certifications?: string[];
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  heritage_story?: string;
  is_active?: boolean;
  is_featured?: boolean;
  badge?: string | null;
  rating: number;
  review_count: number;
  vendor_id?: string;
  in_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onPress,
  onAddToCart,
  compact = false,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  // Normalize image_url for both old and new schemas
  const imageUrl = product.image_urls?.[0] || product.image_url || '';
  const region = product.cultural_region || product.region;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Prevent triggering onPress
    toggleWishlist(product as any);
  };

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
      case 'VERIFIED':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <LazyImage
          source={imageUrl}
          style={[styles.image, compact && styles.imageCompact]}
          contentFit="cover"
          showLoader={false}
          priority={product.is_featured ? 'high' : 'normal'}
          cachePolicy="memory-disk"
        />
        
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {product.badge && (
            <View style={[styles.badge, { backgroundColor: getBadgeColor(product.badge) }]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={[styles.badge, styles.discountBadge]}>
              <Text style={styles.badgeText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <Heart 
            size={18} 
            color={isFavorite ? Colors.primary : Colors.textPrimary} 
            weight={isFavorite ? 'fill' : 'duotone'} 
          />
        </TouchableOpacity>

        {/* Trust Badge */}
        {product.certifications && product.certifications.length > 0 && (
          <View style={styles.trustBadge}>
            <ShieldCheck size={14} color={Colors.success} weight="fill" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        {/* Region Tag */}
        {region && (
          <Text style={styles.regionTag}>{region.replace('-', ' ')}</Text>
        )}
        
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        {product.weight && (
          <Text style={styles.weight}>{product.weight}</Text>
        )}

        {/* Rating */}
        {product.rating > 0 && (
          <View style={styles.ratingContainer}>
            <Star size={12} color={Colors.rating} weight="fill" />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            {product.review_count > 0 && (
              <Text style={styles.reviewCount}>({product.review_count})</Text>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>£{product.original_price?.toFixed(2)}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <Plus size={18} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.image_urls?.[0] === nextProps.product.image_urls?.[0] &&
    prevProps.compact === nextProps.compact
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: '100%',
    height: 280, // Fixed height for uniform appearance
    ...Shadows.md,
  },
  containerCompact: {
    maxWidth: 140,
    height: 240, // Slightly smaller for compact variant
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.backgroundDark,
  },
  imageCompact: {
    height: 110,
  },
  badgeContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    gap: 4,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  discountBadge: {
    backgroundColor: Colors.success,
  },
  badgeText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  trustBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  regionTag: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
    fontSize: FontSize.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    marginBottom: 2,
    minHeight: 36, // Fixed height for 2 lines (18px * 2)
    maxHeight: 36,
  },
  weight: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  rating: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.rating,
    fontSize: FontSize.caption,
  },
  reviewCount: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  price: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.secondary,
    fontSize: FontSize.body,
  },
  originalPrice: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    textDecorationLine: 'line-through',
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
