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
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
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
    const opacityHex = isRead ? '80' : 'FF'; // 50% opacity = 80, 100% = FF
    switch (type) {
      case 'order':
        return {
          icon: Package,
          bgColor: `${Colors.info}${opacityHex}`,
          iconColor: Colors.textPrimary,
        };
      case 'promo':
        return {
          icon: Confetti,
          bgColor: Colors.secondary,
          iconColor: Colors.backgroundDark,
        };
      case 'review':
        return {
          icon: Star,
          bgColor: Colors.success,
          iconColor: Colors.textPrimary,
        };
      case 'reward':
        return {
          icon: PiggyBank,
          bgColor: `${ZORA_PURPLE}${opacityHex}`,
          iconColor: Colors.textPrimary,
        };
      default:
        return {
          icon: Package,
          bgColor: Colors.info,
          iconColor: Colors.textPrimary,
        };
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
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
        {filteredGroups.map((group) => (
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
                    ]}
                    activeOpacity={0.8}
                    onPress={() => markAsRead(notification.id)}
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

                    {/* Unread Dot */}
                    {!notification.is_read && (
                      <View style={styles.unreadDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  markAllRead: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  tab: {
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: FontFamily.bodyBold,
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
    paddingTop: 24,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingHorizontal: 4,
    opacity: 0.8,
  },

  // Notification List
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: 16,
    position: 'relative',
  },
  notificationCardRead: {
    opacity: 0.7,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    paddingRight: 24,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  notificationTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  notificationDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
