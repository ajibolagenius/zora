import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { orderService } from '../../services/dataService';
import { Order } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui';

const ORDER_TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
    case 'completed':
      return Colors.success;
    case 'cancelled':
    case 'refunded':
      return Colors.error;
    case 'pending':
    case 'confirmed':
    case 'preparing':
    case 'ready':
    case 'out_for_delivery':
      return Colors.secondary;
    default:
      return Colors.textMuted;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated, sessionToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');

  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, sessionToken]);

  const fetchOrders = async () => {
    if (!sessionToken) return;
    try {
      const data = await orderService.getAll(sessionToken);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    switch (selectedTab) {
      case 'Active':
        return orders.filter((o) =>
          ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
        );
      case 'Completed':
        return orders.filter((o) => o.status === 'delivered');
      case 'Cancelled':
        return orders.filter((o) => ['cancelled', 'refunded'].includes(o.status));
      default:
        return orders;
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="login" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <Text style={styles.emptySubtitle}>Track your orders and view history</Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {ORDER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabSelected]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Start shopping to see your orders here</Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push(`/order/${order.id}`)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{order.order_number}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.slice(0, 3).map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: item.image_url }}
                    style={styles.itemImage}
                  />
                ))}
                {order.items.length > 3 && (
                  <View style={styles.moreItems}>
                    <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
                  </View>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.itemCount}>{order.items.length} items</Text>
                <Text style={styles.orderTotal}>£{order.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
  },
  tabSelected: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  tabTextSelected: {
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  orderCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderNumber: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
  orderDate: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  orderItems: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
  },
  moreItems: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semiBold,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  itemCount: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
  },
  orderTotal: {
    color: Colors.secondary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
