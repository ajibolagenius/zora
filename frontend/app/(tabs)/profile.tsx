import React from 'react';
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
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#3A2A21';
const SURFACE_DARK = '#2D1E18';
const ICON_BG = '#221710';

interface MenuItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  route?: string;
  isLogout?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: '1', icon: User, label: 'Personal Information', route: '/settings/personal' },
  { id: '2', icon: CreditCard, label: 'Payment Methods', route: '/settings/payment' },
  { id: '3', icon: MapPin, label: 'Saved Addresses', route: '/settings/addresses' },
  { id: '4', icon: Bell, label: 'Notification Settings', route: '/settings/notifications' },
  { id: '5', icon: Question, label: 'Help & Support', route: '/settings/help' },
  { id: '6', icon: Info, label: 'About Zora', route: '/settings/about' },
];

const STATS = [
  { label: 'Orders', value: 24 },
  { label: 'Reviews', value: 12 },
  { label: 'Saved', value: 8 },
];

export default function ProfileTab() {
  const router = useRouter();

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // TODO: Implement logout logic
  };

  const handleRefreshCode = () => {
    console.log('Refresh code pressed');
    // TODO: Implement QR code refresh
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Gear size={24} color={Colors.textPrimary} weight="regular" />
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
              source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color={Colors.textPrimary} weight="fill" />
            </TouchableOpacity>
          </View>
          
          {/* Name & Badge */}
          <Text style={styles.userName}>Adaeze Johnson</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>Gold Member ⭐</Text>
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
            <Gift size={24} color={ZORA_YELLOW} weight="fill" />
          </View>
          <View style={styles.rewardsContent}>
            <Text style={styles.rewardsTitle}>Zora Rewards</Text>
            <Text style={styles.rewardsSubtitle}>2,450 points · Gold Tier</Text>
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
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ZORA-ADAEZE-2024-GOLD&bgcolor=FFFFFF&color=000000' }}
              style={styles.qrCode}
              resizeMode="contain"
            />
          </View>
          
          {/* Customer ID */}
          <Text style={styles.customerId}>ZORA-ADA-2024-G</Text>
          
          {/* Refresh Button */}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefreshCode}
            activeOpacity={0.7}
          >
            <ArrowsClockwise size={18} color={ZORA_RED} weight="bold" />
            <Text style={styles.refreshText}>Refresh Code</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemIcon}>
                  <IconComponent size={22} color={Colors.textMuted} weight="regular" />
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
          >
            <SignOut size={22} color={ZORA_RED} weight="regular" />
            <Text style={styles.logoutText}>Log Out</Text>
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
    paddingVertical: Spacing.md,
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
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: 24,
  },
  
  // Profile Section
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: ZORA_CARD,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ZORA_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ICON_BG,
  },
  userName: {
    fontFamily: FontFamily.display,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  memberBadge: {
    backgroundColor: ZORA_CARD,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 204, 0, 0.2)',
  },
  memberBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: ZORA_YELLOW,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 53, 53, 0.3)',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(74, 53, 53, 0.3)',
  },
  statValue: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: ZORA_YELLOW,
  },
  statLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  
  // QR Card
  qrCard: {
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 53, 53, 0.5)',
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
    backgroundColor: 'rgba(193, 39, 45, 0.05)',
  },
  qrDecorBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 204, 0, 0.05)',
  },
  qrHeader: {
    alignItems: 'center',
    gap: 4,
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
    padding: 12,
    borderRadius: BorderRadius.lg,
    zIndex: 10,
  },
  qrCode: {
    width: 160,
    height: 160,
  },
  customerId: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 2,
    zIndex: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    zIndex: 10,
  },
  refreshText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  
  // Menu Section
  menuSection: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: SURFACE_DARK,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: ICON_BG,
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
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: ZORA_RED,
  },
});
