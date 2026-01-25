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
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ArrowsClockwise,
  Warning,
  ShoppingBag,
  Camera,
  HourglassHigh,
  Question,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#231f0f';
const BACKGROUND_DARK = '#181710';
const MUTED_TEXT = '#999999';
const TIMELINE_LINE = '#3a3627';

interface TimelineStep {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: '1',
    title: 'Dispute Raised',
    subtitle: 'Oct 24, 10:30 AM',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Evidence Received',
    subtitle: 'Oct 24, 10:45 AM',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Zora Team Review',
    subtitle: 'In Progress • Est. 24h',
    status: 'active',
  },
  {
    id: '4',
    title: 'Final Decision',
    subtitle: 'Pending',
    status: 'pending',
  },
];

const EVIDENCE_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
];

export default function DisputeStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const renderTimelineStep = (step: TimelineStep, index: number) => {
    const isLast = index === TIMELINE_STEPS.length - 1;
    const isPending = step.status === 'pending';

    return (
      <View
        key={step.id}
        style={[
          styles.timelineStep,
          isPending && styles.timelineStepPending,
        ]}
      >
        {/* Timeline Icon and Line */}
        <View style={styles.timelineLeft}>
          {step.status === 'completed' ? (
            <View style={styles.stepIconCompleted}>
              <Check size={14} color={Colors.textPrimary} weight="bold" />
            </View>
          ) : step.status === 'active' ? (
            <View style={styles.stepIconActive}>
              <ArrowsClockwise size={14} color={ZORA_CARD} weight="bold" />
            </View>
          ) : (
            <View style={styles.stepIconPending}>
              <View style={styles.stepIconPendingDot} />
            </View>
          )}

          {/* Connecting Line */}
          {!isLast && (
            <View
              style={[
                styles.timelineLine,
                step.status === 'completed' && styles.timelineLineCompleted,
                step.status === 'active' && styles.timelineLineActive,
              ]}
            />
          )}
        </View>

        {/* Content */}
        <View style={styles.timelineRight}>
          <Text
            style={[
              styles.stepTitle,
              step.status === 'completed' && styles.stepTitleCompleted,
              step.status === 'active' && styles.stepTitleActive,
            ]}
          >
            {step.title}
          </Text>
          <Text
            style={[
              styles.stepSubtitle,
              step.status === 'active' && styles.stepSubtitleActive,
            ]}
          >
            {step.subtitle}
          </Text>
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
        {/* Summary Header Card */}
        <View style={styles.summaryCard}>
          {/* Decorative Background */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <Text style={styles.disputeNumber}>Dispute #88392</Text>
          <Text style={styles.orderNumber}>Order #ZAM-9921</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>UNDER REVIEW</Text>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRACKER</Text>
          <View style={styles.timelineContainer}>
            {TIMELINE_STEPS.map((step, index) => renderTimelineStep(step, index))}
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.detailsCard}>
            {/* Issue Type */}
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Warning size={20} color={Colors.textPrimary} weight="fill" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>ISSUE TYPE</Text>
                <Text style={styles.detailValue}>Item Damaged</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            {/* Product */}
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <ShoppingBag size={20} color={Colors.textPrimary} weight="fill" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>PRODUCT</Text>
                <Text style={styles.detailValue}>Spicy Plantain Chips x2</Text>
              </View>
            </View>

            {/* Evidence Gallery */}
            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceLabel}>SUBMITTED EVIDENCE</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.evidenceGallery}
              >
                {EVIDENCE_IMAGES.map((uri, index) => (
                  <View key={index} style={styles.evidenceImageContainer}>
                    <Image source={{ uri }} style={styles.evidenceImage} />
                  </View>
                ))}
                <TouchableOpacity style={styles.addEvidenceButton}>
                  <Camera size={20} color={MUTED_TEXT} weight="regular" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Resolution Footer Card */}
        <View style={styles.resolutionCard}>
          <View style={styles.resolutionIconContainer}>
            <HourglassHigh size={24} color={MUTED_TEXT} weight="fill" />
          </View>
          <View style={styles.resolutionContent}>
            <Text style={styles.resolutionTitle}>Pending Decision</Text>
            <Text style={styles.resolutionDescription}>
              We're reviewing your case. Expect an update within 24 hours.
            </Text>
          </View>
        </View>

        {/* Help Link */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push('/help')}
        >
          <Question size={16} color={MUTED_TEXT} weight="regular" />
          <Text style={styles.helpButtonText}>Need help with this dispute?</Text>
        </TouchableOpacity>

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
    backgroundColor: 'rgba(24, 23, 16, 0.95)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: Spacing.base,
    paddingTop: 16,
  },

  // Summary Card
  summaryCard: {
    alignItems: 'center',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 204, 0, 0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -32,
    left: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 204, 0, 0.05)',
  },
  disputeNumber: {
    fontFamily: FontFamily.display,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  orderNumber: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: ZORA_YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.small,
    color: ZORA_CARD,
    letterSpacing: 1,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 24,
  },
  timelineStepPending: {
    opacity: 0.5,
    paddingBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  stepIconCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ZORA_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconPending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SURFACE_DARK,
    borderWidth: 2,
    borderColor: MUTED_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconPendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MUTED_TEXT,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: TIMELINE_LINE,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: ZORA_RED,
  },
  timelineLineActive: {
    backgroundColor: TIMELINE_LINE,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  stepTitleCompleted: {
    color: Colors.textPrimary,
  },
  stepTitleActive: {
    color: ZORA_YELLOW,
  },
  stepSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
  },
  stepSubtitleActive: {
    color: 'rgba(255, 204, 0, 0.8)',
  },

  // Details Card
  detailsCard: {
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 16,
  },
  evidenceSection: {
    marginTop: 20,
    gap: 12,
  },
  evidenceLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: MUTED_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  evidenceGallery: {
    gap: 12,
  },
  evidenceImageContainer: {
    width: 80,
    height: 80,
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
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Resolution Card
  resolutionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: MUTED_TEXT,
    marginBottom: 16,
  },
  resolutionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolutionContent: {
    flex: 1,
    gap: 4,
  },
  resolutionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  resolutionDescription: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: MUTED_TEXT,
    lineHeight: 18,
  },

  // Help Button
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  helpButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    color: MUTED_TEXT,
  },
});
