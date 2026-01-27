import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Package,
  Confetti,
  Star,
  PiggyBank,
  Truck,
  Bell,
  ArrowLeft,
} from 'phosphor-react-native';
import { Button } from '../components/ui';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import { Notification } from '../types';

// Zora Brand Colors - Use design system tokens where possible
const ZORA_PURPLE = '#9333EA'; // Purple for rewards (not in design system)

type TabType = 'all' | 'orders' | 'promos' | 'updates';

interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders' },
  { id: 'promos', label: 'Promos' },
  { id: 'updates', label: 'Updates' },
];

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    subscribeToRealtime,
    unsubscribeFromRealtime
  } = useNotificationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchNotifications();
    if (user) {
      subscribeToRealtime(user.user_id);
    }
    return () => {
      unsubscribeFromRealtime();
    };
  }, [user]);

  const onRefresh = React.useCallback(() => {
    fetchNotifications();
  }, []);

  const getIconConfig = (type: string, isRead: boolean) => {
    const baseOpacity = isRead ? 0.6 : 1.0;
    switch (type) {
      case 'order':
        return {
          icon: Package,
          bgColor: isRead ? Colors.info20 : Colors.info,
          iconColor: Colors.textPrimary,
        };
      case 'promo':
        return {
          icon: Confetti,
          bgColor: isRead ? Colors.secondary20 : Colors.secondary,
          iconColor: Colors.backgroundDark,
        };
      case 'review':
        return {
          icon: Star,
          bgColor: isRead ? Colors.success20 : Colors.success,
          iconColor: Colors.textPrimary,
        };
      case 'reward':
        return {
          icon: PiggyBank,
          bgColor: isRead ? `${ZORA_PURPLE}80` : ZORA_PURPLE,
          iconColor: Colors.textPrimary,
        };
      case 'system':
        return {
          icon: Bell,
          bgColor: isRead ? Colors.primary20 : Colors.primary,
          iconColor: Colors.textPrimary,
        };
      default:
        return {
          icon: Package,
          bgColor: isRead ? Colors.info20 : Colors.info,
          iconColor: Colors.textPrimary,
        };
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read first
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type or action_url
    if (notification.action_url) {
      router.push(notification.action_url as any);
      return;
    }

    // Fallback navigation based on type
    switch (notification.type) {
      case 'order':
        router.push('/(tabs)/orders' as any);
        break;
      case 'promo':
        // Could navigate to promos/deals screen if exists
        break;
      case 'review':
        // Could navigate to reviews screen or product
        break;
      case 'reward':
        router.push('/rewards' as any);
        break;
      default:
        break;
    }
  };

  const categorizeNotifications = (filtered: Notification[]): NotificationGroup[] => {
    const groups: { [key: string]: Notification[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;

    filtered.forEach((n) => {
      const nDate = new Date(n.created_at).getTime();
      if (nDate >= today) {
        groups.Today.push(n);
      } else if (nDate >= yesterday) {
        groups.Yesterday.push(n);
      } else {
        groups.Earlier.push(n);
      }
    });

    return Object.entries(groups)
      .filter(([_, items]) => items.length > 0)
      .map(([label, items]) => ({ label, notifications: items }));
  };

  const filterNotifications = (): NotificationGroup[] => {
    let filtered = notifications;
    if (activeTab !== 'all') {
      filtered = notifications.filter(n => {
        if (activeTab === 'orders') return n.type === 'order';
        if (activeTab === 'promos') return n.type === 'promo';
        if (activeTab === 'updates') return n.type === 'review' || n.type === 'reward' || n.type === 'system';
        return true;
      });
    }
    return categorizeNotifications(filtered);
  };

  const filteredGroups = filterNotifications();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
          {notifications.length > 0 && unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.8}>
              <Text style={styles.markAllRead}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  isActive && styles.tabActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Bell size={48} color={Colors.textMuted} weight="duotone" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>We'll let you know when important updates arrive</Text>
            <Button
              title="Refresh"
              onPress={onRefresh}
              variant="secondary"
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        ) : (
          filteredGroups.map((group) => (
            <View key={group.label} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.label}</Text>
              <View style={styles.notificationsList}>
                {group.notifications.map((notification) => {
                  const iconConfig = getIconConfig(notification.type, notification.is_read);
                  const IconComponent = iconConfig.icon;

                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationCard,
                        notification.is_read && styles.notificationCardRead,
                        !notification.is_read && styles.notificationCardUnread,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      {/* Icon */}
                      <View
                        style={[
                          styles.notificationIcon,
                          { backgroundColor: iconConfig.bgColor },
                        ]}
                      >
                        <IconComponent
                          size={24}
                          color={iconConfig.iconColor}
                          weight="fill"
                        />
                      </View>

                      {/* Content */}
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text
                            style={styles.notificationTitle}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {formatTimeAgo(notification.created_at)}
                          </Text>
                        </View>
                        <Text
                          style={styles.notificationDescription}
                          numberOfLines={2}
                        >
                          {notification.description}
                        </Text>
                      </View>

                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <View style={styles.unreadIndicator}>
                          <View style={styles.unreadDot} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )))}

        {/* Bottom padding */}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.backgroundDark,
    ...Shadows.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.tiny,
    color: Colors.textPrimary,
  },
  markAllRead: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.backgroundDark,
  },
  tab: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodyBold,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },

  // Section
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.xs,
    opacity: 0.9,
  },

  // Notification List
  notificationsList: {
    gap: Spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    position: 'relative',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  notificationCardRead: {
    opacity: 0.6,
    borderColor: 'transparent',
  },
  notificationCardUnread: {
    borderColor: Colors.primary20,
    backgroundColor: Colors.cardDark,
  },
  notificationIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  notificationContent: {
    flex: 1,
    paddingRight: Spacing.lg,
    gap: Spacing.xs,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  notificationTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  notificationTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notificationDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.base,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },

  // Empty State - Consistent with Cart/Orders
  emptyContainer: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
