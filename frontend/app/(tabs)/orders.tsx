import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    Platform,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { vendorService } from '../../services/mockDataService';
import {
    ShoppingBag,
    CaretRight,
    ArrowCounterClockwise,
    ArrowLeft,
    Question,
    MagnifyingGlass,
    X,
    Truck,
    CheckCircle,
    Package,
    XCircle,
    Warning,
    Headset,
    CaretDown,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Status colors matching design system
const STATUS_YELLOW = '#FFCC00';
const STATUS_BLUE = '#3B82F6';
const STATUS_GREEN = '#22C55E';
const STATUS_RED = '#CC0000';

type TabType = 'active' | 'completed' | 'cancelled';
type OrderStatus = 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface OrderProduct {
    id: string;
    name: string;
    image_url: string;
    quantity: number;
    price: number;
}

interface OrderItem {
    id: string;
    orderNumber: string;
    date: string;
    vendorName: string;
    vendorId?: string; // Optional vendor ID for navigation
    itemCount: number;
    total: number;
    status: OrderStatus;
    thumbnails: string[];
    products: OrderProduct[];
}

// Mock order data
const MOCK_ORDERS: OrderItem[] = [
    {
        id: '1',
        orderNumber: '#29384',
        date: 'Oct 24, 2023 at 10:30 AM',
        vendorName: "Zora's Spices",
        vendorId: 'vnd_001', // Maps to "Mama Africa's Spices"
        itemCount: 3,
        total: 45.50,
        status: 'preparing',
        thumbnails: [
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100',
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100',
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100',
        ],
        products: [
            { id: 'prod_001', name: 'Premium Jollof Spice Blend', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100', quantity: 2, price: 18.50 },
            { id: 'prod_002', name: 'Nigerian Curry Powder', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100', quantity: 1, price: 8.50 },
        ],
    },
    {
        id: '2',
        orderNumber: '#29312',
        date: 'Oct 23, 2023 at 4:15 PM',
        vendorName: 'Lagos Market Direct',
        vendorId: 'vnd_002', // Maps to "Lagos Fresh Mart"
        itemCount: 2,
        total: 22.00,
        status: 'out_for_delivery',
        thumbnails: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100',
        ],
        products: [
            { id: 'prod_003', name: 'Fresh Palm Oil', image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100', quantity: 1, price: 12.00 },
            { id: 'prod_004', name: 'Garri Premium', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100', quantity: 1, price: 10.00 },
        ],
    },
    {
        id: '3',
        orderNumber: '#28100',
        date: 'Oct 20, 2023 at 1:00 PM',
        vendorName: 'African Beauty Store',
        vendorId: 'vnd_003', // Maps to "Zuri Beauty Supply"
        itemCount: 1,
        total: 15.00,
        status: 'delivered',
        thumbnails: [
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100',
        ],
        products: [
            { id: 'prod_005', name: 'Shea Butter Body Cream', image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100', quantity: 1, price: 15.00 },
        ],
    },
    {
        id: '4',
        orderNumber: '#27999',
        date: 'Oct 18, 2023 at 9:00 AM',
        vendorName: 'Shea Butter Co',
        vendorId: 'vnd_003', // Maps to "Zuri Beauty Supply" (shea butter products)
        itemCount: 4,
        total: 30.00,
        status: 'cancelled',
        thumbnails: [
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100',
            'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=100',
            'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=100',
        ],
        products: [
            { id: 'prod_006', name: 'Raw Shea Butter', image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100', quantity: 2, price: 12.00 },
            { id: 'prod_007', name: 'Cocoa Butter', image_url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=100', quantity: 1, price: 8.00 },
            { id: 'prod_008', name: 'Mango Butter', image_url: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=100', quantity: 1, price: 10.00 },
        ],
    },
];

const TABS: { id: TabType; label: string }[] = [
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
];

type StatusConfig = {
    label: string;
    bgColor: string;
    textColor: string;
    icon: 'truck' | 'check' | 'package' | 'x';
};

const getStatusConfig = (status: OrderStatus): StatusConfig => {
    switch (status) {
        case 'preparing':
            return { label: 'Processing', bgColor: STATUS_BLUE, textColor: '#FFF', icon: 'package' };
        case 'out_for_delivery':
            return { label: 'In Transit', bgColor: STATUS_YELLOW, textColor: '#000', icon: 'truck' };
        case 'delivered':
            return { label: 'Delivered', bgColor: STATUS_GREEN, textColor: '#FFF', icon: 'check' };
        case 'cancelled':
            return { label: 'Cancelled', bgColor: '#4A4A4A', textColor: '#999', icon: 'x' };
        default:
            return { label: 'Unknown', bgColor: '#666', textColor: '#FFF', icon: 'package' };
    }
};

const StatusIcon = ({ icon, color, size = 14 }: { icon: StatusConfig['icon']; color: string; size?: number }) => {
    switch (icon) {
        case 'truck':
            return <Truck size={size} color={color} weight="fill" />;
        case 'check':
            return <CheckCircle size={size} color={color} weight="fill" />;
        case 'package':
            return <Package size={size} color={color} weight="fill" />;
        case 'x':
            return <XCircle size={size} color={color} weight="fill" />;
        default:
            return null;
    }
};

const getFilteredOrders = (orders: OrderItem[], tab: TabType, searchQuery: string) => {
    let filtered: OrderItem[];
    
    switch (tab) {
        case 'active':
            filtered = orders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery');
            break;
        case 'completed':
            filtered = orders.filter(o => o.status === 'delivered');
            break;
        case 'cancelled':
            filtered = orders.filter(o => o.status === 'cancelled');
            break;
        default:
            filtered = orders;
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(order => 
            order.orderNumber.toLowerCase().includes(query) ||
            order.vendorName.toLowerCase().includes(query) ||
            order.date.toLowerCase().includes(query)
        );
    }
    
    return filtered;
};

export default function OrdersTab() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const expandAnimations = useRef<{ [key: string]: Animated.Value }>({});

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const filteredOrders = getFilteredOrders(MOCK_ORDERS, activeTab, searchQuery);

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleTrackOrder = (orderId: string) => {
        router.push(`/order-tracking/${orderId}`);
    };

    const handleReorder = (orderId: string) => {
        console.log('Reorder:', orderId);
    };

    const handleHelpPress = () => {
        router.push('/help');
    };

    const handleGetHelp = (orderId: string) => {
        router.push(`/order-support/${orderId}`);
    };

    const handleReportIssue = (orderId: string) => {
        router.push(`/report-issue?orderId=${orderId}`);
    };

    const toggleOrderExpansion = (orderId: string) => {
        const isExpanded = expandedOrders.has(orderId);
        
        // Initialize animation value if not exists
        if (!expandAnimations.current[orderId]) {
            expandAnimations.current[orderId] = new Animated.Value(isExpanded ? 1 : 0);
        }
        
        const animValue = expandAnimations.current[orderId];
        
        if (isExpanded) {
            // Collapse
            setExpandedOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        } else {
            // Expand
            setExpandedOrders(prev => new Set(prev).add(orderId));
            Animated.timing(animValue, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }
    };

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleVendorPress = (order: OrderItem) => {
        // If vendorId is available, use it directly
        if (order.vendorId) {
            router.push(`/vendor/${order.vendorId}`);
            return;
        }
        
        // Otherwise, try to find vendor by name with improved matching
        const vendors = vendorService.getAll();
        const orderNameLower = order.vendorName.toLowerCase();
        
        // Try exact match first
        let vendor = vendors.find(v => 
            v.shop_name.toLowerCase() === orderNameLower
        );
        
        // Try partial match (vendor name contains order name or vice versa)
        if (!vendor) {
            vendor = vendors.find(v => {
                const shopNameLower = v.shop_name.toLowerCase();
                return shopNameLower.includes(orderNameLower) || 
                       orderNameLower.includes(shopNameLower);
            });
        }
        
        // Try fuzzy matching for common words (e.g., "Lagos", "Spices", "Beauty")
        if (!vendor) {
            const orderWords = orderNameLower.split(/\s+/).filter(w => w.length > 3);
            vendor = vendors.find(v => {
                const shopNameLower = v.shop_name.toLowerCase();
                return orderWords.some(word => shopNameLower.includes(word));
            });
        }
        
        if (vendor) {
            router.push(`/vendor/${vendor.id}`);
        } else {
            // Fallback: navigate to vendors list if not found
            console.warn(`Vendor not found: ${order.vendorName}`);
            router.push('/vendors');
        }
    };

    const renderEmptyState = () => {
        const isSearching = searchQuery.trim().length > 0;
        
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    {isSearching ? (
                        <MagnifyingGlass size={48} color={Colors.textMuted} weight="duotone" />
                    ) : (
                        <ShoppingBag size={48} color={Colors.textMuted} weight="duotone" />
                    )}
                </View>
                <Text style={styles.emptyTitle}>
                    {isSearching ? 'No results found' : 'No orders yet'}
                </Text>
                <Text style={styles.emptySubtitle}>
                    {isSearching 
                        ? `No orders matching "${searchQuery}"`
                        : 'When you place orders, they\'ll appear here'
                    }
                </Text>
                {isSearching ? (
                    <TouchableOpacity
                        style={styles.startShoppingButton}
                        onPress={clearSearch}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startShoppingText}>Clear Search</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.startShoppingButton}
                        onPress={() => router.push('/(tabs)')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startShoppingText}>Start Shopping</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderOrderCard = (order: OrderItem, index: number) => {
        const statusConfig = getStatusConfig(order.status);
        const isCompleted = order.status === 'delivered' || order.status === 'cancelled';
        const isExpanded = expandedOrders.has(order.id);
        
        // Initialize animation value if not exists
        if (!expandAnimations.current[order.id]) {
            expandAnimations.current[order.id] = new Animated.Value(isExpanded ? 1 : 0);
        }
        
        const expandAnim = expandAnimations.current[order.id];
        // Calculate height: padding (sm + xs) + (item height + gap) * count
        const itemHeight = 50 + (Spacing.sm * 2); // image height + padding
        const gapHeight = Spacing.sm;
        const containerPadding = Spacing.sm + Spacing.xs;
        // Use Math.max to prevent negative gap calculation when products.length is 0
        const gapCount = Math.max(0, order.products.length - 1);
        const totalHeight = containerPadding + (order.products.length * itemHeight) + (gapCount * gapHeight);
        const maxHeight = expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, totalHeight],
        });
        const opacity = expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        return (
            <Animated.View
                key={order.id}
                style={[
                    styles.orderCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Clickable Header: Order Number & Status */}
                <TouchableOpacity
                    style={styles.orderCardHeader}
                    onPress={() => toggleOrderExpansion(order.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.orderHeader}>
                        <View>
                            <Text style={styles.orderNumber}>Order {order.orderNumber}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                        </View>
                        <View style={styles.headerRightSection}>
                            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                                <StatusIcon icon={statusConfig.icon} color={statusConfig.textColor} size={14} />
                                <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                                    {statusConfig.label}
                                </Text>
                            </View>
                            <Animated.View
                                style={{
                                    transform: [{ rotate: expandAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '180deg'],
                                    }) }],
                                }}
                            >
                                <CaretDown size={20} color={Colors.textMuted} weight="bold" />
                            </Animated.View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Vendor & Items Preview */}
                <View style={styles.vendorSection}>
                    <View style={styles.thumbnailsContainer}>
                        {order.thumbnails.slice(0, 3).map((thumb, idx) => (
                            <Image
                                key={idx}
                                source={{ uri: thumb }}
                                style={[
                                    styles.thumbnail,
                                    { marginLeft: idx > 0 ? -12 : 0, zIndex: 3 - idx },
                                ]}
                            />
                        ))}
                    </View>
                    <View style={styles.vendorInfo}>
                        <TouchableOpacity
                            onPress={() => handleVendorPress(order)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.vendorName}>{order.vendorName}</Text>
                        </TouchableOpacity>
                        <Text style={styles.itemCount}>{order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}</Text>
                    </View>
                </View>

                {/* Expandable Product Items */}
                <Animated.View
                    style={{
                        maxHeight,
                        opacity,
                        overflow: 'hidden',
                    }}
                >
                    <View style={styles.orderItemsContainer}>
                        {order.products.map((product, productIndex) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.orderItemRow}
                                onPress={() => handleProductPress(product.id)}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: product.image_url }}
                                    style={styles.orderItemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.orderItemInfo}>
                                    <Text style={styles.orderItemName} numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.orderItemDetails}>
                                        Qty: {product.quantity} × £{product.price.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.orderItemPrice}>
                                    <Text style={styles.orderItemTotal}>
                                        £{(product.quantity * product.price).toFixed(2)}
                                    </Text>
                                </View>
                                <CaretRight size={16} color={Colors.textMuted} weight="bold" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Footer: Price & Actions */}
                <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>£{order.total.toFixed(2)}</Text>
                    <View style={styles.footerActions}>
                        {/* Report Issue Button - Only for delivered orders */}
                        {order.status === 'delivered' && (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => handleReportIssue(order.id)}
                                activeOpacity={0.8}
                            >
                                <Warning size={14} color={Colors.error || '#EF4444'} weight="fill" />
                                <Text style={styles.reportButtonText}>Report</Text>
                            </TouchableOpacity>
                        )}

                        {/* Help Button - Only for active orders */}
                        {(order.status === 'preparing' || order.status === 'out_for_delivery') && (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => handleGetHelp(order.id)}
                                activeOpacity={0.8}
                            >
                                <Headset size={14} color={Colors.textMuted} weight="fill" />
                                <Text style={styles.helpButtonText}>Help</Text>
                            </TouchableOpacity>
                        )}

                        {/* Primary Action */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => isCompleted ? handleReorder(order.id) : handleTrackOrder(order.id)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionButtonText}>
                                {isCompleted ? 'Reorder' : 'Track Order'}
                            </Text>
                            {isCompleted ? (
                                <ArrowCounterClockwise size={16} color={Colors.primary} weight="bold" />
                            ) : (
                                <CaretRight size={16} color={Colors.primary} weight="bold" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={handleHelpPress}
                    activeOpacity={0.8}
                >
                    <Question size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tab, isActive && styles.tabActive]}
                            onPress={() => setActiveTab(tab.id)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Search Box */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <MagnifyingGlass size={20} color={Colors.textMuted} weight="bold" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search orders..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                            <X size={18} color={Colors.textMuted} weight="bold" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredOrders.length === 0 ? (
                    renderEmptyState()
                ) : (
                    filteredOrders.map((order, index) => renderOrderCard(order, index))
                )}

                {/* Bottom padding for tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    tabTextActive: {
        color: Colors.textPrimary,
    },

    // Search Box
    searchContainer: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.full,
        height: Heights.input,
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    searchInput: {
        flex: 1,
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        height: '100%',
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
        gap: Spacing.md,
    },

    // Order Card
    orderCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        gap: Spacing.md,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderNumber: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    orderDate: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    statusText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
    },

    // Vendor Section
    vendorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: Colors.cardDark,
        backgroundColor: Colors.backgroundDark,
    },
    vendorInfo: {
        flex: 1,
    },
    vendorName: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.primary,
    },
    itemCount: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },

    // Footer
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.borderDark,
    },
    orderTotal: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    orderCardHeader: {
        marginBottom: Spacing.sm,
    },
    headerRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    orderItemsContainer: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        gap: Spacing.sm,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.backgroundDark,
        borderRadius: BorderRadius.md,
    },
    orderItemImage: {
        width: 50,
        height: 50,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.cardDark,
    },
    orderItemInfo: {
        flex: 1,
        gap: 2,
    },
    orderItemName: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    orderItemDetails: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    orderItemPrice: {
        alignItems: 'flex-end',
    },
    orderItemTotal: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    helpButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    reportButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: '#EF4444',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    actionButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.primary,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: Spacing.xl,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    emptyTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    startShoppingButton: {
        marginTop: Spacing.xl,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
    },
    startShoppingText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
});
