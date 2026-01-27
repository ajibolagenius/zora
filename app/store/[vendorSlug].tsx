import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    useWindowDimensions,
    Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    MagnifyingGlass,
    ShoppingCart,
    ChatCircle,
    ShareNetwork,
    Star,
    Heart,
    Plus,
    SealCheck,
    MapPin,
    PencilSimple,
    CaretRight,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, TouchTarget } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing, ImageUrlBuilders, ValidationLimits } from '../../constants';
import { vendorService, productService, reviewService } from '../../services/supabaseService';
import type { Vendor, Product, Review } from '../../types/supabase';
import { Link } from 'expo-router';
import { useCartStore } from '../../stores/cartStore';
import FloatingTabBar from '../../components/ui/FloatingTabBar';
import { encodeProductSlug, isValidVendorSlug } from '../../lib/slugUtils';
import { isValidRouteParam } from '../../lib/navigationHelpers';
import NotFoundScreen from '../../components/errors/NotFoundScreen';

type TabType = 'products' | 'reviews' | 'about';

const MAX_BIO_LENGTH = ValidationLimits.maxBioLength;

export default function StoreScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { vendorSlug } = useLocalSearchParams<{ vendorSlug: string }>();
    const { width: screenWidth } = useWindowDimensions();
    const productCardWidth = (screenWidth - 48) / 2;
    const addToCart = useCartStore((state) => state.addItem);
    const cartItemCount = useCartStore((state) => state.getItemCount());

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [isFollowing, setIsFollowing] = useState(false);
    const [showFullBio, setShowFullBio] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const fetchData = useCallback(async () => {
        if (!vendorSlug) return;
        
        // Validate slug format
        if (!isValidRouteParam(vendorSlug, 'slug') || !isValidVendorSlug(vendorSlug)) {
            setLoading(false);
            return; // Will show NotFoundScreen
        }
        
        try {
            setLoading(true);
            // Use slug-based lookup
            const vendorData = await vendorService.getBySlug(vendorSlug);
            if (vendorData) {
                setVendor(vendorData);
                const vendorProducts = await productService.getByVendor(vendorData.id);
                setProducts(vendorProducts);
                // Fetch reviews for this vendor
                const vendorReviews = await reviewService.getByVendor(vendorData.id);
                setReviews(vendorReviews);
            }
        } catch (error) {
            console.error('Error fetching vendor:', error);
        } finally {
            setLoading(false);
        }
    }, [vendorSlug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!loading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: AnimationDuration.default,
                    easing: AnimationEasing.standard,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: AnimationDuration.default,
                    easing: AnimationEasing.standard,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [loading]);

    const handleReadMore = () => {
        setActiveTab('about');
    };

    const handleProductPress = (productId: string) => {
        // Encode product ID to slug for URL
        try {
            const productSlug = encodeProductSlug(productId);
            router.push(`/product/${productSlug}`);
        } catch (error) {
            console.error('Error encoding product slug:', error);
            // Fallback to ID if encoding fails
            router.push(`/product/${productId}`);
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: Array.isArray(product.image_urls) ? product.image_urls[0] : product.image_urls || '',
            vendor_id: product.vendor_id,
            category: product.category,
            rating: Number(product.rating),
            review_count: product.review_count,
            in_stock: (product.stock_quantity || 0) > 0,
        } as any, 1);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        );
    }

    if (!vendor) {
        return (
            <NotFoundScreen
                title="Store Not Found"
                message="This store doesn't exist or may have been removed. It might have been deleted or the link is incorrect."
                onBack={() => router.back()}
            />
        );
    }

    const vendorId = vendor.id;
    const shopName = (vendor as any).shop_name || (vendor as any).name || 'Store';

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Image (Shop Front) */}
                <View style={styles.headerImageContainer}>
                    <LazyImage
                        source={(vendor as any).cover_image_url || (vendor as any).cover_image || ''}
                        style={styles.headerImage}
                        contentFit="cover"
                        showLoader={false}
                    />
                    <View style={styles.headerOverlay} />

                    {/* Transparent Header */}
                    <SafeAreaView style={styles.header} edges={['top']}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerButton}>
                                <MagnifyingGlass size={20} color={Colors.textPrimary} weight="bold" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => router.push('/(tabs)/cart')}
                            >
                                <ShoppingCart size={20} color={Colors.textPrimary} weight="bold" />
                                {cartItemCount > 0 && <View style={styles.cartBadge} />}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Profile Section */}
                <Animated.View style={[
                    styles.profileSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    {/* Avatar overlapping header */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <LazyAvatar
                                source={(vendor as any).logo_url || ''}
                                size={80}
                                style={styles.avatar}
                            />
                        </View>
                    </View>

                    {/* Vendor Name */}
                    <View style={styles.vendorNameRow}>
                        <Text style={styles.vendorName}>{shopName}</Text>
                        {(vendor as any).is_verified && (
                            <View style={styles.verifiedBadgeInline}>
                                <SealCheck size={20} color="#3B82F6" weight="fill" />
                            </View>
                        )}
                    </View>

                    {/* Location and Rating */}
                    <View style={styles.vendorMeta}>
                        <MapPin size={14} color={Colors.textMuted} weight="regular" />
                        <Text style={styles.locationText}>
                            {((vendor as any).address || '').split(',')[0]}
                        </Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.verifiedText}>Verified Vendor</Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Star size={14} color={Colors.secondary} weight="fill" />
                        <Text style={styles.ratingValue}>
                            {Number((vendor as any).rating || 0).toFixed(1)}
                        </Text>
                        <Text style={styles.ratingCount}>
                            ({((vendor as any).review_count || 0) >= 1000 
                                ? `${((vendor as any).review_count / 1000).toFixed(1)}k` 
                                : (vendor as any).review_count || 0} reviews)
                        </Text>
                    </View>

                    {/* Bio with Read More */}
                    {(vendor as any).description && (
                        <View style={styles.bioContainer}>
                            <Text style={styles.bioText} numberOfLines={showFullBio ? undefined : 3}>
                                {(vendor as any).description}
                            </Text>
                            {(vendor as any).description.length > MAX_BIO_LENGTH && !showFullBio && (
                                <TouchableOpacity onPress={handleReadMore} activeOpacity={0.8}>
                                    <Text style={styles.readMoreText}>Read more</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Action Buttons Row */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.followButton, isFollowing && styles.followButtonActive]}
                            onPress={() => setIsFollowing(!isFollowing)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push(`/vendor/${vendorId}/chat`)}
                            activeOpacity={0.8}
                        >
                            <ChatCircle size={20} color={Colors.textPrimary} weight="duotone" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                            <ShareNetwork size={20} color={Colors.textPrimary} weight="duotone" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['products', 'reviews', 'about'] as TabType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tab}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive,
                            ]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                            {activeTab === tab && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Products Tab Content */}
                {activeTab === 'products' && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {/* Section Header */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Featured Products</Text>
                            <TouchableOpacity onPress={() => router.push(`/vendor/${vendorId}/products`)}>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Product Grid */}
                        <View style={styles.productGrid}>
                            {products.map((product) => {
                                const productImages = Array.isArray(product.image_urls) 
                                    ? product.image_urls 
                                    : [product.image_urls || ''];
                                
                                return (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={[styles.productCard, { width: productCardWidth }]}
                                        onPress={() => handleProductPress(product.id)}
                                        activeOpacity={0.95}
                                    >
                                        {/* Product Image */}
                                        <View style={styles.productImageContainer}>
                                            <LazyImage
                                                source={productImages[0]}
                                                style={styles.productImage}
                                                contentFit="cover"
                                                showLoader={false}
                                            />

                                            {/* Badge */}
                                            {(product as any).badge && (
                                                <View style={styles.productBadge}>
                                                    <Text style={styles.productBadgeText}>{(product as any).badge}</Text>
                                                </View>
                                            )}

                                            {/* Favorite Button */}
                                            <TouchableOpacity style={styles.favoriteButton}>
                                                <Heart size={16} color={Colors.textPrimary} weight="regular" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Product Info */}
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName} numberOfLines={1}>
                                                {product.name}
                                            </Text>
                                            <Text style={styles.productWeight}>{(product as any).weight || ''}</Text>
                                            <View style={styles.productFooter}>
                                                <Text style={styles.productPrice}>
                                                    £{Number(product.price).toFixed(2)}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.addButton}
                                                    onPress={() => handleAddToCart(product)}
                                                >
                                                    <Plus size={14} color={Colors.textPrimary} weight="bold" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                )}

                {/* Reviews Tab Content - Simplified for now */}
                {activeTab === 'reviews' && (
                    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                        <View style={styles.reviewsHeader}>
                            <View>
                                <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                                <View style={styles.reviewsRating}>
                                    <Star size={16} color={Colors.secondary} weight="fill" />
                                    <Text style={styles.reviewsRatingText}>
                                        {Number((vendor as any).rating || 0).toFixed(1)} ({reviews.length} reviews)
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {reviews.length === 0 && (
                            <View style={styles.noReviews}>
                                <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                            </View>
                        )}
                    </Animated.View>
                )}

                {/* About Tab Content - Simplified for now */}
                {activeTab === 'about' && (
                    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                        <View style={styles.aboutCard}>
                            <Text style={styles.aboutCardTitle}>About {shopName}</Text>
                            <Text style={styles.aboutCardText}>{(vendor as any).description || ''}</Text>
                        </View>
                    </Animated.View>
                )}

                {/* Bottom padding for tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Tab Bar */}
            <FloatingTabBar />
        </View>
    );
}

// Reuse styles from vendor route (simplified version)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: FontFamily.body,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    scrollView: {
        flex: 1,
    },
    headerImageContainer: {
        height: 200,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black30,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
    },
    headerButton: {
        width: TouchTarget.min,
        height: TouchTarget.min,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    cartBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    profileSection: {
        paddingHorizontal: Spacing.base,
        marginTop: -50,
        position: 'relative',
        zIndex: 10,
    },
    avatarContainer: {
        marginBottom: Spacing.md,
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Colors.backgroundDark,
        backgroundColor: Colors.cardDark,
    },
    vendorNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    verifiedBadgeInline: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vendorName: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h2,
        color: Colors.textPrimary,
        textAlign: 'left',
    },
    vendorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    locationText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    verifiedText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    metaDot: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.md,
    },
    ratingValue: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.secondary,
    },
    ratingCount: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    bioContainer: {
        marginBottom: Spacing.md,
    },
    bioText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    readMoreText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
        marginTop: Spacing.xs,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
        justifyContent: 'center',
    },
    followButton: {
        flex: 1,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followButtonActive: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    followButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    followButtonTextActive: {
        color: Colors.primary,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
        paddingBottom: Spacing.sm,
    },
    sectionTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    seeAllText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
        paddingHorizontal: Spacing.base,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        position: 'relative',
    },
    tabText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
    },
    tabTextActive: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.primary,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: 3,
        backgroundColor: Colors.primary,
        borderRadius: 1.5,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
        gap: Spacing.md,
    },
    productCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    productImageContainer: {
        aspectRatio: 1,
        width: '100%',
        position: 'relative',
        backgroundColor: Colors.backgroundDark,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productBadge: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
    },
    productBadgeText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    favoriteButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.black30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: Spacing.md,
    },
    productName: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    productWeight: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.sm,
    },
    productFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productPrice: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.secondary,
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    reviewsTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    reviewsRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    reviewsRatingText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    noReviews: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        gap: Spacing.md,
    },
    noReviewsText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    aboutCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
    },
    aboutCardTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    aboutCardText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        lineHeight: 22,
    },
});
