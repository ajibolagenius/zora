import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  InstagramLogo,
  TwitterLogo,
  FacebookLogo,
  TiktokLogo,
  Globe,
  Envelope,
  CaretRight,
  Heart,
  ShieldCheck,
  FileText,
  Star,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const MUTED_TEXT = '#bc9a9a';

const SOCIAL_LINKS = [
  { id: 'instagram', icon: InstagramLogo, label: 'Instagram', url: 'https://instagram.com/zoramarket' },
  { id: 'twitter', icon: TwitterLogo, label: 'Twitter', url: 'https://twitter.com/zoramarket' },
  { id: 'facebook', icon: FacebookLogo, label: 'Facebook', url: 'https://facebook.com/zoramarket' },
  { id: 'tiktok', icon: TiktokLogo, label: 'TikTok', url: 'https://tiktok.com/@zoramarket' },
];

const LEGAL_LINKS = [
  { id: 'terms', icon: FileText, label: 'Terms of Service' },
  { id: 'privacy', icon: ShieldCheck, label: 'Privacy Policy' },
  { id: 'licenses', icon: FileText, label: 'Licenses' },
];

export default function AboutScreen() {
  const router = useRouter();

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
            <Heart size={24} color={ZORA_RED} weight="fill" />
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
          <View style={styles.statCard}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>50+</Text>
            <Text style={styles.statLabel}>Vendors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10K+</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialGrid}>
            {SOCIAL_LINKS.map((social) => {
              const IconComponent = social.icon;
              return (
                <TouchableOpacity
                  key={social.id}
                  style={styles.socialButton}
                  onPress={() => handleOpenLink(social.url)}
                  activeOpacity={0.8}
                >
                  <IconComponent size={28} color={Colors.textPrimary} weight="fill" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Globe size={20} color={ZORA_YELLOW} weight="fill" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.zoramarket.co.uk</Text>
              </View>
              <CaretRight size={20} color={MUTED_TEXT} weight="regular" />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Envelope size={20} color={ZORA_YELLOW} weight="fill" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>hello@zoramarket.co.uk</Text>
              </View>
              <CaretRight size={20} color={MUTED_TEXT} weight="regular" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalCard}>
            {LEGAL_LINKS.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <React.Fragment key={link.id}>
                  <TouchableOpacity style={styles.legalItem}>
                    <View style={styles.legalLeft}>
                      <IconComponent size={18} color={MUTED_TEXT} weight="regular" />
                      <Text style={styles.legalLabel}>{link.label}</Text>
                    </View>
                    <CaretRight size={18} color={MUTED_TEXT} weight="regular" />
                  </TouchableOpacity>
                  {index < LEGAL_LINKS.length - 1 && <View style={styles.legalDivider} />}
                </React.Fragment>
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
          <Star size={24} color={ZORA_YELLOW} weight="fill" />
          <Text style={styles.rateText}>Rate Zora on the App Store</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: `${BACKGROUND_DARK}F2`,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
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
    gap: 24,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontFamily: FontFamily.display,
    fontSize: 48,
    color: ZORA_RED,
    letterSpacing: 8,
  },
  logoSubtext: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: ZORA_YELLOW,
    letterSpacing: 4,
    marginTop: -4,
  },
  tagline: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },

  // Mission Card
  missionCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    gap: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  missionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  missionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: ZORA_YELLOW,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },

  // Section
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    paddingHorizontal: 4,
  },

  // Social Grid
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contact Card
  contactCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },
  contactValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  contactDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Legal Card
  legalCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legalLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  legalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Rate Button
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 204, 0, 0.2)',
  },
  rateText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: ZORA_YELLOW,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  copyright: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },
});
