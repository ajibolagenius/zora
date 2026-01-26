import React, { useMemo } from 'react';
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
  Globe,
  Envelope,
  CaretRight,
  Heart,
  ShieldCheck,
  FileText,
  Star,
  Users,
  Storefront,
  ShoppingBag,
  Award,
  MapPin,
  Phone,
  ShareNetwork,
} from 'phosphor-react-native';

// Import social logos - they might not exist in all versions, so we'll use dynamic import
import * as PhosphorIcons from 'phosphor-react-native';

// Get social icons with fallbacks
const InstagramLogo = (PhosphorIcons as any).InstagramLogo || ShareNetwork;
const TwitterLogo = (PhosphorIcons as any).TwitterLogo || ShareNetwork;
const FacebookLogo = (PhosphorIcons as any).FacebookLogo || ShareNetwork;
const TiktokLogo = (PhosphorIcons as any).TiktokLogo || ShareNetwork;
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';

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

interface SocialLink {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  url: string;
  color: string;
}

// Define social links with fallbacks for icons that might not exist
const SOCIAL_LINKS_BASE: Omit<SocialLink, 'color'>[] = [
  { 
    id: 'instagram', 
    icon: InstagramLogo || ShareNetwork, 
    label: 'Instagram', 
    url: 'https://instagram.com/zoramarket' 
  },
  { 
    id: 'twitter', 
    icon: TwitterLogo || ShareNetwork, 
    label: 'Twitter', 
    url: 'https://twitter.com/zoramarket' 
  },
  { 
    id: 'facebook', 
    icon: FacebookLogo || ShareNetwork, 
    label: 'Facebook', 
    url: 'https://facebook.com/zoramarket' 
  },
  { 
    id: 'tiktok', 
    icon: TiktokLogo || ShareNetwork, 
    label: 'TikTok', 
    url: 'https://tiktok.com/@zoramarket' 
  },
];

interface LegalLink {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

const LEGAL_LINKS_BASE: Omit<LegalLink, 'color'>[] = [
  { id: 'terms', icon: FileText, label: 'Terms of Service' },
  { id: 'privacy', icon: ShieldCheck, label: 'Privacy Policy' },
  { id: 'licenses', icon: FileText, label: 'Licenses' },
];

interface StatItem {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

const STATS_BASE: Omit<StatItem, 'icon' | 'color'>[] = [
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Vendors' },
  { value: '10K+', label: 'Customers' },
];

const STAT_ICONS = [ShoppingBag, Storefront, Users];

export default function AboutScreen() {
  const router = useRouter();

  // Assign icons and colors to stats
  const stats = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return STATS_BASE.map((stat, index) => {
      const IconComponent = STAT_ICONS[index] || ShoppingBag;
      // Ensure icon is a valid component
      if (!IconComponent || typeof IconComponent !== 'function') {
        console.warn(`Invalid icon at index ${index}, using ShoppingBag fallback`);
        return {
          ...stat,
          icon: ShoppingBag,
          color: shuffledColors[index % shuffledColors.length],
        };
      }
      return {
        ...stat,
        icon: IconComponent,
        color: shuffledColors[index % shuffledColors.length],
      };
    });
  }, []);

  // Assign random colors to social links
  const socialLinks = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return SOCIAL_LINKS_BASE.map((link, index) => {
      // Ensure icon is valid - double check it's a function
      const IconComponent = link.icon;
      if (!IconComponent || typeof IconComponent !== 'function' || IconComponent === undefined) {
        console.warn(`Invalid social icon for ${link.id}, using ShareNetwork fallback`);
        return {
          ...link,
          icon: ShareNetwork, // Fallback to ShareNetwork which definitely exists
          color: shuffledColors[index % shuffledColors.length],
        };
      }
      return {
        ...link,
        icon: IconComponent, // Ensure we use the validated icon
        color: shuffledColors[index % shuffledColors.length],
      };
    });
  }, []);

  // Assign random colors to legal links
  const legalLinks = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return LEGAL_LINKS_BASE.map((link, index) => {
      // Ensure icon is valid
      if (!link.icon || typeof link.icon !== 'function') {
        console.warn(`Invalid legal icon for ${link.id}`);
        return {
          ...link,
          icon: FileText, // Fallback
          color: shuffledColors[index % shuffledColors.length],
        };
      }
      return {
        ...link,
        color: shuffledColors[index % shuffledColors.length],
      };
    });
  }, []);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleRateApp = () => {
    // Would open app store rating page
    console.log('Rate app');
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
        <Text style={styles.headerTitle}>About Zora</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ZORA</Text>
            <Text style={styles.logoSubtext}>AFRICAN MARKET</Text>
          </View>
          <Text style={styles.tagline}>
            Connecting the African diaspora{"\n"}with the taste of home
          </Text>
          <Text style={styles.version}>Version 1.0.0 (Build 2024.01)</Text>
        </View>

        {/* Mission Section */}
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
            // Validate icon is a valid React component
            if (!IconComponent || typeof IconComponent !== 'function') {
              console.warn(`Invalid stat icon at index ${index}, skipping`);
              return null;
            }
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                  <IconComponent size={24} color={stat.color} weight="duotone" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialGrid}>
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              // Validate icon is a valid React component
              if (!IconComponent || typeof IconComponent !== 'function') {
                console.warn(`Invalid social icon for ${social.id}, skipping`);
                return null;
              }
              return (
                <TouchableOpacity
                  key={social.id}
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(social.url)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.socialIconContainer, { backgroundColor: `${social.color}20` }]}>
                    <IconComponent size={28} color={social.color} weight="duotone" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleOpenLink('https://www.zoramarket.co.uk')}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: `${Colors.secondary}20` }]}>
                <Globe size={20} color={Colors.secondary} weight="duotone" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.zoramarket.co.uk</Text>
              </View>
              <CaretRight size={20} color={Colors.textMuted} weight="regular" />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleOpenLink('mailto:hello@zoramarket.co.uk')}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: `${Colors.secondary}20` }]}>
                <Envelope size={20} color={Colors.secondary} weight="duotone" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>hello@zoramarket.co.uk</Text>
              </View>
              <CaretRight size={20} color={Colors.textMuted} weight="regular" />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleOpenLink('tel:+442071234567')}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: `${Colors.secondary}20` }]}>
                <Phone size={20} color={Colors.secondary} weight="duotone" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+44 20 7123 4567</Text>
              </View>
              <CaretRight size={20} color={Colors.textMuted} weight="regular" />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleOpenLink('https://maps.google.com/?q=London,UK')}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: `${Colors.secondary}20` }]}>
                <MapPin size={20} color={Colors.secondary} weight="duotone" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>London, United Kingdom</Text>
              </View>
              <CaretRight size={20} color={Colors.textMuted} weight="regular" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalCard}>
            {legalLinks.map((link, index) => {
              const IconComponent = link.icon;
              // Validate icon is a valid React component
              if (!IconComponent || typeof IconComponent !== 'function') {
                console.warn(`Invalid legal icon for ${link.id}, skipping`);
                return null;
              }
              return (
                <View key={link.id}>
                  <TouchableOpacity 
                    style={styles.legalItem}
                    activeOpacity={0.8}
                  >
                    <View style={styles.legalLeft}>
                      <View style={[styles.legalIconContainer, { backgroundColor: `${link.color}20` }]}>
                        <IconComponent size={18} color={link.color} weight="duotone" />
                      </View>
                      <Text style={styles.legalLabel}>{link.label}</Text>
                    </View>
                    <CaretRight size={18} color={Colors.textMuted} weight="regular" />
                  </TouchableOpacity>
                  {index < legalLinks.length - 1 && <View style={styles.legalDivider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Rate App */}
        <TouchableOpacity
          style={styles.rateButton}
          onPress={handleRateApp}
          activeOpacity={0.8}
        >
          <View style={styles.rateIconContainer}>
            <Star size={24} color={Colors.secondary} weight="duotone" />
          </View>
          <Text style={styles.rateText}>Rate Zora on the App Store</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerIconContainer}>
            <Award size={32} color={Colors.secondary} weight="duotone" />
          </View>
          <Text style={styles.footerText}>Made with ❤️ in London</Text>
          <Text style={styles.copyright}>© 2024 Zora African Market Ltd.</Text>
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

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },

  // Logo Section
  logoSection: {
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
    backgroundColor: `${Colors.primary}20`,
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
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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

  // Social Grid
  socialGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contact Card
  contactCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
  },

  // Legal Card
  legalCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
  },

  // Rate Button
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: `${Colors.secondary}20`,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  rateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.secondary,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  footerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
