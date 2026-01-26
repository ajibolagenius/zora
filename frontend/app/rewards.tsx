import React, { useMemo } from 'react';
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
  ArrowLeft,
  CheckCircle,
  UserPlus,
  ShoppingBag,
  Star,
  Medal,
  PencilSimple,
  InstagramLogo,
  UsersThree,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../constants/typography';
import { useAuthStore } from '../stores/authStore';

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

// Mock data for the rewards screen
const CURRENT_BENEFITS = [
  'Free Delivery on all orders',
  '5% Cash Back on produce',
  'Exclusive Birthday Gift',
];

interface ActivityItem {
  id: string;
  type: 'referral' | 'purchase' | 'challenge';
  title: string;
  date: string;
  amount: string;
  isPositive: boolean;
  isPoints?: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const RECENT_ACTIVITY_BASE: Omit<ActivityItem, 'icon' | 'color'>[] = [
  {
    id: '1',
    type: 'referral',
    title: 'Referral Bonus',
    date: 'Today, 10:30 AM',
    amount: '+£5.00',
    isPositive: true,
  },
  {
    id: '2',
    type: 'purchase',
    title: 'Purchase: Jollof Rice',
    date: 'Yesterday, 4:15 PM',
    amount: '-£3.50',
    isPositive: false,
  },
  {
    id: '3',
    type: 'challenge',
    title: 'Weekly Challenge',
    date: 'Oct 24, 2023',
    amount: '+150 pts',
    isPositive: true,
    isPoints: true,
  },
];

interface EarnCard {
  id: string;
  title: string;
  description: string;
  points: string;
  buttonText: string;
  imageUrl: string;
  icon: React.ComponentType<any>;
  color: string;
}

const EARN_CARDS_BASE: Omit<EarnCard, 'icon' | 'color'>[] = [
  {
    id: '1',
    title: 'Leave a Review',
    description: 'Share your thoughts on your recent purchase.',
    points: '+50 POINTS',
    buttonText: 'Write Review',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
  },
  {
    id: '2',
    title: 'Follow on Instagram',
    description: 'Stay updated with our latest offers.',
    points: '+20 POINTS',
    buttonText: 'Follow Us',
    imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400',
  },
  {
    id: '3',
    title: 'Refer a Friend',
    description: 'Give £5, get £5 when they order.',
    points: '+100 POINTS',
    buttonText: 'Invite',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Assign icons and colors to activities
  const recentActivity = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return RECENT_ACTIVITY_BASE.map((item, index) => ({
      ...item,
      icon: item.type === 'referral' ? UserPlus : item.type === 'purchase' ? ShoppingBag : Star,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  // Assign icons and colors to earn cards
  const earnCards = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return EARN_CARDS_BASE.map((card, index) => ({
      ...card,
      icon: card.id === '1' ? PencilSimple : card.id === '2' ? InstagramLogo : UsersThree,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  // User rewards data
  const userRewards = {
    credit: user?.zora_credits || 12.50,
    totalPoints: user?.loyalty_points || 2450,
    tier: user?.membership_tier || 'gold',
    nextTier: user?.membership_tier === 'gold' ? 'Platinum' : 'Gold',
    pointsToNextTier: 550,
    progressPercent: 82,
  };

  const getAmountColor = (item: ActivityItem) => {
    if (item.isPoints) return Colors.secondary;
    if (item.isPositive) return Colors.success;
    return Colors.textPrimary;
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
        <Text style={styles.headerTitle}>Zora Rewards</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          {/* Credit and Points Row */}
          <View style={styles.balanceRow}>
            {/* Zora Credit */}
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>ZORA CREDIT</Text>
              <Text style={styles.creditValue}>£{userRewards.credit.toFixed(2)}</Text>
            </View>

            {/* Total Points */}
            <View style={[styles.balanceItem, styles.balanceItemRight]}>
              <Text style={styles.balanceLabel}>TOTAL POINTS</Text>
              <Text style={styles.pointsValue}>{userRewards.totalPoints.toLocaleString()}</Text>
            </View>
          </View>

          {/* Tier Progress */}
          <View style={styles.tierSection}>
            <View style={styles.tierRow}>
              <Text style={styles.tierName}>
                {userRewards.tier.charAt(0).toUpperCase() + userRewards.tier.slice(1)} Tier
              </Text>
              <Text style={styles.tierProgress}>
                {userRewards.pointsToNextTier} points to {userRewards.nextTier}
              </Text>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${userRewards.progressPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Current Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Benefits</Text>
          <View style={styles.benefitsCard}>
            {/* Gold Badge Icon */}
            <View style={styles.badgeContainer}>
              <Medal size={32} color={Colors.secondary} weight="duotone" />
            </View>
            {/* Benefits List */}
            <View style={styles.benefitsList}>
              {CURRENT_BENEFITS.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <CheckCircle size={20} color={Colors.primary} weight="duotone" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityCard}>
            {recentActivity.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.activityItem,
                    index < recentActivity.length - 1 && styles.activityItemBorder,
                  ]}
                >
                  <View style={[styles.activityIcon, { backgroundColor: `${item.color}20` }]}>
                    <IconComponent size={20} color={item.color} weight="duotone" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDate}>{item.date}</Text>
                  </View>
                  <Text style={[styles.activityAmount, { color: getAmountColor(item) }]}>
                    {item.amount}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ways to Earn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ways to Earn</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.earnCardsContainer}
          >
            {earnCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <View key={card.id} style={styles.earnCard}>
                  {/* Card Image */}
                  <View style={styles.earnImageContainer}>
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={styles.earnImage}
                      resizeMode="cover"
                    />
                    {/* Gradient Overlay */}
                    <View style={styles.earnImageOverlay} />
                    {/* Points Badge */}
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsBadgeText}>{card.points}</Text>
                    </View>
                    {/* Icon Badge */}
                    <View style={[styles.iconBadge, { backgroundColor: `${card.color}20` }]}>
                      <IconComponent size={24} color={card.color} weight="duotone" />
                    </View>
                  </View>
                  {/* Card Content */}
                  <View style={styles.earnContent}>
                    <Text style={styles.earnTitle}>{card.title}</Text>
                    <Text style={styles.earnDescription}>{card.description}</Text>
                    <TouchableOpacity 
                      style={styles.earnButton}
                      onPress={() => {
                        if (card.id === '1') router.push('/write-review');
                        else if (card.id === '3') router.push('/referrals');
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.earnButtonText}>{card.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom padding for safe area */}
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
    fontSize: FontSize.h3,
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
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    gap: Spacing.xl,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  balanceItem: {
    flexDirection: 'column',
  },
  balanceItemRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wider,
    marginBottom: Spacing.xs,
  },
  creditValue: {
    fontFamily: FontFamily.display,
    fontSize: 36,
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  pointsValue: {
    fontFamily: FontFamily.display,
    fontSize: 28,
    color: Colors.secondary,
    lineHeight: 32,
  },
  tierSection: {
    gap: Spacing.sm,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tierName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  tierProgress: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },

  // Sections
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },

  // Benefits Card
  benefitsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  benefitsList: {
    flex: 1,
    gap: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    flex: 1,
  },

  // Activity Card
  activityCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  activityDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activityAmount: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
  },

  // Earn Cards
  earnCardsContainer: {
    paddingRight: Spacing.base,
    gap: Spacing.base,
  },
  earnCard: {
    width: 240,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  earnImageContainer: {
    height: 128,
    position: 'relative',
  },
  earnImage: {
    width: '100%',
    height: '100%',
  },
  earnImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
  pointsBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  pointsBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.tiny,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  iconBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnContent: {
    padding: Spacing.md,
    gap: Spacing.xs,
    flex: 1,
  },
  earnTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  earnDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  earnButton: {
    backgroundColor: Colors.backgroundDark,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  earnButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
});
