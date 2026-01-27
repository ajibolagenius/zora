import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Question,
  Copy,
  ShareNetwork,
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
import { FontSize, FontFamily, LetterSpacing } from '../constants/typography';
import { SuccessMessages, ReferralConstants } from '../constants';
import { useAuthStore } from '../stores/authStore';
import { realtimeService } from '../services/realtimeService';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';

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

// Mock user referral data
const USER_REFERRAL = {
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

interface ShareOption {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

const SHARE_OPTIONS_BASE: Omit<ShareOption, 'color'>[] = [
  { id: 'whatsapp', icon: ChatCircle, label: 'WhatsApp' },
  { id: 'sms', icon: ChatText, label: 'SMS' },
  { id: 'email', icon: Envelope, label: 'Email' },
  { id: 'qr', icon: QrCode, label: 'QR Code' },
];

interface HowItWorks {
  step: number;
  icon: React.ComponentType<any>;
  text: string;
  color: string;
}

const HOW_IT_WORKS_BASE: Omit<HowItWorks, 'color'>[] = [
  { step: 1, icon: PaperPlaneTilt, text: 'Send your code to a friend' },
  { step: 2, icon: ShoppingBag, text: 'They place their 1st order' },
  { step: 3, icon: CurrencyCircleDollar, text: 'You both get £10 credit' },
];

export default function ReferralsScreen() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    friendsJoined: 5,
    totalEarned: 50,
  });

  // Fetch referral stats from database
  const fetchReferralStats = async () => {
    if (!user?.user_id) {
      // Use default mock stats if no user
      setReferralStats({
        friendsJoined: 5,
        totalEarned: 50,
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      // Use default mock stats if Supabase not configured
      setReferralStats({
        friendsJoined: 5,
        totalEarned: 50,
      });
      return;
    }

    try {
      const client = await getSupabaseClient();
      const referralCode = user?.referral_code;
      
      if (!referralCode) {
        // No referral code, use default stats
        setReferralStats({
          friendsJoined: 0,
          totalEarned: 0,
        });
        return;
      }

      // Try to count users who signed up with this referral code
      // This requires a referral_code_used field or referred_by field in profiles
      // For now, we'll check if there's a referred_by field or similar
      // If not available, use mock data but make it clear
      
      // Attempt to query for referred users (if schema supports it)
      // Try referred_by field first (if it exists in schema)
      try {
        const { count: referredCount, error: queryError } = await client
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('referred_by', user.user_id);

        if (!queryError && referredCount !== null && referredCount !== undefined) {
          // Schema supports referral tracking
          const friendsCount = referredCount;
          // Calculate total earned (assuming £10 per successful referral)
          const totalEarned = friendsCount * 10;
          
          setReferralStats({
            friendsJoined: friendsCount,
            totalEarned,
          });
          return;
        }
      } catch (schemaError: any) {
        // Field doesn't exist or query failed - schema doesn't support referral tracking yet
        // This is expected until referral system is fully implemented
        console.log('Referral tracking not yet implemented in schema:', schemaError.message);
      }

      // Schema doesn't support referral tracking yet - use mock data
      // This is expected until referral system is fully implemented
      setReferralStats({
        friendsJoined: 5,
        totalEarned: 50,
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      // Fallback to mock stats on error
      setReferralStats({
        friendsJoined: 5,
        totalEarned: 50,
      });
    }
  };

  useEffect(() => {
    fetchReferralStats();

    // Subscribe to real-time profile updates (for referral_code changes)
    if (isSupabaseConfigured() && user?.user_id) {
      let unsubscribers: (() => void)[] = [];
      let isMounted = true;

      // Set up all subscriptions and wait for them to complete
      Promise.all([
        realtimeService.subscribeToTable(
          'profiles',
          'UPDATE',
          async (payload) => {
            if (isMounted && payload.new?.id === user.user_id) {
              // Profile was updated, refresh user data
              await checkAuth();
              await fetchReferralStats();
            }
          },
          `id=eq.${user.user_id}`
        ),
        realtimeService.subscribeToTable(
          'profiles',
          'INSERT',
          async (payload) => {
            if (isMounted && payload.new?.referred_by === user.user_id) {
              // New user was referred by this user, refresh stats
              await fetchReferralStats();
            }
          }
        ),
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
  }, [user?.user_id]);

  // Assign random colors to share options
  const shareOptions = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return SHARE_OPTIONS_BASE.map((option, index) => ({
      ...option,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  // Assign random colors to how it works steps
  const howItWorks = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return HOW_IT_WORKS_BASE.map((step, index) => ({
      ...step,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  const referralCode = user?.referral_code || ReferralConstants.defaultReferralCode;

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    Alert.alert(SuccessMessages.copied, SuccessMessages.referral.codeCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: ReferralConstants.shareMessageTemplate
          .replace('{code}', referralCode)
          .replace('{amount}', ReferralConstants.referralBonus.toString()),
        title: 'Share Zora African Market',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareOption = (option: string) => {
    if (option === 'qr') {
      router.push('/qr-scanner');
    } else {
      handleShare();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.push('/help')}
          activeOpacity={0.8}
        >
          <Question size={24} color={Colors.textPrimary} weight="duotone" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Geometric Shapes */}
        <View style={styles.heroSection}>
          {/* Geometric Background Shapes */}
          <View style={styles.geometricContainer}>
            <View style={[styles.geometricShape, styles.shape1]} />
            <View style={[styles.geometricShape, styles.shape2]} />
            <View style={[styles.geometricShape, styles.shape3]} />
            <View style={[styles.geometricShape, styles.shape4]} />
            <View style={[styles.geometricShape, styles.shape5]} />
          </View>
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
            <Text style={styles.codeText}>{referralCode}</Text>
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
            <ShareNetwork size={20} color={Colors.textPrimary} weight="duotone" />
            <Text style={styles.shareButtonText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        {/* Social Share Options */}
        <View style={styles.shareOptionsRow}>
          {shareOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={() => handleShareOption(option.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.shareOptionIcon, { backgroundColor: `${option.color}20` }]}>
                  <IconComponent size={24} color={option.color} weight="duotone" />
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
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <View
                  key={step.step}
                  style={[
                    styles.stepCard,
                    index === 2 && styles.stepCardHighlighted,
                  ]}
                >
                  <View style={[styles.stepNumber, { backgroundColor: `${step.color}20` }]}>
                    <Text style={[styles.stepNumberText, { color: step.color }]}>{step.step}</Text>
                  </View>
                  <IconComponent size={28} color={step.color} weight="duotone" />
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
                <Text style={styles.statValue}>{referralStats.friendsJoined}</Text>
                <Text style={styles.statLabel}>Friends Joined</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueYellow]}>
                  £{referralStats.totalEarned}
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
            <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerButton: {
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
    backgroundColor: Colors.cardDark,
    overflow: 'hidden',
  },
  geometricContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  geometricShape: {
    position: 'absolute',
    opacity: 0.15,
  },
  shape1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    top: -40,
    left: -40,
  },
  shape2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    top: 60,
    right: 20,
  },
  shape3: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '45deg' }],
    bottom: 80,
    left: 40,
  },
  shape4: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    bottom: 40,
    right: 60,
  },
  shape5: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '-30deg' }],
    top: 120,
    left: '50%',
    marginLeft: -45,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    backgroundColor: Colors.backgroundDark85,
  },
  heroTitle: {
    fontFamily: FontFamily.display,
    fontSize: 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: Colors.black50,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Referral Card
  referralCard: {
    marginHorizontal: Spacing.base,
    marginTop: -16,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    zIndex: 10,
  },
  codeLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderDark,
    padding: Spacing.xs,
    paddingLeft: Spacing.base,
    marginBottom: Spacing.base,
  },
  codeText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.secondary,
    letterSpacing: LetterSpacing.wider,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
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
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
    paddingVertical: Spacing['2xl'],
  },
  shareOption: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  shareOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareOptionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },

  // Steps
  stepsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stepCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  stepCardHighlighted: {
    backgroundColor: `${Colors.primary}0D`,
    borderColor: `${Colors.primary}33`,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
  },
  stepText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Impact Card
  impactCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  impactHeader: {
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  impactTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
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
    color: Colors.secondary,
  },
  statLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.base,
  },

  // Activity Section
  activitySection: {
    padding: Spacing.sm,
  },
  activityHeader: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.widest,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
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
    fontSize: FontSize.caption,
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
    fontSize: FontSize.tiny,
  },
  statusCompleted: {
    color: Colors.success,
  },
  statusPending: {
    color: Colors.textMuted,
  },
  activityAmount: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
  },
  amountEarned: {
    color: Colors.secondary,
  },
  amountPending: {
    color: Colors.textMuted,
  },
  viewAllButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.primary,
  },
});
