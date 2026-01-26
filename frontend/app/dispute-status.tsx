import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Headset,
  Gavel,
  Camera,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'active' | 'pending';
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: '1',
    title: 'Dispute Filed',
    description: 'Request received by support.',
    date: 'Oct 24',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Evidence Submitted',
    description: 'Photos and description added.',
    date: 'Oct 24',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Zora Review',
    description: 'Our team is reviewing the case details.',
    date: 'In Progress',
    status: 'active',
  },
  {
    id: '4',
    title: 'Final Resolution',
    description: 'Refund decision and closure.',
    date: 'Pending',
    status: 'pending',
  },
];

const AFFECTED_ITEMS = [
  { id: '1', name: 'Plantains (5kg)', quantity: 1 },
  { id: '2', name: 'Palm Oil (1L)', quantity: 2 },
];

const EVIDENCE_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
];

export default function DisputeStatusScreen() {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderTimelineStep = (step: TimelineStep, index: number) => {
    const isLast = index === TIMELINE_STEPS.length - 1;
    const isCompleted = step.status === 'completed';
    const isActive = step.status === 'active';
    const isPending = step.status === 'pending';

    return (
      <View key={step.id} style={styles.timelineStep}>
        {/* Vertical Line */}
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              isCompleted && styles.timelineLineCompleted,
              isActive && styles.timelineLineActive,
            ]}
          />
        )}

        {/* Icon */}
        <View style={styles.timelineIconContainer}>
          {isCompleted ? (
            <CheckCircle size={24} color={Colors.primary} weight="fill" />
          ) : isActive ? (
            <View style={styles.activeIconOuter}>
              <View style={styles.activeIconInner} />
            </View>
          ) : (
            <View style={styles.pendingIcon} />
          )}
        </View>

        {/* Content */}
        <View style={[styles.timelineContent, isPending && styles.timelineContentPending]}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>{step.title}</Text>
            <Text
              style={[
                styles.timelineDate,
                isActive && styles.timelineDateActive,
              ]}
            >
              {step.date}
            </Text>
          </View>
          <Text style={styles.timelineDescription}>{step.description}</Text>
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Dispute Status</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerCardTop}>
            <View>
              <Text style={styles.disputeIdLabel}>DISPUTE ID</Text>
              <Text style={styles.disputeIdValue}>#92831</Text>
            </View>
            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <View style={styles.statusDotOuter}>
                <View style={styles.statusDotInner} />
              </View>
              <Text style={styles.statusBadgeText}>UNDER REVIEW</Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.headerCardBottom}>
            <View>
              <Text style={styles.headerCardLabel}>Order ID</Text>
              <Text style={styles.headerCardValue}>#ZN-4421</Text>
            </View>
            <View style={styles.headerCardRight}>
              <Text style={styles.headerCardLabel}>Amount</Text>
              <Text style={styles.headerCardValue}>$84.50</Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timelineContainer}>
            {TIMELINE_STEPS.map((step, index) => renderTimelineStep(step, index))}
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            {/* Issue Type */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>ISSUE TYPE</Text>
              <View style={styles.detailRow}>
                <Package size={20} color={Colors.primary} weight="duotone" />
                <Text style={styles.detailValue}>Item Not Received</Text>
              </View>
            </View>

            {/* Affected Items */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>AFFECTED ITEMS</Text>
              <View style={styles.itemsList}>
                {AFFECTED_ITEMS.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>USER DESCRIPTION</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>
                  Package was marked delivered by the courier but never arrived at my doorstep. I checked with neighbors and the front desk, but no one has seen it.
                </Text>
              </View>
            </View>

            {/* Evidence */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>EVIDENCE SUBMITTED</Text>
              <View style={styles.evidenceGrid}>
                {EVIDENCE_IMAGES.map((uri, index) => (
                  <View key={index} style={styles.evidenceImageContainer}>
                    <Image source={{ uri }} style={styles.evidenceImage} />
                  </View>
                ))}
                <TouchableOpacity style={styles.addEvidenceButton}>
                  <Camera size={24} color={Colors.textMuted} weight="duotone" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Resolution Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolution</Text>
          <View style={styles.resolutionCard}>
            <View style={styles.resolutionIconContainer}>
              <Gavel size={28} color={Colors.textMuted} weight="duotone" />
            </View>
            <Text style={styles.resolutionTitle}>Outcome Pending</Text>
            <Text style={styles.resolutionDescription}>
              A final decision will be made within 24-48 hours. You will be notified via email.
            </Text>
          </View>
        </View>

        {/* Bottom padding for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => router.push('/help')}
          activeOpacity={0.8}
        >
          <Headset size={20} color={Colors.textPrimary} weight="fill" />
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
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
    gap: Spacing.lg,
  },

  // Header Card
  headerCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  disputeIdLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  disputeIdValue: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.secondary10,
    borderWidth: 1,
    borderColor: Colors.secondary + '40', // 25% opacity
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusDotOuter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary + '4D', // 30% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  statusBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.white08,
    marginBottom: Spacing.base,
  },
  headerCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCardRight: {
    alignItems: 'flex-end',
  },
  headerCardLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  headerCardValue: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Section
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
  },

  // Timeline
  timelineContainer: {
    paddingLeft: Spacing.sm,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: Spacing.base,
    paddingBottom: Spacing.xl,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 32,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.white10,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.primary30,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    zIndex: 10,
  },
  activeIconOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  pendingIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white20,
    backgroundColor: Colors.backgroundDark,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineContentPending: {
    opacity: 0.5,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  timelineTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  timelineDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  timelineDateActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bodySemiBold,
  },
  timelineDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },

  // Details Card
  detailsCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    gap: Spacing.lg,
  },
  detailSection: {
    gap: Spacing.sm,
  },
  detailLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Items List
  itemsList: {
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundDark,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  itemName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  itemQuantity: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },

  // Description
  descriptionBox: {
    backgroundColor: Colors.backgroundDark,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  descriptionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Evidence Grid
  evidenceGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  evidenceImageContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.white10,
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  addEvidenceButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderOutline,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Resolution Card
  resolutionCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.white10,
    alignItems: 'center',
    gap: Spacing.md,
  },
  resolutionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolutionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  resolutionDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: 'transparent',
    height: Heights.button,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contactButtonText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
});
