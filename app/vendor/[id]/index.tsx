import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import { LazyImage, LazyAvatar } from '../../../components/ui';
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
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius, TouchTarget } from '../../../constants/spacing';
import { FontSize, FontWeight, FontFamily } from '../../../constants/typography';
import { AnimationDuration, AnimationEasing, ImageUrlBuilders, ValidationLimits } from '../../../constants';
import { vendorService, productService, reviewService, type Vendor, type Product, type Review } from '../../../services/mockDataService';
import { Link } from 'expo-router';
import { useCartStore } from '../../../stores/cartStore';
import FloatingTabBar from '../../../components/ui/FloatingTabBar';
import { getProductRoute } from '../../../lib/navigationHelpers';
import NotFoundScreen from '../../../components/errors/NotFoundScreen';

type TabType = 'products' | 'reviews' | 'about';

const MAX_BIO_LENGTH = ValidationLimits.maxBioLength;

export default function VendorScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
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

    const fetchData = useCallback(() => {
        if (!id) return;
        try {
            const vendorData = vendorService.getById(id);
            if (vendorData) {
                setVendor(vendorData);
                const vendorProducts = productService.getByVendor(vendorData.id);
                setProducts(vendorProducts);
                // Fetch reviews for this vendor
                const vendorReviews = reviewService.getByVendor(vendorData.id);
                setReviews(vendorReviews);
            } else {
                const allVendors = vendorService.getAll();
                if (allVendors.length > 0) {
                    setVendor(allVendors[0]);
                    setProducts(productService.getByVendor(allVendors[0].id));
                    const vendorReviews = reviewService.getByVendor(allVendors[0].id);
                    setReviews(vendorReviews);
                }
            }
        } catch (error) {
            console.error('Error fetching vendor:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

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
        router.push(getProductRoute(productId));
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_urls[0],
            vendor_id: product.vendor_id,
            category: product.category,
            rating: product.rating,
            review_count: product.review_count,
            in_stock: product.stock_quantity > 0,
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
                title="Vendor Not Found"
                message="This vendor doesn't exist or may have been removed. It might have been deleted or the link is incorrect."
                onBack={() => router.back()}
            />
        );
    }


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Image (Shop Front) */}
                <View style={styles.headerImageContainer}>
                    <LazyImage
                        source={vendor.cover_image_url}
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
                                source={vendor.logo_url}
                                size={80}
                                style={styles.avatar}
                            />
                        </View>
                    </View>

                    {/* Vendor Name */}
                    <View style={styles.vendorNameRow}>
                        <Text style={styles.vendorName}>{vendor.shop_name}</Text>
                        {vendor.is_verified && (
                            <View style={styles.verifiedBadgeInline}>
                                <SealCheck size={20} color="#3B82F6" weight="fill" />
                            </View>
                        )}
                    </View>

                    {/* Location and Rating */}
                    <View style={styles.vendorMeta}>
                        <MapPin size={14} color={Colors.textMuted} weight="regular" />
                        <Text style={styles.locationText}>{vendor.address.split(',')[0]}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.verifiedText}>Verified Vendor</Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Star size={14} color={Colors.secondary} weight="fill" />
                        <Text style={styles.ratingValue}>{vendor.rating}</Text>
                        <Text style={styles.ratingCount}>({vendor.review_count >= 1000 ? `${(vendor.review_count / 1000).toFixed(1)}k` : vendor.review_count} reviews)</Text>
                    </View>

                    {/* Bio with Read More */}
                    {vendor.description && (
                        <View style={styles.bioContainer}>
                            <Text style={styles.bioText} numberOfLines={showFullBio ? undefined : 3}>
                                {vendor.description}
                            </Text>
                            {vendor.description.length > MAX_BIO_LENGTH && !showFullBio && (
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
                            onPress={() => router.push(`/vendor/${id}/chat`)}
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
                            <TouchableOpacity onPress={() => router.push(`/vendor/${id}/products`)}>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Product Grid */}
                        <View style={styles.productGrid}>
                            {products.map((product, index) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={[styles.productCard, { width: productCardWidth }]}
                                    onPress={() => handleProductPress(product.id)}
                                    activeOpacity={0.95}
                                >
                                    {/* Product Image */}
                                    <View style={styles.productImageContainer}>
                                        <LazyImage
                                            source={product.image_urls[0]}
                                            style={styles.productImage}
                                            contentFit="cover"
                                            showLoader={false}
                                        />

                                        {/* Badge */}
                                        {product.badge && (
                                            <View style={styles.productBadge}>
                                                <Text style={styles.productBadgeText}>{product.badge}</Text>
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
                                        <Text style={styles.productWeight}>{product.weight}</Text>
                                        <View style={styles.productFooter}>
                                            <Text style={styles.productPrice}>
                                                £{product.price.toFixed(2)}
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
                            ))}
                        </View>
                    </Animated.View>
                )}

                {/* Reviews Tab Content */}
                {activeTab === 'reviews' && (
                    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                        {/* Reviews Section Header */}
                        <View style={styles.reviewsHeader}>
                            <View>
                                <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                                <View style={styles.reviewsRating}>
                                    <Star size={16} color={Colors.secondary} weight="fill" />
                                    <Text style={styles.reviewsRatingText}>
                                        {vendor.rating.toFixed(1)} ({vendor.review_count || reviews.length} reviews)
                                    </Text>
                                </View>
                            </View>
                            <Link
                                href={`/write-review?vendorId=${id}&vendorName=${encodeURIComponent(vendor.shop_name)}`}
                                asChild
                            >
                                <TouchableOpacity style={styles.writeReviewButton}>
                                    <PencilSimple size={18} color={Colors.primary} weight="bold" />
                                    <Text style={styles.writeReviewText}>Write Review</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        {/* Reviews List */}
                        {reviews.length > 0 ? (
                            <View style={styles.reviewsList}>
                                {reviews.slice(0, 3).map((review) => (
                                    <View key={review.id} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <LazyAvatar
                                                source={review.user_avatar || ImageUrlBuilders.dicebearAvatar(review.user_name)}
                                                name={review.user_name}
                                                size={40}
                                                style={styles.reviewAvatar}
                                            />
                                            <View style={styles.reviewMeta}>
                                                <Text style={styles.reviewerName}>{review.user_name}</Text>
                                                <View style={styles.reviewStars}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={12}
                                                            color={star <= review.rating ? Colors.secondary : Colors.borderDark}
                                                            weight={star <= review.rating ? 'fill' : 'regular'}
                                                        />
                                                    ))}
                                                    <Text style={styles.reviewDate}>
                                                        {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                    </Text>
                                                </View>
                                            </View>
                                            {review.verified_purchase && (
                                                <View style={styles.verifiedBadge}>
                                                    <SealCheck size={14} color={Colors.success} weight="fill" />
                                                    <Text style={styles.verifiedText}>Verified</Text>
                                                </View>
                                            )}
                                        </View>
                                        {review.title && (
                                            <Text style={styles.reviewTitle}>{review.title}</Text>
                                        )}
                                        <Text style={styles.reviewContent} numberOfLines={3}>
                                            {review.content}
                                        </Text>
                                    </View>
                                ))}
                                {reviews.length > 3 && (
                                    <TouchableOpacity
                                        style={styles.viewAllReviews}
                                        onPress={() => router.push(`/vendor/${id}/reviews`)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.viewAllReviewsText}>View All {reviews.length} Reviews</Text>
                                        <CaretRight size={16} color={Colors.primary} weight="bold" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <View style={styles.noReviews}>
                                <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                                <Link
                                    href={`/write-review?vendorId=${id}&vendorName=${encodeURIComponent(vendor.shop_name)}`}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.firstReviewButton}>
                                        <Text style={styles.firstReviewText}>Write a Review</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )}
                    </Animated.View>
                )}

                {/* About Tab Content */}
                {activeTab === 'about' && (
                    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
                        {/* About Card */}
                        <View style={styles.aboutCard}>
                            <Text style={styles.aboutCardTitle}>About {vendor.shop_name}</Text>
                            <Text style={styles.aboutCardText}>{vendor.description}</Text>
                        </View>

                        {/* Quick Stats */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{vendor.review_count >= 1000 ? `${(vendor.review_count / 1000).toFixed(1)}k` : vendor.review_count}</Text>
                                <Text style={styles.statLabel}>Reviews</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{products.length}+</Text>
                                <Text style={styles.statLabel}>Products</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>98%</Text>
                                <Text style={styles.statLabel}>Satisfaction</Text>
                            </View>
                        </View>

                        {/* Specialties */}
                        <View style={styles.aboutSection}>
                            <Text style={styles.aboutSectionTitle}>Specialties</Text>
                            <View style={styles.specialtiesList}>
                                {vendor.cultural_specialties.map((specialty, index) => (
                                    <View key={index} style={styles.specialtyBadge}>
                                        <Text style={styles.specialtyText}>{specialty}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Delivery Info Card */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoCardHeader}>
                                <Text style={styles.infoCardTitle}>Delivery Information</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoRowLeft}>
                                    <Text style={styles.infoLabel}>Delivery Time</Text>
                                </View>
                                <Text style={styles.infoValue}>{vendor.delivery_time_min}-{vendor.delivery_time_max} mins</Text>
                            </View>
                            <View style={styles.infoRowDivider} />
                            <View style={styles.infoRow}>
                                <View style={styles.infoRowLeft}>
                                    <Text style={styles.infoLabel}>Delivery Fee</Text>
                                </View>
                                <Text style={[styles.infoValue, vendor.delivery_fee === 0 && styles.infoValueFree]}>
                                    {vendor.delivery_fee === 0 ? 'Free' : `£${vendor.delivery_fee.toFixed(2)}`}
                                </Text>
                            </View>
                            <View style={styles.infoRowDivider} />
                            <View style={styles.infoRow}>
                                <View style={styles.infoRowLeft}>
                                    <Text style={styles.infoLabel}>Minimum Order</Text>
                                </View>
                                <Text style={styles.infoValue}>£{vendor.minimum_order.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Store Location Card */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoCardHeader}>
                                <MapPin size={18} color={Colors.primary} weight="duotone" />
                                <Text style={styles.infoCardTitle}>Store Location</Text>
                            </View>
                            <Text style={styles.addressText}>{vendor.address}</Text>
                            <TouchableOpacity style={styles.mapButton} activeOpacity={0.8}>
                                <MapPin size={16} color={Colors.primary} weight="duotone" />
                                <Text style={styles.mapButtonText}>View on Map</Text>
                            </TouchableOpacity>
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

    // Header Image
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

    // Transparent Header
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

    // Profile Section
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
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.backgroundDark,
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

    // Section Header
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

    // Tabs
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

    // Product Grid
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

    // Tab Content
    tabContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.base,
    },

    // Reviews Section
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
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    writeReviewText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
    },
    reviewsList: {
        gap: Spacing.md,
    },
    reviewCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    reviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: Spacing.sm,
    },
    reviewMeta: {
        flex: 1,
    },
    reviewerName: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    reviewStars: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reviewDate: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginLeft: Spacing.sm,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.success + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    verifiedText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.success,
    },
    reviewTitle: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    reviewContent: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        lineHeight: 20,
    },
    viewAllReviews: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.xs,
    },
    viewAllReviewsText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
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
    firstReviewButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    firstReviewText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },

    // About Tab
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
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
    },
    statValue: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    statLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    aboutSection: {
        marginBottom: Spacing.md,
    },
    aboutSectionTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    specialtiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    specialtyBadge: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.borderOutline,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    specialtyText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textPrimary,
    },
    infoCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
    },
    infoCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    infoCardTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    infoRowLeft: {
        flex: 1,
    },
    infoRowDivider: {
        height: 1,
        backgroundColor: Colors.borderDark,
        marginVertical: Spacing.xs,
    },
    infoLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    infoValue: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    infoValueFree: {
        color: Colors.success,
    },
    addressText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        lineHeight: 22,
        marginBottom: Spacing.md,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: 'transparent',
    },
    mapButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
    },
});
