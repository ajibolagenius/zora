import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
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
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#F4B400';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#181010';
const SURFACE_ELEVATED = '#463225';
const MUTED_TEXT = 'rgba(255, 255, 255, 0.4)';
const TOGGLE_BG = '#231515';

interface CategoryItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  defaultEnabled: boolean;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'orders', icon: Truck, label: 'Order Updates', defaultEnabled: true },
  { id: 'delivery', icon: Package, label: 'Delivery Status', defaultEnabled: true },
  { id: 'promos', icon: Percent, label: 'Promotions', defaultEnabled: false },
  { id: 'price', icon: TrendDown, label: 'Price Drops', defaultEnabled: false },
];

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [categorySettings, setCategorySettings] = useState<Record<string, boolean>>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.defaultEnabled }), {})
  );
  const [emailSettings, setEmailSettings] = useState({
    newsletter: true,
    receipts: true,
  });
  const [quietHours, setQuietHours] = useState({
    from: '10:00 PM',
    to: '07:00 AM',
  });

  const toggleCategory = (id: string) => {
    setCategorySettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
              <Bell size={26} color={ZORA_YELLOW} weight="fill" />
            </View>
            <View style={styles.masterTextContainer}>
              <Text style={styles.masterTitle}>Push Notifications</Text>
              <Text style={styles.masterSubtitle}>Pause all incoming alerts</Text>
            </View>
          </View>
          
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: TOGGLE_BG, true: ZORA_RED }}
            thumbColor={Colors.textPrimary}
            ios_backgroundColor={TOGGLE_BG}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          
          <View style={styles.categoryList}>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View style={styles.categoryIconContainer}>
                      <IconComponent size={20} color={ZORA_YELLOW} weight="fill" />
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </View>
                  <Switch
                    value={categorySettings[category.id]}
                    onValueChange={() => toggleCategory(category.id)}
                    trackColor={{ false: TOGGLE_BG, true: ZORA_RED }}
                    thumbColor={Colors.textPrimary}
                    ios_backgroundColor={TOGGLE_BG}
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
              <Switch
                value={emailSettings.newsletter}
                onValueChange={(value) =>
                  setEmailSettings((prev) => ({ ...prev, newsletter: value }))
                }
                trackColor={{ false: TOGGLE_BG, true: ZORA_RED }}
                thumbColor={Colors.textPrimary}
                ios_backgroundColor={TOGGLE_BG}
              />
            </View>
            <View style={styles.emailDivider} />
            <View style={[styles.emailItem, styles.emailItemDisabled]}>
              <Text style={[styles.emailLabel, styles.emailLabelDisabled]}>
                Order Receipts
              </Text>
              <Switch
                value={emailSettings.receipts}
                disabled
                trackColor={{ false: TOGGLE_BG, true: `${ZORA_RED}80` }}
                thumbColor="rgba(255, 255, 255, 0.5)"
                ios_backgroundColor={TOGGLE_BG}
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
                <Moon size={24} color={ZORA_YELLOW} weight="fill" />
              </View>
              <Text style={styles.quietHoursDescription}>
                Pause notifications during these times. Critical alerts will still arrive.
              </Text>
            </View>
            
            <View style={styles.timePickerRow}>
              <View style={styles.timePickerItem}>
                <Text style={styles.timePickerLabel}>FROM</Text>
                <TouchableOpacity style={styles.timePickerButton}>
                  <Text style={styles.timePickerValue}>
                    10:00 <Text style={styles.timePickerPeriod}>PM</Text>
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.timePickerDivider} />
              
              <View style={styles.timePickerItem}>
                <Text style={styles.timePickerLabel}>TO</Text>
                <TouchableOpacity style={styles.timePickerButton}>
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    backgroundColor: 'rgba(24, 16, 16, 0.95)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: 32,
  },

  // Master Card
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
  },
  masterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  masterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(244, 180, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 180, 0, 0.2)',
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
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },

  // Section
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ZORA_YELLOW,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: 12,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Category List
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  emailItemDisabled: {
    opacity: 0.5,
  },
  emailLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    paddingLeft: 4,
  },
  emailLabelDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emailDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Quiet Hours
  quietHoursCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quietHoursHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  quietHoursIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 180, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 180, 0, 0.2)',
  },
  quietHoursDescription: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  timePickerItem: {
    flex: 1,
    gap: 8,
  },
  timePickerLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingLeft: 4,
  },
  timePickerButton: {
    height: 56,
    backgroundColor: BACKGROUND_DARK,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timePickerValue: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  timePickerPeriod: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },
  timePickerDivider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 28,
  },
});
