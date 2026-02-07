import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Sliders,
    Star,
    Heart,
    Plus,
    X,
} from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../../constants/spacing';
import { FontSize, FontFamily } from '../../../constants/typography';
import { SortOptions, CategoryOptions, AnimationDuration, AnimationEasing, UiConfig } from '../../../constants';
import { vendorService as supabaseVendorService, productService as supabaseProductService } from '../../../services/supabaseService';
import type { Vendor, Product } from '../../../types/supabase';
import { realtimeService } from '../../../services/realtimeService';
import { isSupabaseConfigured, getSupabaseFrom } from '../../../lib/supabase';
import { useCartStore } from '../../../stores/cartStore';
import { useWishlistStore } from '../../../stores/wishlistStore';
import { getProductRoute } from '../../../lib/navigationHelpers';
import { LazyImage } from '../../../components/ui';
import NotFoundScreen from '../../../components/errors/NotFoundScreen';

const SORT_OPTIONS = SortOptions.vendorProducts;
const CATEGORY_OPTIONS = CategoryOptions;
const PRODUCT_GAP = UiConfig.productGap;
const PRODUCTS_PER_PAGE = 20;

// Favorite Button Component
const FavoriteButton = ({ product }: { product: Product }) => {
    const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

    return (
        <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
                e.stopPropagation();
                toggleWishlist(product as any);
            }}
            activeOpacity={0.7}
        >
            <Heart
                size={16}
                color={isInWishlist ? Colors.primary : Colors.textPrimary}
                weight={isInWishlist ? 'fill' : 'regular'}
            />
        </TouchableOpacity>
    );
};

export default function StoreProductsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { vendorSlug } = useLocalSearchParams<{ vendorSlug: string }>();
    const { width: screenWidth } = useWindowDimensions();
    const productCardWidth = (screenWidth - 48 - PRODUCT_GAP) / 2;
    const addToCart = useCartStore((state) => state.addItem);

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [productOffset, setProductOffset] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSort, setSelectedSort] = useState('popular');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const filterSlideAnim = useRef(new Animated.Value(300)).current;

    const fetchVendor = useCallback(async () => {
        if (!vendorSlug) return null;

        try {
            if (isSupabaseConfigured()) {
                return await supabaseVendorService.getBySlug(vendorSlug);
            }
            return null;
        } catch (error) {
            console.error('Error fetching vendor:', error);
            return null;
        }
    }, [vendorSlug]);

    const fetchProducts = useCallback(async (vendorId: string, offset: number = 0, limit: number = PRODUCTS_PER_PAGE) => {
        try {
            if (isSupabaseConfigured()) {
                const fromMethod = await getSupabaseFrom();
                if (!fromMethod) {
                    return [];
                }

                const { data, error } = await fromMethod('products')
                    .select('*')
                    .eq('vendor_id', vendorId)
                    .eq('is_active', true)
                    .order('is_featured', { ascending: false })
                    .order('rating', { ascending: false })
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1);

                if (error) {
                    console.error('Error fetching products:', error);
                    return [];
                }

                return data || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (!vendorSlug) return;

        try {
            setLoading(true);
            const vendorData = await fetchVendor();

            if (vendorData) {
                setVendor(vendorData);
                const initialProducts = await fetchProducts(vendorData.id, 0, PRODUCTS_PER_PAGE);
                setProducts(initialProducts);
                setFilteredProducts(initialProducts);
                setProductOffset(initialProducts.length);
                setHasMoreProducts(initialProducts.length >= PRODUCTS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching vendor products:', error);
        } finally {
            setLoading(false);
        }
    }, [vendorSlug, fetchVendor, fetchProducts]);

    const loadMoreProducts = useCallback(async () => {
        if (loadingMore || !hasMoreProducts || !vendor) return;

        try {
            setLoadingMore(true);
            const moreProducts = await fetchProducts(vendor.id, productOffset, PRODUCTS_PER_PAGE);

            if (moreProducts.length === 0) {
                setHasMoreProducts(false);
            } else {
                let newProductsCount = 0;
                setProducts((prev: Product[]) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newProducts = moreProducts.filter((p: Product) => !existingIds.has(p.id));
                    newProductsCount = newProducts.length;
                    return [...prev, ...newProducts];
                });

                setProductOffset((prev) => prev + newProductsCount);
                setHasMoreProducts(moreProducts.length >= PRODUCTS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
            setHasMoreProducts(false);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMoreProducts, vendor, productOffset, fetchProducts]);

    useEffect(() => {
        fetchData();

        // Subscribe to real-time updates
        if (isSupabaseConfigured() && vendor?.id) {
            let unsubscribers: (() => void)[] = [];
            let isMounted = true;

            Promise.all([
                realtimeService.subscribeToTable('vendors', 'UPDATE', async (payload) => {
                    if (isMounted && payload.new?.id === vendor.id) {
                        const updatedVendor = await supabaseVendorService.getBySlug(vendorSlug || '');
                        if (updatedVendor) {
                            setVendor(updatedVendor);
                        }
                    }
                }, `id=eq.${vendor.id}`),
                realtimeService.subscribeToTable('products', '*', async (payload) => {
                    if (isMounted && vendor?.id && (payload.new?.vendor_id === vendor.id || payload.old?.vendor_id === vendor.id)) {
                        const updatedProducts = await fetchProducts(vendor.id, 0, productOffset + PRODUCTS_PER_PAGE);
                        setProducts(updatedProducts);
                    }
                }, vendor?.id ? `vendor_id=eq.${vendor.id}` : undefined),
            ]).then((unsubs) => {
                if (isMounted) {
                    unsubscribers = unsubs.filter((unsub): unsub is (() => void) => typeof unsub === 'function');
                } else {
                    unsubs.forEach((unsub) => {
                        if (typeof unsub === 'function') {
                            unsub();
                        }
                    });
                }
            }).catch((error) => {
                console.error('Error setting up real-time subscriptions:', error);
            });

            return () => {
                isMounted = false;
                unsubscribers.forEach((unsub) => {
                    if (typeof unsub === 'function') {
                        unsub();
                    }
                });
            };
        }
    }, [fetchData, vendor?.id, vendorSlug, productOffset, fetchProducts]);

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

    useEffect(() => {
        let filtered = [...products];

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p =>
                p.category.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        // Apply sorting
        switch (selectedSort) {
            case 'price_low':
                filtered.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price_high':
                filtered.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case 'rating':
                filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => {
                    const dateA = new Date(a.created_at || 0).getTime();
                    const dateB = new Date(b.created_at || 0).getTime();
                    return dateB - dateA;
                });
                break;
            default:
                filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        }

        setFilteredProducts(filtered);
    }, [products, selectedSort, selectedCategory]);

    const toggleFilters = () => {
        if (showFilters) {
            Animated.timing(filterSlideAnim, {
                toValue: 300,
                duration: AnimationDuration.fast,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(() => setShowFilters(false));
        } else {
            setShowFilters(true);
            Animated.timing(filterSlideAnim, {
                toValue: 0,
                duration: AnimationDuration.normal,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }
    };

    const handleAddToCart = (product: Product) => {
        const imageUrls = Array.isArray(product.image_urls)
            ? product.image_urls
            : [product.image_urls || ''];

        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: imageUrls[0] || '',
            vendor_id: product.vendor_id,
            category: product.category,
            rating: Number(product.rating) || 0,
            review_count: product.review_count || 0,
            in_stock: (product.stock_quantity || 0) > 0,
        } as any, 1);
    };

    const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedSort !== 'popular' ? 1 : 0);

    if (loading && !vendor) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!vendor) {
        return (
            <NotFoundScreen
                title="Store Not Found"
                message="This store doesn't exist or may have been removed."
                onBack={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(tabs)');
                    }
                }}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {(vendor as any).shop_name || 'Products'}
                </Text>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleFilters}
                >
                    <Sliders size={20} color={Colors.textPrimary} weight="bold" />
                    {activeFilterCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Product Count */}
            <View style={styles.productCountRow}>
                <Text style={styles.productCount}>{filteredProducts.length} products</Text>
            </View>

            {/* Product Grid */}
            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const paddingToBottom = 20;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        loadMoreProducts();
                    }
                }}
                scrollEventThrottle={400}
            >
                <View style={styles.productGrid}>
                    {filteredProducts.map((product, index) => {
                        const imageUrls = Array.isArray(product.image_urls)
                            ? product.image_urls
                            : [product.image_urls || ''];

                        return (
                            <View
                                key={product.id}
                                style={{
                                    width: productCardWidth,
                                    marginRight: index % 2 === 0 ? PRODUCT_GAP : 0,
                                    marginBottom: PRODUCT_GAP,
                                }}
                            >
                                <TouchableOpacity
                                    style={styles.productCard}
                                    onPress={() => {
                                        router.push(getProductRoute(product.id) as any);
                                    }}
                                    activeOpacity={0.95}
                                >
                                    <View style={styles.productImageContainer}>
                                        <LazyImage
                                            source={imageUrls[0] || ''}
                                            style={styles.productImage}
                                            contentFit="cover"
                                            showLoader={false}
                                        />

                                        {(product as any).badge && (
                                            <View style={styles.productBadge}>
                                                <Text style={styles.productBadgeText}>{(product as any).badge}</Text>
                                            </View>
                                        )}

                                        <FavoriteButton product={product} />
                                    </View>

                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                                        <Text style={styles.productWeight}>{(product as any).weight || ''}</Text>
                                        <View style={styles.ratingRow}>
                                            <Star size={12} color={Colors.secondary} weight="fill" />
                                            <Text style={styles.ratingText}>{Number(product.rating || 0).toFixed(1)}</Text>
                                            <Text style={styles.reviewCount}>({product.review_count || 0})</Text>
                                        </View>
                                        <View style={styles.productFooter}>
                                            <Text style={styles.productPrice}>£{Number(product.price).toFixed(2)}</Text>
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => handleAddToCart(product)}
                                            >
                                                <Plus size={14} color={Colors.textPrimary} weight="bold" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                {/* Loading More Indicator */}
                {loadingMore && hasMoreProducts && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.loadingMoreText}>Loading more products...</Text>
                    </View>
                )}

                <View style={{ height: insets.bottom + 32 }} />
            </Animated.ScrollView>

            {/* Filter Panel */}
            {showFilters && (
                <TouchableOpacity
                    style={styles.filterOverlay}
                    activeOpacity={1}
                    onPress={toggleFilters}
                >
                    <Animated.View
                        style={[
                            styles.filterPanel,
                            { transform: [{ translateX: filterSlideAnim }] }
                        ]}
                    >
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.filterHeader}>
                                <Text style={styles.filterTitle}>Filters</Text>
                                <TouchableOpacity onPress={toggleFilters}>
                                    <X size={24} color={Colors.textPrimary} weight="bold" />
                                </TouchableOpacity>
                            </View>

                            {/* Sort By */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Sort By</Text>
                                {SORT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.filterOption}
                                        onPress={() => setSelectedSort(option.id)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            selectedSort === option.id && styles.filterOptionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <View style={[
                                            styles.radioOuter,
                                            selectedSort === option.id && styles.radioOuterSelected
                                        ]}>
                                            {selectedSort === option.id && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Category */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Category</Text>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.filterOption}
                                        onPress={() => setSelectedCategory(option.id)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            selectedCategory === option.id && styles.filterOptionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <View style={[
                                            styles.radioOuter,
                                            selectedCategory === option.id && styles.radioOuterSelected
                                        ]}>
                                            {selectedCategory === option.id && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Apply Button */}
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={toggleFilters}
                            >
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </TouchableOpacity>

                            {/* Clear Filters */}
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => {
                                    setSelectedSort('popular');
                                    setSelectedCategory('all');
                                }}
                            >
                                <Text style={styles.clearButtonText}>Clear All</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </SafeAreaView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginHorizontal: Spacing.sm,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: 10,
        color: Colors.textPrimary,
    },
    productCountRow: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },
    productCount: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.base,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    productCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        width: '100%',
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
        marginBottom: Spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: Spacing.sm,
    },
    ratingText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
        color: Colors.textPrimary,
    },
    reviewCount: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
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
    loadingMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        gap: Spacing.sm,
    },
    loadingMoreText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    filterOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black50,
        justifyContent: 'flex-end',
    },
    filterPanel: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '80%',
        backgroundColor: Colors.backgroundDark,
        paddingTop: 60,
        paddingHorizontal: Spacing.base,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    filterTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    filterSection: {
        marginBottom: Spacing.lg,
    },
    filterSectionTitle: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
    },
    filterOptionText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    filterOptionTextActive: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.white20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: Colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    applyButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        height: Heights.button,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    applyButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    clearButton: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        marginTop: Spacing.sm,
    },
    clearButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
});
