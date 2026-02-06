import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Plus, ShieldCheck } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadows, Gaps, ComponentDimensions } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { useWishlistStore } from '../../stores/wishlistStore';
import { LazyImage } from './LazyImage';
import { RatingDisplay } from './RatingDisplay';
import { PriceDisplay } from './PriceDisplay';
import { StatusBadge, BadgeType } from './StatusBadge';

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

    // Map badge string to BadgeType
    const getBadgeType = (badge: string): BadgeType => {
        switch (badge?.toUpperCase()) {
            case 'HOT':
                return 'hot';
            case 'POPULAR':
                return 'popular';
            case 'NEW':
                return 'new';
            case 'TOP RATED':
            case 'BESTSELLER':
                return 'bestseller';
            case 'ORGANIC':
                return 'organic';
            case 'VERIFIED':
                return 'verified';
            default:
                return 'custom';
        }
    };

    const hasDiscount = product.original_price && product.original_price > product.price;

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
                        <StatusBadge
                            type={getBadgeType(product.badge)}
                            label={product.badge}
                            size="small"
                        />
                    )}
                    {hasDiscount && (
                        <StatusBadge
                            type="discount"
                            label={`-${Math.round((1 - product.price / product.original_price!) * 100)}%`}
                            size="small"
                        />
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
                        <RatingDisplay
                            rating={product.rating}
                            reviewCount={product.review_count}
                            size="small"
                            variant="compact"
                        />
                    </View>
                )}

                <View style={styles.footer}>
                    <PriceDisplay
                        price={product.price}
                        originalPrice={hasDiscount ? product.original_price : undefined}
                        size="small"
                        showDiscount={false}
                    />
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

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        width: '100%',
        height: ComponentDimensions.card.productCardHeight,
        ...Shadows.card,
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
        height: ComponentDimensions.card.productCardImageHeight,
        backgroundColor: Colors.backgroundDark,
    },
    imageCompact: {
        height: 110,
    },
    badgeContainer: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        gap: Gaps.sm,
    },
    favoriteButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 32,
        height: 32,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
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
        marginBottom: Spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
