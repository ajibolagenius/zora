import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Question,
  Copy,
  Export,
  ChatCircle,
  ChatText,
  Envelope,
  QrCode,
  PaperPlaneTilt,
  ShoppingBag,
  CurrencyCircleDollar,
} from 'phosphor-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#2D1E18';
const MUTED_TEXT = '#bc9a9a';

// Mock user referral data
const USER_REFERRAL = {
  code: 'ADAEZE10',
  friendsJoined: 5,
  totalEarned: 50,
};

interface ReferralActivity {
  id: string;
  initials: string;
  name: string;
  status: 'completed' | 'pending';
  amount: number;
  color: string;
}

const REFERRAL_ACTIVITY: ReferralActivity[] = [
  { id: '1', initials: 'KB', name: 'Kwame B.', status: 'completed', amount: 10, color: '#8B5CF6' },
  { id: '2', initials: 'AO', name: 'Amara O.', status: 'completed', amount: 10, color: '#3B82F6' },
  { id: '3', initials: 'DA', name: 'David A.', status: 'pending', amount: 0, color: '#6B7280' },
];

const SHARE_OPTIONS = [
  { id: 'whatsapp', icon: ChatCircle, label: 'WhatsApp' },
  { id: 'sms', icon: ChatText, label: 'SMS' },
  { id: 'email', icon: Envelope, label: 'Email' },
  { id: 'qr', icon: QrCode, label: 'QR Code' },
];

const HOW_IT_WORKS = [
  { step: 1, icon: PaperPlaneTilt, text: 'Send your code to a friend' },
  { step: 2, icon: ShoppingBag, text: 'They place their 1st order' },
  { step: 3, icon: CurrencyCircleDollar, text: 'You both get £10 credit' },
];

export default function ReferralsScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(USER_REFERRAL.code);
    setCopied(true);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Zora African Market with my code ${USER_REFERRAL.code} and get £10 off your first order! 🛒🌍`,
        title: 'Share Zora African Market',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareOption = (option: string) => {
    // In a real app, these would open specific sharing intents
    handleShare();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Question size={24} color={Colors.textPrimary} weight="regular" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={styles.heroGradient} />
          {/* Hero Content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Give £10, Get £10</Text>
            <Text style={styles.heroSubtitle}>Share the taste of home with friends.</Text>
          </View>
        </View>

        {/* Referral Code Card */}
        <View style={styles.referralCard}>
          <Text style={styles.codeLabel}>YOUR UNIQUE REFERRAL CODE</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{USER_REFERRAL.code}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
              activeOpacity={0.8}
            >
              <Copy size={18} color={Colors.textPrimary} weight="bold" />
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Export size={20} color={Colors.textPrimary} weight="bold" />
            <Text style={styles.shareButtonText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        {/* Social Share Options */}
        <View style={styles.shareOptionsRow}>
          {SHARE_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={() => handleShareOption(option.id)}
                activeOpacity={0.8}
              >
                <View style={styles.shareOptionIcon}>
                  <IconComponent size={24} color={Colors.textPrimary} weight="fill" />
                </View>
                <Text style={styles.shareOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepsContainer}>
            {HOW_IT_WORKS.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <View
                  key={step.step}
                  style={[
                    styles.stepCard,
                    index === 2 && styles.stepCardHighlighted,
                  ]}
                >
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.step}</Text>
                  </View>
                  <IconComponent size={28} color={ZORA_RED} weight="fill" />
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Your Impact Section */}
        <View style={styles.impactCard}>
          {/* Stats Header */}
          <View style={styles.impactHeader}>
            <Text style={styles.impactTitle}>Your Impact</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{USER_REFERRAL.friendsJoined}</Text>
                <Text style={styles.statLabel}>Friends Joined</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueYellow]}>
                  £{USER_REFERRAL.totalEarned}
                </Text>
                <Text style={styles.statLabel}>Total Earned</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.activityHeader}>RECENT ACTIVITY</Text>
            {REFERRAL_ACTIVITY.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityAvatar, { backgroundColor: `${item.color}33` }]}>
                    <Text style={[styles.activityInitials, { color: item.color }]}>
                      {item.initials}
                    </Text>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>{item.name}</Text>
                    <Text
                      style={[
                        styles.activityStatus,
                        item.status === 'completed' ? styles.statusCompleted : styles.statusPending,
                      ]}
                    >
                      {item.status === 'completed' ? 'Order Completed' : 'Registered (No Order yet)'}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    item.status === 'completed' ? styles.amountEarned : styles.amountPending,
                  ]}
                >
                  {item.status === 'completed' ? `+£${item.amount}` : '£0'}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all history</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerButton: {
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
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Hero Section
  heroSection: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'transparent',
    // Simulating gradient with multiple views would be complex
    // Using a semi-transparent overlay instead
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: 'rgba(34, 23, 16, 0.7)',
  },
  heroTitle: {
    fontFamily: FontFamily.display,
    fontSize: 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Referral Card
  referralCard: {
    marginHorizontal: Spacing.base,
    marginTop: -16,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 10,
  },
  codeLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
    paddingLeft: 16,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: ZORA_YELLOW,
    letterSpacing: 4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ZORA_RED,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  copyButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  shareButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Share Options
  shareOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 32,
  },
  shareOption: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Section
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  // Steps
  stepsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  stepCard: {
    flex: 1,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepCardHighlighted: {
    backgroundColor: `${ZORA_RED}08`,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${ZORA_RED}33`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  stepText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Impact Card
  impactCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  impactHeader: {
    padding: 20,
    backgroundColor: SURFACE_DARK,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  impactTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontFamily: FontFamily.display,
    fontSize: 32,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  statValueYellow: {
    color: ZORA_YELLOW,
  },
  statLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },

  // Activity Section
  activitySection: {
    padding: 8,
  },
  activityHeader: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.lg,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInitials: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
  },
  activityInfo: {
    gap: 2,
  },
  activityName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  activityStatus: {
    fontFamily: FontFamily.body,
    fontSize: 10,
  },
  statusCompleted: {
    color: '#4CAF50',
  },
  statusPending: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  activityAmount: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
  },
  amountEarned: {
    color: ZORA_YELLOW,
  },
  amountPending: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: ZORA_RED,
  },
});
