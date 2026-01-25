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
  ArrowsLeftRight,
  User,
  CaretRight,
  Headset,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const SURFACE_LIGHT = '#ffffff';
const MUTED_TEXT = '#94A3B8';
const ICON_BG = 'rgba(204, 0, 0, 0.1)';

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

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      router.push(action.route);
    } else if (action.id === 'chat') {
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
            <MagnifyingGlass size={20} color={MUTED_TEXT} weight="regular" />
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
                    <IconComponent size={24} color={ZORA_RED} weight="fill" />
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
                      <IconComponent size={20} color={ZORA_RED} weight="fill" />
                    </View>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                  </View>
                  <CaretRight size={20} color={MUTED_TEXT} weight="bold" />
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
                <CaretRight size={20} color={MUTED_TEXT} weight="regular" />
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
              <Headset size={24} color={ZORA_RED} weight="fill" />
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    backgroundColor: BACKGROUND_DARK,
    paddingBottom: 8,
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
    paddingTop: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 52,
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
    paddingTop: 24,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ZORA_CARD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ICON_BG,
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
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  questionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  questionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },

  // Contact Card
  contactCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(204, 0, 0, 0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -32,
    left: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(204, 0, 0, 0.05)',
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
    backgroundColor: ICON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontFamily: FontFamily.display,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  contactSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 240,
  },
  contactButton: {
    width: '100%',
    backgroundColor: ZORA_RED,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  contactButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
