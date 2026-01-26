import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

// Zora Brand Colors - Use design system tokens where possible
const ZORA_PURPLE = '#9333EA'; // Purple for rewards (not in design system)

type TabType = 'all' | 'orders' | 'promos' | 'updates';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'review' | 'reward';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

const NOTIFICATIONS: NotificationGroup[] = [
  {
    label: 'Today',
    notifications: [
      {
        id: '1',
        type: 'order',
        title: 'Order #2938 Shipped',
        description: 'Your jollof rice spices are on the way! Track your package to see arrival time.',
        time: '2h ago',
        isRead: false,
      },
      {
        id: '2',
        type: 'promo',
        title: 'Flash Sale!',
        description: "20% off all plantain chips for the next hour. Don't miss out on the crunch!",
        time: '5h ago',
        isRead: false,
      },
    ],
  },
  {
    label: 'Yesterday',
    notifications: [
      {
        id: '3',
        type: 'review',
        title: 'Rate your purchase',
        description: 'How was the Fufu flour you bought? Share your thoughts with the community.',
        time: '1d ago',
        isRead: false,
      },
      {
        id: '4',
        type: 'reward',
        title: 'You earned 50 pts',
        description: 'Thanks for referring a friend to Zora! Use your points on your next checkout.',
        time: '1d ago',
        isRead: false,
      },
      {
        id: '5',
        type: 'order',
        title: 'Order #2910 Delivered',
        description: 'Your package was left at the front door.',
        time: '1d ago',
        isRead: true,
      },
    ],
  },
];

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders' },
  { id: 'promos', label: 'Promos' },
  { id: 'updates', label: 'Updates' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');

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
    console.log('Mark all read');
  };

  const filterNotifications = (groups: NotificationGroup[]): NotificationGroup[] => {
    if (activeTab === 'all') return groups;
    
    return groups.map(group => ({
      ...group,
      notifications: group.notifications.filter(n => {
        if (activeTab === 'orders') return n.type === 'order';
        if (activeTab === 'promos') return n.type === 'promo';
        if (activeTab === 'updates') return n.type === 'review' || n.type === 'reward';
        return true;
      }),
    })).filter(group => group.notifications.length > 0);
  };

  const filteredGroups = filterNotifications(NOTIFICATIONS);

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
      >
        {filteredGroups.map((group) => (
          <View key={group.label} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.label}</Text>
            <View style={styles.notificationsList}>
              {group.notifications.map((notification) => {
                const iconConfig = getIconConfig(notification.type, notification.isRead);
                const IconComponent = iconConfig.icon;

                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      notification.isRead && styles.notificationCardRead,
                    ]}
                    activeOpacity={0.8}
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
                          {notification.time}
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
                    {!notification.isRead && (
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
    backgroundColor: Colors.tabBarBackground,
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
