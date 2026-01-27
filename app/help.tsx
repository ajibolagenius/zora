import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Linking,
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
  ArrowsLeftRight,
  User,
  CaretRight,
  Headset,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../constants/typography';
import { Placeholders } from '../constants';

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

interface QuickAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  route?: string;
  color: string;
}

const QUICK_ACTIONS_BASE: Omit<QuickAction, 'color'>[] = [
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
  color: string;
}

const FAQ_TOPICS_BASE: Omit<TopicItem, 'color'>[] = [
  { id: '1', icon: Package, label: 'Orders & Delivery' },
  { id: '2', icon: CreditCard, label: 'Payments & Refunds' },
  { id: '3', icon: ArrowsLeftRight, label: 'Returns & Exchanges' },
  { id: '4', icon: User, label: 'Account Settings' },
];

const POPULAR_QUESTIONS = [
  { id: '1', question: 'Where is my order?' },
  { id: '2', question: 'How do I change my delivery address?' },
  { id: '3', question: 'What payment methods do you accept?' },
  { id: '4', question: 'How can I apply a discount code?' },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Assign random colors to quick actions
  const quickActions = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return QUICK_ACTIONS_BASE.map((action, index) => ({
      ...action,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  // Assign random colors to topics
  const faqTopics = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return FAQ_TOPICS_BASE.map((topic, index) => ({
      ...topic,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, []);

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      router.push(action.route as any);
    } else if (action.id === 'chat') {
      router.push('/order-support/ord_001');
    } else if (action.id === 'email') {
      Linking.openURL('mailto:zoraafricanmarketapp@gmail.com');
    } else {
      console.log(`${action.label} pressed`);
    }
  };

  const handleTopicPress = (topic: TopicItem) => {
    if (topic.route) {
      router.push(topic.route as any);
    } else {
      console.log(`${topic.label} pressed`);
    }
  };

  const handleContactUs = () => {
    router.push('/order-support/ord_001');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MagnifyingGlass size={20} color={Colors.textMuted} weight="duotone" />
            <TextInput
              style={styles.searchInput}
              placeholder={Placeholders.form.helpMessage}
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onBlur={() => Keyboard.dismiss()}
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
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                    <IconComponent size={24} color={action.color} weight="duotone" />
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
            {faqTopics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicItem}
                  onPress={() => handleTopicPress(topic)}
                  activeOpacity={0.8}
                >
                  <View style={styles.topicLeft}>
                    <View style={[styles.topicIconContainer, { backgroundColor: `${topic.color}20` }]}>
                      <IconComponent size={20} color={topic.color} weight="duotone" />
                    </View>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                  </View>
                  <CaretRight size={20} color={Colors.textMuted} weight="bold" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Popular Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Questions</Text>
          <View style={styles.questionsCard}>
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
                <CaretRight size={20} color={Colors.textMuted} weight="regular" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.contactCard}>
          {/* Decorative circles */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.contactContent}>
            <View style={styles.contactIconContainer}>
              <Headset size={24} color={Colors.primary} weight="duotone" />
            </View>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>
              Our Zora support team is available 24/7 to assist you.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactUs}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>Contact Us</Text>
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
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
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
    flex: 1,
    textAlign: 'center',
    marginRight: 44,
  },
  headerRight: {
    width: 44,
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },

  // Sections
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.xs,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  quickAction: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Topics List
  topicsList: {
    gap: Spacing.md,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  // Questions Card
  questionsCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
  },
  questionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  questionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    flex: 1,
  },

  // Contact Card
  contactCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `${Colors.primary}0D`,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -32,
    left: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${Colors.primary}0D`,
  },
  contactContent: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  contactTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  contactSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 240,
  },
  contactButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  contactButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
