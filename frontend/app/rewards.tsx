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
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_GREEN = '#4CAF50';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#2D1E18';
const MUTED_TEXT = '#bc9a9a';

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
}

const RECENT_ACTIVITY: ActivityItem[] = [
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
}

const EARN_CARDS: EarnCard[] = [
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

// User rewards data (would come from API in real app)
const USER_REWARDS = {
  credit: 12.50,
  totalPoints: 2450,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 550,
  progressPercent: 82,
};

export default function RewardsScreen() {
  const router = useRouter();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return <UserPlus size={20} color={ZORA_GREEN} weight="fill" />;
      case 'purchase':
        return <ShoppingBag size={20} color={Colors.textPrimary} weight="fill" />;
      case 'challenge':
        return <Star size={20} color={ZORA_YELLOW} weight="fill" />;
      default:
        return <Star size={20} color={Colors.textPrimary} weight="fill" />;
    }
  };

  const getAmountColor = (item: ActivityItem) => {
    if (item.isPoints) return ZORA_YELLOW;
    if (item.isPositive) return ZORA_GREEN;
    return Colors.textPrimary;
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
              <Text style={styles.creditValue}>£{USER_REWARDS.credit.toFixed(2)}</Text>
            </View>

            {/* Total Points */}
            <View style={[styles.balanceItem, styles.balanceItemRight]}>
              <Text style={styles.balanceLabel}>TOTAL POINTS</Text>
              <Text style={styles.pointsValue}>{USER_REWARDS.totalPoints.toLocaleString()}</Text>
            </View>
          </View>

          {/* Tier Progress */}
          <View style={styles.tierSection}>
            <View style={styles.tierRow}>
              <Text style={styles.tierName}>{USER_REWARDS.tier} Tier</Text>
              <Text style={styles.tierProgress}>
                {USER_REWARDS.pointsToNextTier} points to {USER_REWARDS.nextTier}
              </Text>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${USER_REWARDS.progressPercent}%` },
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
              <Medal size={32} color={Colors.textPrimary} weight="fill" />
            </View>
            {/* Benefits List */}
            <View style={styles.benefitsList}>
              {CURRENT_BENEFITS.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <CheckCircle size={20} color={ZORA_RED} weight="fill" />
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
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityCard}>
            {RECENT_ACTIVITY.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  index < RECENT_ACTIVITY.length - 1 && styles.activityItemBorder,
                ]}
              >
                <View style={styles.activityIcon}>
                  {getActivityIcon(item.type)}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
                <Text style={[styles.activityAmount, { color: getAmountColor(item) }]}>
                  {item.amount}
                </Text>
              </View>
            ))}
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
            {EARN_CARDS.map((card) => (
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
                </View>
                {/* Card Content */}
                <View style={styles.earnContent}>
                  <Text style={styles.earnTitle}>{card.title}</Text>
                  <Text style={styles.earnDescription}>{card.description}</Text>
                  <TouchableOpacity style={styles.earnButton}>
                    <Text style={styles.earnButtonText}>{card.buttonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding for safe area */}
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
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginRight: 48,
  },
  headerRight: {
    width: 48,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    gap: 24,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
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
    color: ZORA_YELLOW,
    lineHeight: 32,
  },
  tierSection: {
    gap: 8,
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
    color: MUTED_TEXT,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#181010',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ZORA_RED,
    borderRadius: 6,
  },

  // Sections
  section: {
    gap: 12,
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
    color: MUTED_TEXT,
  },

  // Benefits Card
  benefitsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ZORA_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsList: {
    flex: 1,
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },

  // Activity Card
  activityCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    color: MUTED_TEXT,
    marginTop: 2,
  },
  activityAmount: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
  },

  // Earn Cards
  earnCardsContainer: {
    paddingRight: Spacing.base,
    gap: 16,
  },
  earnCard: {
    width: 240,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    // Gradient effect simulated with opacity
    opacity: 0.8,
  },
  pointsBadge: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    backgroundColor: 'rgba(204, 0, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  pointsBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  earnContent: {
    padding: 12,
    gap: 4,
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
    color: MUTED_TEXT,
    marginBottom: 8,
  },
  earnButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: 'auto',
  },
  earnButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
});
