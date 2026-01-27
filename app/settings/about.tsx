import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Globe,
  Envelope,
  MapPin,
  FileText,
  ShieldCheck,
  CaretRight,
  Storefront,
  ShoppingBag,
  Users,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';
import { realtimeService } from '../../services/realtimeService';

const INITIAL_STATS = [
  { icon: ShoppingBag, value: '...', label: 'Products' },
  { icon: Storefront, value: '...', label: 'Vendors' },
  { icon: Users, value: '...', label: 'Customers' },
];

const CONTACT_ITEMS = [
  {
    icon: Globe,
    label: 'Website',
    value: 'www.zoraapp.co.uk',
    url: 'https://www.zoraapp.co.uk',
  },
  {
    icon: Envelope,
    label: 'Email',
    value: 'zoraafricanmarketapp@gmail.com',
    url: 'mailto:zoraafricanmarketapp@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'United Kingdom',
    url: 'https://maps.google.com/?q=United+Kingdom',
  },
];

const LEGAL_ITEMS = [
  { icon: FileText, label: 'Terms of Service', route: '/legal/terms' },
  { icon: ShieldCheck, label: 'Privacy Policy', route: '/legal/privacy' },
  { icon: FileText, label: 'Licenses', route: '/legal/licenses' },
];

export default function AboutScreen() {
  const router = useRouter();
  const [stats, setStats] = useState(INITIAL_STATS);

  useEffect(() => {
    fetchStats();

    // Subscribe to real-time updates for stats
    if (isSupabaseConfigured()) {
      let unsubscribers: (() => void)[] = [];
      let isMounted = true;

      // Set up all subscriptions and wait for them to complete
      Promise.all([
        realtimeService.subscribeToTable('products', '*', async () => {
          if (isMounted) {
            await fetchStats();
          }
        }),
        realtimeService.subscribeToTable('vendors', '*', async () => {
          if (isMounted) {
            await fetchStats();
          }
        }),
        realtimeService.subscribeToTable('profiles', '*', async () => {
          if (isMounted) {
            await fetchStats();
          }
        }),
      ]).then((unsubs) => {
        // Only add unsubscribe functions if component is still mounted
        if (isMounted) {
          unsubscribers = unsubs.filter((unsub): unsub is (() => void) => typeof unsub === 'function');
        } else {
          // Component unmounted before subscriptions completed, clean up immediately
          unsubs.forEach((unsub) => {
            if (typeof unsub === 'function') {
              unsub();
            }
          });
        }
      }).catch((error) => {
        console.error('Error setting up real-time subscriptions:', error);
      });

      return () => {
        isMounted = false;
        // Clean up all subscriptions
        unsubscribers.forEach((unsub) => {
          if (typeof unsub === 'function') {
            unsub();
          }
        });
      };
    }
  }, []);

  const fetchStats = async () => {
    try {
      const supabase = await getSupabaseClient();
      const [products, vendors, profiles] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats([
        { icon: ShoppingBag, value: formatCount(products.count || 0), label: 'Products' },
        { icon: Storefront, value: formatCount(vendors.count || 0), label: 'Vendors' },
        { icon: Users, value: formatCount(profiles.count || 0), label: 'Customers' },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to initial stats or show error state if needed
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K+';
    }
    return count.toString();
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no navigation history, navigate to profile tab
      router.replace('/(tabs)/profile');
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const handleLegalPress = (route: string) => {
    // TODO: Implement legal pages navigation
    console.log('Navigate to:', route);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Zora</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ZORA</Text>
            <Text style={styles.logoSubtext}>AFRICAN MARKET</Text>
          </View>
          <Text style={styles.tagline}>
            Connecting the African diaspora{'\n'}with the taste of home
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Mission Card */}
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <View style={styles.missionIconContainer}>
              <Heart size={24} color={Colors.primary} weight="duotone" />
            </View>
            <Text style={styles.missionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.missionText}>
            Zora African Market was founded to bridge the gap between African vendors and the diaspora community in the UK. We believe everyone deserves access to authentic African groceries, spices, and products that remind them of home.
          </Text>
          <Text style={styles.missionText}>
            By supporting local African vendors and providing a premium shopping experience, we're building a community that celebrates African culture and heritage.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <IconComponent size={24} color={Colors.secondary} weight="duotone" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactCard}>
            {CONTACT_ITEMS.map((item, index) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleOpenLink(item.url)}
                  activeOpacity={0.8}
                >
                  <View style={styles.contactIconContainer}>
                    <item.icon size={20} color={Colors.secondary} weight="duotone" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{item.label}</Text>
                    <Text style={styles.contactValue}>{item.value}</Text>
                  </View>
                  <CaretRight size={20} color={Colors.textMuted} weight="regular" />
                </TouchableOpacity>
                {index < CONTACT_ITEMS.length - 1 && <View style={styles.contactDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalCard}>
            {LEGAL_ITEMS.map((item, index) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity
                  style={styles.legalItem}
                  onPress={() => handleLegalPress(item.route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.legalLeft}>
                    <View style={styles.legalIconContainer}>
                      <item.icon size={18} color={Colors.textMuted} weight="duotone" />
                    </View>
                    <Text style={styles.legalLabel}>{item.label}</Text>
                  </View>
                  <CaretRight size={18} color={Colors.textMuted} weight="regular" />
                </TouchableOpacity>
                {index < LEGAL_ITEMS.length - 1 && <View style={styles.legalDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => handleOpenLink('https://ajibolagenius.carrd.co/')} activeOpacity={0.8}>
            <Text style={styles.footerText}>Made with 💚 in Nigeria</Text>
          </TouchableOpacity>
          <Text style={styles.copyright}>© {new Date().getFullYear()} Zora African Market Ltd.</Text>
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
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  // Brand Section
  brandSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  logoText: {
    fontFamily: FontFamily.display,
    fontSize: 48,
    color: Colors.primary,
    letterSpacing: LetterSpacing.wider,
  },
  logoSubtext: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.secondary,
    letterSpacing: LetterSpacing.widest,
    marginTop: -4,
  },
  tagline: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  // Mission Card
  missionCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.md,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  missionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}26`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  missionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.secondary}26`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  // Section
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
  },
  // Contact Card
  contactCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.secondary}26`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  contactValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.base,
  },
  // Legal Card
  legalCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.md,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  legalIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  legalDivider: {
    height: 1,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.base,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  copyright: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
});
