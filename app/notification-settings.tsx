import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowLeft,
  Bell,
  Truck,
  Package,
  Percent,
  TrendDown,
  Moon,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../constants/typography';
import { Toggle } from '../components/ui/Toggle';
import { useAuthStore } from '../stores/authStore';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { useToast } from '../components/ui/ToastProvider';

// Available colors from Design System for randomized icons
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.success,
  Colors.info,
  Colors.badgeEcoFriendly,
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

interface CategoryItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  defaultEnabled: boolean;
  color: string;
}

const CATEGORIES_BASE: Omit<CategoryItem, 'color'>[] = [
  { id: 'orders', icon: Truck, label: 'Order Updates', defaultEnabled: true },
  { id: 'delivery', icon: Package, label: 'Delivery Status', defaultEnabled: true },
  { id: 'promos', icon: Percent, label: 'Promotions', defaultEnabled: false },
  { id: 'price', icon: TrendDown, label: 'Price Drops', defaultEnabled: false },
];

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const { showToast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(user?.push_notifications_enabled ?? true);
  const [loading, setLoading] = useState(true);
  
  // Assign random colors to categories
  const categories = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return CATEGORIES_BASE.map((cat, index) => ({
      ...cat,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  const [categorySettings, setCategorySettings] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.defaultEnabled }), {})
  );
  const [emailSettings, setEmailSettings] = useState({
    newsletter: true,
    receipts: true,
  });
  const [quietHours, setQuietHours] = useState({
    from: '10:00 PM',
    to: '07:00 AM',
  });

  // Load notification preferences from database
  const loadPreferences = async () => {
    if (!user?.user_id || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const client = await getSupabaseClient();
      const { data: profile } = await client
        .from('profiles')
        .select('push_notifications_enabled')
        .eq('id', user.user_id)
        .single();

      if (profile) {
        setPushEnabled(profile.push_notifications_enabled ?? true);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();

    // Subscribe to real-time profile updates
    if (isSupabaseConfigured() && user?.user_id) {
      let unsubscribeFn: (() => void) | undefined;
      let isMounted = true;

      realtimeService.subscribeToTable(
        'profiles',
        'UPDATE',
        async (payload) => {
          if (isMounted && payload.new?.id === user.user_id) {
            // Profile was updated, refresh preferences
            await loadPreferences();
            await checkAuth();
          }
        },
        `id=eq.${user.user_id}`
      ).then((unsub) => {
        if (isMounted) {
          unsubscribeFn = unsub;
        } else if (unsub) {
          // Component unmounted before subscription completed, clean up immediately
          unsub();
        }
      }).catch((error) => {
        console.error('Error setting up real-time subscription:', error);
      });

      return () => {
        isMounted = false;
        if (unsubscribeFn) {
          unsubscribeFn();
        }
      };
    }
  }, [user?.user_id]);

  const toggleCategory = async (id: string) => {
    const newValue = !categorySettings[id];
    setCategorySettings((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    // Save to database if configured
    if (isSupabaseConfigured() && user?.user_id) {
      try {
        const client = await getSupabaseClient();
        
        // Try to save to notification_preferences JSONB column if it exists
        // If the column doesn't exist, this will fail gracefully
        const { error } = await client
          .from('profiles')
          .update({
            notification_preferences: {
              ...categorySettings,
              [id]: newValue,
            },
          })
          .eq('id', user.user_id);

        if (error) {
          // Column doesn't exist or update failed - show info message
          // Don't revert state, just inform user that preference isn't persisted
          if (error.code === '42703' || error.message.includes('column') || error.message.includes('does not exist')) {
            showToast(
              'Category preferences are saved locally but will reset after app restart. Full persistence coming soon!',
              'info',
              5000
            );
          } else {
            throw error;
          }
        }
      } catch (error: any) {
        console.error('Error saving notification preference:', error);
        // Show info message that preference isn't persisted
        showToast(
          'Category preference saved locally. Full persistence coming soon!',
          'info',
          4000
        );
      }
    } else {
      // Not configured - show info message
      showToast(
        'Category preference saved locally. Full persistence coming soon!',
        'info',
        4000
      );
    }
  };

  const handlePushToggle = async (value: boolean) => {
    setPushEnabled(value);

    // Save to database
    if (isSupabaseConfigured() && user?.user_id) {
      try {
        const client = await getSupabaseClient();
        await client
          .from('profiles')
          .update({ push_notifications_enabled: value })
          .eq('id', user.user_id);
        
        // Refresh user data
        await checkAuth();
      } catch (error) {
        console.error('Error saving push notification preference:', error);
        // Revert on error
        setPushEnabled(!value);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Push Notifications */}
        <View style={styles.masterCard}>
          {/* Decorative gradient */}
          <View style={styles.decorativeGradient} />
          
          <View style={styles.masterContent}>
            <View style={styles.masterIconContainer}>
              <Bell size={26} color={Colors.secondary} weight="duotone" />
            </View>
            <View style={styles.masterTextContainer}>
              <Text style={styles.masterTitle}>Push Notifications</Text>
              <Text style={styles.masterSubtitle}>Pause all incoming alerts</Text>
            </View>
          </View>
          
          <Toggle
            value={pushEnabled}
            onValueChange={handlePushToggle}
            disabled={loading}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          
          <View style={styles.categoryList}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}20` }]}>
                      <IconComponent size={20} color={category.color} weight="duotone" />
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </View>
                  <Toggle
                    value={categorySettings[category.id]}
                    onValueChange={() => toggleCategory(category.id)}
                    disabled={!pushEnabled}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Email</Text>
          </View>
          
          <View style={styles.emailCard}>
            <View style={styles.emailItem}>
              <Text style={styles.emailLabel}>Weekly Newsletter</Text>
              <Toggle
                value={emailSettings.newsletter}
                onValueChange={(value) =>
                  setEmailSettings((prev) => ({ ...prev, newsletter: value }))
                }
              />
            </View>
            <View style={styles.emailDivider} />
            <View style={[styles.emailItem, styles.emailItemDisabled]}>
              <Text style={[styles.emailLabel, styles.emailLabelDisabled]}>
                Order Receipts
              </Text>
              <Toggle
                value={emailSettings.receipts}
                onValueChange={() => {}}
                disabled
              />
            </View>
          </View>
        </View>

        {/* Quiet Hours Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Quiet Hours</Text>
          </View>
          
          <View style={styles.quietHoursCard}>
            <View style={styles.quietHoursHeader}>
              <View style={styles.quietHoursIconContainer}>
                <Moon size={24} color={Colors.secondary} weight="duotone" />
              </View>
              <Text style={styles.quietHoursDescription}>
                Pause notifications during these times. Critical alerts will still arrive.
              </Text>
            </View>
            
            <View style={styles.timePickerRow}>
              <View style={styles.timePickerItem}>
                <Text style={styles.timePickerLabel}>FROM</Text>
                <TouchableOpacity style={styles.timePickerButton} activeOpacity={0.8}>
                  <Text style={styles.timePickerValue}>
                    10:00 <Text style={styles.timePickerPeriod}>PM</Text>
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.timePickerDivider} />
              
              <View style={styles.timePickerItem}>
                <Text style={styles.timePickerLabel}>TO</Text>
                <TouchableOpacity style={styles.timePickerButton} activeOpacity={0.8}>
                  <Text style={styles.timePickerValue}>
                    07:00 <Text style={styles.timePickerPeriod}>AM</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
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
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginRight: 44,
  },
  headerRight: {
    width: 44,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing['2xl'],
  },

  // Master Card
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  decorativeGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `${Colors.primary}0D`,
  },
  masterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    flex: 1,
  },
  masterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  masterTextContainer: {
    flex: 1,
  },
  masterTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  masterSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Section
  section: {
    gap: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
  },

  // Category List
  categoryList: {
    gap: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Email Card
  emailCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  emailItemDisabled: {
    opacity: 0.5,
  },
  emailLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    paddingLeft: Spacing.xs,
  },
  emailLabelDisabled: {
    color: Colors.textMuted,
  },
  emailDivider: {
    height: 1,
    backgroundColor: Colors.borderDark,
  },

  // Quiet Hours
  quietHoursCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  quietHoursHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  quietHoursIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  quietHoursDescription: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.base,
  },
  timePickerItem: {
    flex: 1,
    gap: Spacing.sm,
  },
  timePickerLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
    paddingLeft: Spacing.xs,
  },
  timePickerButton: {
    height: 56,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  timePickerValue: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  timePickerPeriod: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  timePickerDivider: {
    width: Spacing.xl,
    height: 1,
    backgroundColor: Colors.borderDark,
    marginBottom: 28,
  },
});
