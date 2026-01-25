import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const MUTED_TEXT = '#bc9a9a';
const DIVIDER_COLOR = '#563939';

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
            <CheckCircle size={24} color={ZORA_RED} weight="fill" />
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
                <Package size={20} color={ZORA_RED} weight="fill" />
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
                  <Camera size={24} color={MUTED_TEXT} weight="regular" />
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
              <Gavel size={28} color={MUTED_TEXT} weight="fill" />
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
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 48,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: 24,
  },

  // Header Card
  headerCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  disputeIdLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  disputeIdValue: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 204, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusDotOuter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 204, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ZORA_YELLOW,
  },
  statusBadgeText: {
    fontFamily: FontFamily.display,
    fontSize: 10,
    color: ZORA_YELLOW,
    letterSpacing: 1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
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
    color: MUTED_TEXT,
    marginBottom: 2,
  },
  headerCardValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Section
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: 20,
    color: Colors.textPrimary,
    paddingHorizontal: 4,
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 32,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 32,
    bottom: 0,
    width: 2,
    backgroundColor: ZORA_CARD,
  },
  timelineLineCompleted: {
    backgroundColor: 'rgba(204, 0, 0, 0.3)',
  },
  timelineLineActive: {
    backgroundColor: ZORA_CARD,
  },
  timelineIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_DARK,
    zIndex: 10,
  },
  activeIconOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: `${ZORA_RED}33`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ZORA_RED,
  },
  pendingIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ZORA_CARD,
    backgroundColor: BACKGROUND_DARK,
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
    marginBottom: 4,
  },
  timelineTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  timelineDate: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },
  timelineDateActive: {
    color: ZORA_RED,
    fontFamily: FontFamily.bodyMedium,
  },
  timelineDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },

  // Details Card
  detailsCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 24,
  },
  detailSection: {
    gap: 8,
  },
  detailLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Items List
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BACKGROUND_DARK,
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  itemQuantity: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },

  // Description
  descriptionBox: {
    backgroundColor: BACKGROUND_DARK,
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  descriptionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },

  // Evidence Grid
  evidenceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  evidenceImageContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  addEvidenceButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: BACKGROUND_DARK,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Resolution Card
  resolutionCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 12,
  },
  resolutionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BACKGROUND_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolutionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  resolutionDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: 32,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 52,
    borderRadius: BorderRadius.xl,
  },
  contactButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
