import React from 'react';
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
  UserCircle,
  Gear,
  ClipboardText,
  MapPin,
  CreditCard,
  Bell,
  Question,
  Info,
  SignOut,
  CaretRight,
  Crown,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, TouchTarget } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

const MENU_ITEMS = [
  { id: 'orders', icon: ClipboardText, label: 'My Orders', route: '/(tabs)/orders' },
  { id: 'addresses', icon: MapPin, label: 'Saved Addresses', route: '/addresses' },
  { id: 'payments', icon: CreditCard, label: 'Payment Methods', route: '/payments' },
  { id: 'notifications', icon: Bell, label: 'Notifications', route: '/notifications' },
  { id: 'help', icon: Question, label: 'Help & Support', route: '/help' },
  { id: 'about', icon: Info, label: 'About Zora', route: '/about' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.loginPrompt}>
          <View style={styles.emptyIconContainer}>
            <UserCircle size={48} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.loginTitle}>Sign in to your account</Text>
          <Text style={styles.loginSubtitle}>Manage orders, save addresses, and more</Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return Colors.secondary;
      case 'silver':
        return '#C0C0C0';
      case 'platinum':
        return '#E5E4E2';
      default:
        return '#CD7F32';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Gear size={24} color={Colors.textPrimary} weight="duotone" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.picture || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={[styles.tierBadge, { backgroundColor: `${getTierColor(user?.membership_tier || 'bronze')}20` }]}>
              <Crown size={14} color={getTierColor(user?.membership_tier || 'bronze')} weight="fill" />
              <Text style={[styles.tierText, { color: getTierColor(user?.membership_tier || 'bronze') }]}>
                {user?.membership_tier?.toUpperCase()} MEMBER
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.loyalty_points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>£{(user?.zora_credits || 0).toFixed(2)}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.referral_code || '-'}</Text>
            <Text style={styles.statLabel}>Referral</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === MENU_ITEMS.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuItemLeft}>
                  <IconComponent size={24} color={Colors.textMuted} weight="duotone" />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <CaretRight size={20} color={Colors.textMuted} weight="bold" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <SignOut size={24} color={Colors.primary} weight="duotone" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  settingsButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    flex: 1,
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
  loginTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.md,
  },
  loginSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.body,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundDark,
  },
  profileInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
  userEmail: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    gap: 4,
  },
  tierText: {
    fontSize: FontSize.tiny,
    fontWeight: FontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.secondary,
    fontSize: FontSize.h4,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.sm,
  },
  menuSection: {
    backgroundColor: Colors.cardDark,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    minHeight: 56,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    padding: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    height: 56,
  },
  logoutText: {
    color: Colors.primary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
  },
});
