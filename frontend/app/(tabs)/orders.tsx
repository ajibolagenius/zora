import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ShoppingBag,
  CaretRight,
  ArrowCounterClockwise,
  Headset,
  Warning,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#3A2A21';
const STATUS_BLUE = '#3B82F6';
const STATUS_GREEN = '#22C55E';

type TabType = 'active' | 'completed' | 'cancelled';
type OrderStatus = 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  vendorName: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  thumbnails: string[];
}

// Mock order data
const MOCK_ORDERS: OrderItem[] = [
  {
    id: '1',
    orderNumber: '#29384',
    date: 'Oct 24, 2023 at 10:30 AM',
    vendorName: "Zora's Spices",
    itemCount: 3,
    total: 45.50,
    status: 'preparing',
    thumbnails: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100',
    ],
  },
  {
    id: '2',
    orderNumber: '#29312',
    date: 'Oct 23, 2023 at 4:15 PM',
    vendorName: 'Lagos Market Direct',
    itemCount: 2,
    total: 22.00,
    status: 'out_for_delivery',
    thumbnails: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100',
    ],
  },
  {
    id: '3',
    orderNumber: '#28100',
    date: 'Oct 20, 2023 at 1:00 PM',
    vendorName: 'African Beauty Store',
    itemCount: 1,
    total: 15.00,
    status: 'delivered',
    thumbnails: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100',
    ],
  },
  {
    id: '4',
    orderNumber: '#27999',
    date: 'Oct 18, 2023 at 9:00 AM',
    vendorName: 'Shea Butter Co',
    itemCount: 4,
    total: 30.00,
    status: 'cancelled',
    thumbnails: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=100',
      'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=100',
    ],
  },
];

const TABS: { id: TabType; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'preparing':
      return { label: 'Preparing', bgColor: ZORA_YELLOW, textColor: '#000' };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', bgColor: STATUS_BLUE, textColor: '#FFF' };
    case 'delivered':
      return { label: 'Delivered', bgColor: STATUS_GREEN, textColor: '#FFF' };
    case 'cancelled':
      return { label: 'Cancelled', bgColor: ZORA_RED, textColor: '#FFF' };
    default:
      return { label: 'Unknown', bgColor: '#666', textColor: '#FFF' };
  }
};

const getFilteredOrders = (orders: OrderItem[], tab: TabType) => {
  switch (tab) {
    case 'active':
      return orders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery');
    case 'completed':
      return orders.filter(o => o.status === 'delivered');
    case 'cancelled':
      return orders.filter(o => o.status === 'cancelled');
    default:
      return orders;
  }
};

export default function OrdersTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  
  const filteredOrders = getFilteredOrders(MOCK_ORDERS, activeTab);

  const handleTrackOrder = (orderId: string) => {
    router.push(`/order-tracking/${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    console.log('Reorder:', orderId);
  };

  const handleGetHelp = (orderId: string) => {
    router.push(`/order-support/${orderId}`);
  };

  const handleReportIssue = (orderId: string) => {
    router.push(`/report-issue?orderId=${orderId}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingBag size={48} color={Colors.textMuted} weight="duotone" />
      </View>
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptySubtitle}>
        When you place orders, they'll appear here
      </Text>
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={() => router.push('/(tabs)')}
        activeOpacity={0.9}
      >
        <Text style={styles.startShoppingText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderCard = (order: OrderItem) => {
    const statusConfig = getStatusConfig(order.status);
    const isCompleted = order.status === 'delivered' || order.status === 'cancelled';
    const isCancelled = order.status === 'cancelled';

    return (
      <View 
        key={order.id} 
        style={[
          styles.orderCard,
          isCancelled && styles.orderCardCancelled,
        ]}
      >
        {/* Header: Order Number & Status */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Vendor & Items Preview */}
        <View style={styles.vendorSection}>
          <View style={styles.thumbnailsContainer}>
            {order.thumbnails.slice(0, 3).map((thumb, index) => (
              <Image
                key={index}
                source={{ uri: thumb }}
                style={[
                  styles.thumbnail,
                  { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index },
                ]}
              />
            ))}
          </View>
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{order.vendorName}</Text>
            <Text style={styles.itemCount}>{order.itemCount} Items</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer: Price & Actions */}
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>£{order.total.toFixed(2)}</Text>
          <View style={styles.footerActions}>
            {/* Report Issue Button - Only for delivered orders */}
            {order.status === 'delivered' && (
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => handleReportIssue(order.id)}
                activeOpacity={0.7}
              >
                <Warning size={16} color="#EF4444" weight="fill" />
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            )}
            
            {/* Get Help Button - Only for active orders */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => handleGetHelp(order.id)}
                activeOpacity={0.7}
              >
                <Headset size={16} color={Colors.textMuted} weight="regular" />
                <Text style={styles.helpButtonText}>Help</Text>
              </TouchableOpacity>
            )}
            
            {/* Primary Action */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => isCompleted ? handleReorder(order.id) : handleTrackOrder(order.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>
                {isCompleted ? 'Reorder' : 'Track Order'}
              </Text>
              {isCompleted ? (
                <ArrowCounterClockwise size={18} color={ZORA_RED} weight="bold" />
              ) : (
                <CaretRight size={18} color={ZORA_RED} weight="bold" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
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
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
          filteredOrders.map(renderOrderCard)
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: ZORA_RED,
  },
  tabText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: 16,
  },
  
  // Order Card
  orderCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: 16,
  },
  orderCardCancelled: {
    opacity: 0.75,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  orderDate: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
  },
  
  // Vendor Section
  vendorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ZORA_CARD,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 4,
  },
  vendorName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  itemCount: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Footer
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: '#EF4444',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
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
    backgroundColor: ZORA_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.displayMedium,
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
    backgroundColor: ZORA_RED,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  startShoppingText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
