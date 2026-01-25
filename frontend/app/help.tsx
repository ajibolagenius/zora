import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MagnifyingGlass,
  Truck,
  ChatCircle,
  Phone,
  Envelope,
  Package,
  CreditCard,
  User,
  Gift,
  CaretRight,
  ArrowRight,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#2D1E18';
const ICON_BG = '#463222';
const MUTED_TEXT = '#bc9a9a';

interface QuickAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  route?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'track', icon: Truck, label: 'Track Order', route: '/(tabs)/orders' },
  { id: 'chat', icon: ChatCircle, label: 'Live Chat' },
  { id: 'call', icon: Phone, label: 'Call Us' },
  { id: 'email', icon: Envelope, label: 'Email' },
];

interface TopicItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  route?: string;
}

const FAQ_TOPICS: TopicItem[] = [
  { id: '1', icon: Package, label: 'Orders & Shipping' },
  { id: '2', icon: CreditCard, label: 'Payments & Refunds' },
  { id: '3', icon: User, label: 'Account Settings' },
  { id: '4', icon: Gift, label: 'Zora Rewards', route: '/rewards' },
];

const POPULAR_QUESTIONS = [
  { id: '1', question: 'Where is my order?' },
  { id: '2', question: 'How do I reset my password?' },
  { id: '3', question: 'Do you ship internationally?' },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      router.push(action.route);
    } else if (action.id === 'chat') {
      // Navigate to latest order support if exists
      router.push('/order-support/ord_001');
    } else {
      console.log(`${action.label} pressed`);
    }
  };

  const handleTopicPress = (topic: TopicItem) => {
    if (topic.route) {
      router.push(topic.route);
    } else {
      console.log(`${topic.label} pressed`);
    }
  };

  const handleContactUs = () => {
    console.log('Contact Us pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MagnifyingGlass size={24} color={MUTED_TEXT} weight="regular" />
            <TextInput
              style={styles.searchInput}
              placeholder="How can we help?"
              placeholderTextColor={MUTED_TEXT}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.8}
                >
                  <View style={styles.quickActionIcon}>
                    <IconComponent size={24} color={Colors.textPrimary} weight="fill" />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Browse by Topic */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Topic</Text>
          <View style={styles.topicsList}>
            {FAQ_TOPICS.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicItem}
                  onPress={() => handleTopicPress(topic)}
                  activeOpacity={0.8}
                >
                  <View style={styles.topicLeft}>
                    <View style={styles.topicIconContainer}>
                      <IconComponent size={20} color={MUTED_TEXT} weight="fill" />
                    </View>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                  </View>
                  <CaretRight size={24} color={ZORA_RED} weight="bold" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Popular Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Questions</Text>
          <View style={styles.questionsContainer}>
            {POPULAR_QUESTIONS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.questionItem,
                  index < POPULAR_QUESTIONS.length - 1 && styles.questionItemBorder,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <ArrowRight size={20} color={MUTED_TEXT} weight="regular" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom padding for contact card */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Contact Card */}
      <View style={styles.contactCardContainer}>
        <View style={styles.contactCard}>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>Our team is available 24/7.</Text>
          </View>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactUs}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(34, 23, 16, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#3a2727',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerRight: {
    width: 40,
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    paddingTop: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Topics List
  topicsList: {
    gap: 12,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: ICON_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Popular Questions
  questionsContainer: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
  },
  questionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ICON_BG,
  },
  questionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },

  // Contact Card
  contactCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingTop: 32,
    backgroundColor: 'transparent',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: ICON_BG,
  },
  contactTextContainer: {
    gap: 4,
  },
  contactTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  contactSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: MUTED_TEXT,
  },
  contactButton: {
    backgroundColor: ZORA_RED,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  contactButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
});
