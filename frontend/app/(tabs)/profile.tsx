import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Gear,
  User,
  CreditCard,
  MapPin,
  Bell,
  Question,
  Info,
  SignOut,
  CaretRight,
  Camera,
  ArrowsClockwise,
  Gift,
  UserPlus,
  QrCode,
  Package,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

interface MenuItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  route?: string;
  isLogout?: boolean;
}

// Available colors from Design System for randomized icons
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,        // #CC0000 - Zora Red
  Colors.secondary,      // #FFCC00 - Zora Yellow
  Colors.success,        // #22C55E - Green
  Colors.info,           // #3B82F6 - Blue
  Colors.badgeEcoFriendly, // #14B8A6 - Teal
];

// Shuffle array function for random color assignment
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Menu items - removed redundant ones, verified routes
const MENU_ITEMS: MenuItem[] = [
  { id: '1', icon: User, label: 'Personal Information', route: '/settings/personal' },
  { id: '2', icon: Package, label: 'My Orders', route: '/orders' },
  { id: '3', icon: QrCode, label: 'Scan QR Code', route: '/qr-scanner' },
  { id: '4', icon: CreditCard, label: 'Payment Methods', route: '/settings/payment' },
  { id: '5', icon: MapPin, label: 'Saved Addresses', route: '/settings/addresses' },
  { id: '6', icon: Bell, label: 'Notification Settings', route: '/notification-settings' },
  { id: '7', icon: UserPlus, label: 'Refer a Friend', route: '/referrals' },
  { id: '8', icon: Question, label: 'Help & Support', route: '/help' },
  { id: '9', icon: Info, label: 'About Zora', route: '/settings/about' },
];

const STATS = [
  { label: 'Orders', value: 24 },
  { label: 'Reviews', value: 12 },
  { label: 'Saved', value: 8 },
];

export default function ProfileTab() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Assign random colors to menu items (computed once on mount)
  const menuItemsWithColors = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return MENU_ITEMS.map((item, index) => ({
      ...item,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              // Navigate to login screen after logout
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleRefreshCode = () => {
    // TODO: Implement QR code refresh
    Alert.alert('Refresh Code', 'QR code refresh feature coming soon!');
  };

  const handleSettingsPress = () => {
    // Settings button - could navigate to a settings screen or show options
    router.push('/settings/personal');
  };

  // Get user display name
  const displayName = user?.name || 'User';
  const membershipTier = user?.membership_tier || 'bronze';
  const loyaltyPoints = user?.loyalty_points || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.8}
        >
          <Gear size={24} color={Colors.textPrimary} weight="duotone" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: user?.picture || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200' 
              }}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              activeOpacity={0.8}
            >
              <Camera size={16} color={Colors.textPrimary} weight="fill" />
            </TouchableOpacity>
          </View>
          
          {/* Name & Badge */}
          <Text style={styles.userName}>{displayName}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>
              {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member ⭐
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, index) => (
            <View 
              key={stat.label} 
              style={[
                styles.statItem,
                index < STATS.length - 1 && styles.statItemBorder,
              ]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Rewards Card */}
        <TouchableOpacity 
          style={styles.rewardsCard}
          onPress={() => router.push('/rewards')}
          activeOpacity={0.8}
        >
          <View style={styles.rewardsIconContainer}>
            <Gift size={24} color={Colors.secondary} weight="duotone" />
          </View>
          <View style={styles.rewardsContent}>
            <Text style={styles.rewardsTitle}>Zora Rewards</Text>
            <Text style={styles.rewardsSubtitle}>
              {loyaltyPoints.toLocaleString()} points · {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Tier
            </Text>
          </View>
          <CaretRight size={20} color={Colors.textMuted} weight="bold" />
        </TouchableOpacity>

        {/* QR Pickup Card */}
        <View style={styles.qrCard}>
          {/* Decorative Background */}
          <View style={styles.qrDecorTop} />
          <View style={styles.qrDecorBottom} />
          
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Pickup ID</Text>
            <Text style={styles.qrSubtitle}>Show this code at the counter</Text>
          </View>
          
          {/* QR Code */}
          <View style={styles.qrCodeContainer}>
            <Image
              source={{ 
                uri: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ZORA-${(user as any)?.id?.substring(0, 8) || (user?.user_id?.substring(0, 8)) || 'USER'}-${membershipTier.toUpperCase()}&bgcolor=FFFFFF&color=000000` 
              }}
              style={styles.qrCode}
              resizeMode="contain"
            />
          </View>
          
          {/* Customer ID */}
          <Text style={styles.customerId}>
            {user?.referral_code || `ZORA-${(user as any)?.id?.substring(0, 8) || user?.user_id?.substring(0, 8) || 'USER'}-${membershipTier.charAt(0).toUpperCase()}`}
          </Text>
          
          {/* Refresh Button */}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefreshCode}
            activeOpacity={0.7}
          >
            <ArrowsClockwise size={18} color={Colors.primary} weight="duotone" />
            <Text style={styles.refreshText}>Refresh Code</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          {menuItemsWithColors.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}15` }]}>
                  <IconComponent size={22} color={item.color} weight="duotone" />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <CaretRight size={20} color={Colors.textMuted} weight="regular" />
              </TouchableOpacity>
            );
          })}
          
          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
            disabled={isLoggingOut}
          >
            <SignOut size={22} color={Colors.primary} weight="duotone" />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        </View>

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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerLeft: {
    width: 44,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    gap: Spacing.xl,
  },
  
  // Profile Section
  profileSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.cardDark,
    backgroundColor: Colors.cardDark,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  userName: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  memberBadge: {
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  memberBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: Colors.secondary,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.borderDark,
  },
  statValue: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.secondary,
  },
  statLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  
  // Rewards Card
  rewardsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  rewardsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.secondary}26`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardsContent: {
    flex: 1,
  },
  rewardsTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  rewardsSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.secondary,
    marginTop: 2,
  },
  
  // QR Card
  qrCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    position: 'relative',
    overflow: 'hidden',
  },
  qrDecorTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}0D`,
  },
  qrDecorBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.secondary}0D`,
  },
  qrHeader: {
    alignItems: 'center',
    gap: Spacing.xs,
    zIndex: 10,
  },
  qrTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  qrSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    zIndex: 10,
  },
  qrCode: {
    width: 160,
    height: 160,
  },
  customerId: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wider,
    zIndex: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    zIndex: 10,
  },
  refreshText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  
  // Menu Section
  menuSection: {
    gap: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  logoutText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
});
