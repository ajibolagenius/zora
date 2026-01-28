import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChatCircle,
  ChatCircleDots,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { LazyAvatar, LazyImage } from '../components/ui';
import { messagingService, type Conversation } from '../services/messagingService';
import { realtimeService } from '../services/realtimeService';
import { useAuthStore } from '../stores/authStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { ImageUrlBuilders } from '../constants';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchConversations = useCallback(async () => {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const fetchedConversations = await messagingService.getUserConversations(user.user_id);
        setConversations(fetchedConversations);
        
        // Calculate total unread count
        const totalUnread = fetchedConversations.reduce((sum, conv) => sum + (conv.unread_count_user || 0), 0);
        setUnreadCount(totalUnread);
      } else {
        // Mock mode - show empty state
        setConversations([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    fetchConversations();

    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fetchConversations]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isSupabaseConfigured() || !user?.user_id) return;

    let unsubscribers: (() => void)[] = [];
    let isMounted = true;

    // Subscribe to conversation updates
    Promise.all([
      realtimeService.subscribeToTable(
        'conversations',
        '*',
        async (payload) => {
          if (!isMounted) return;

          if (payload.new?.user_id === user.user_id || payload.old?.user_id === user.user_id) {
            // Conversation updated, refetch
            await fetchConversations();
          }
        },
        `user_id=eq.${user.user_id}`
      ),
      // Also subscribe to messages to update unread counts
      realtimeService.subscribeToTable(
        'messages',
        'INSERT',
        async (payload) => {
          if (!isMounted) return;

          // Check if this message is in one of our conversations
          const conversationIds = conversations.map(c => c.id);
          if (payload.new?.conversation_id && conversationIds.includes(payload.new.conversation_id)) {
            // Refetch to update unread counts
            await fetchConversations();
          }
        }
      ),
    ]).then((unsubs) => {
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
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [user?.user_id, fetchConversations, conversations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, [fetchConversations]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const handleConversationPress = (conversation: Conversation) => {
    if (conversation.vendor_id) {
      router.push(`/vendor/${conversation.vendor_id}/chat`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Conversations List */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <ChatCircleDots size={64} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation with a vendor to see your messages here
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
          >
            {conversations.map((conversation) => {
              const vendor = conversation.vendor as any;
              const shopName = vendor?.shop_name || 'Vendor';
              const logoUrl = vendor?.logo_url || '';
              const unread = conversation.unread_count_user || 0;

              return (
                <TouchableOpacity
                  key={conversation.id}
                  style={styles.conversationCard}
                  onPress={() => handleConversationPress(conversation)}
                  activeOpacity={0.8}
                >
                  <LazyAvatar
                    source={logoUrl || ImageUrlBuilders.dicebearAvatar(shopName)}
                    name={shopName}
                    size={56}
                    style={styles.avatar}
                  />
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <Text style={styles.vendorName} numberOfLines={1}>
                        {shopName}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatTime(conversation.last_message_at)}
                      </Text>
                    </View>
                    <View style={styles.messagePreviewRow}>
                      <Text
                        style={[styles.messagePreview, unread > 0 && styles.messagePreviewUnread]}
                        numberOfLines={1}
                      >
                        {conversation.last_message_text || 'No messages yet'}
                      </Text>
                      {unread > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {unread > 9 ? '9+' : unread}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vendorName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  timeText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  messagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    flex: 1,
    marginRight: Spacing.sm,
  },
  messagePreviewUnread: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
    lineHeight: 12,
  },
});
