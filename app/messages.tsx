import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Alert,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChatCircle,
  ChatCircleDots,
  Question,
  Trash,
  Hand,
  ChatCircleText,
  X,
  CheckCircle,
  Headset,
  Package,
  MagnifyingGlass,
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
import { safeGoBack } from '../lib/navigationHelpers';

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
    case 'completed':
      return Colors.success;
    case 'cancelled':
    case 'refunded':
      return Colors.error;
    case 'out_for_delivery':
      return Colors.secondary;
    default:
      return Colors.primary;
  }
};

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const offsetRef = useRef(0); // Use ref to track offset for pagination
  const PAGE_SIZE = 20;

  const fetchConversations = useCallback(async (reset: boolean = false) => {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const currentOffset = reset ? 0 : offsetRef.current;
        
        const fetchedConversations = await messagingService.getUserConversations(
          user.user_id,
          PAGE_SIZE,
          currentOffset
        );

        // Update offset based on database position, not displayed count
        // Bug 1 Fix: Increment offset by fetched count, not displayed count
        if (reset) {
          // For reset, offset should be the number of items fetched from database
          offsetRef.current = fetchedConversations.length;
          setOffset(fetchedConversations.length);
        } else {
          // For pagination, increment by the number of items fetched from database
          // NOT by the deduplicated count, to maintain correct database position
          offsetRef.current = currentOffset + fetchedConversations.length;
          setOffset(offsetRef.current);
        }

        // Update conversations state and calculate unread count
        // Bug Fix: Use functional updates to avoid stale closure issues
        if (reset) {
          // For reset, deduplicate and set conversations
          const uniqueConversations = Array.from(
            new Map(fetchedConversations.map(conv => [conv.id, conv])).values()
          );
          
          setConversations(uniqueConversations);
          
          // Calculate unread count from the updated conversations
          const totalUnread = uniqueConversations.reduce(
            (sum, conv) => sum + (conv.unread_count_user || 0), 
            0
          );
          setUnreadCount(totalUnread);
        } else {
          // For pagination, calculate updated list using functional update pattern
          // Store the result to use for unread count calculation
          let updatedConversationsForUnread: Conversation[] | null = null;
          
          setConversations((prev) => {
            // Deduplicate by ID - both existing and new
            // Use prev (latest state) instead of conversations (stale closure)
            const conversationMap = new Map<string, Conversation>();
            
            // Add existing conversations (using latest prev state, not stale closure)
            prev.forEach(conv => conversationMap.set(conv.id, conv));
            
            // Add new conversations (will overwrite duplicates with latest data)
            fetchedConversations.forEach(conv => conversationMap.set(conv.id, conv));
            
            const updated = Array.from(conversationMap.values());
            
            // Store for unread count calculation outside callback
            updatedConversationsForUnread = updated;
            
            return updated;
          });
          
          // Calculate unread count from the updated list
          // Use the calculated value from the functional update
          if (updatedConversationsForUnread) {
            const totalUnread = updatedConversationsForUnread.reduce(
              (sum, conv) => sum + (conv.unread_count_user || 0), 
              0
            );
            setUnreadCount(totalUnread);
          }
        }

        // Check if there are more conversations
        setHasMore(fetchedConversations.length === PAGE_SIZE);
      } else {
        // Mock mode - show empty state
        setConversations([]);
        setUnreadCount(0);
        setHasMore(false);
        offsetRef.current = 0;
        setOffset(0);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    fetchConversations(true);

    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [user?.user_id]);

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
    offsetRef.current = 0;
    setOffset(0);
    setHasMore(true);
    fetchConversations(true);
  }, [fetchConversations]);

  const loadMoreConversations = useCallback(() => {
    if (loadingMore || !hasMore || !user?.user_id) return;
    
    setLoadingMore(true);
    fetchConversations(false);
  }, [loadingMore, hasMore, user?.user_id, fetchConversations]);

  const handleDeleteConversation = useCallback((conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user?.user_id) return;
            
            setDeletingId(conversationId);
            try {
              const success = await messagingService.deleteConversation(conversationId, user.user_id);
              if (success) {
                setConversations((prev) => prev.filter((c) => c.id !== conversationId));
                // Recalculate unread count
                const remainingConversations = conversations.filter((c) => c.id !== conversationId);
                const totalUnread = remainingConversations.reduce((sum, conv) => sum + (conv.unread_count_user || 0), 0);
                setUnreadCount(totalUnread);
              } else {
                Alert.alert('Error', 'Failed to delete conversation. Please try again.');
              }
            } catch (error) {
              console.error('Error deleting conversation:', error);
              Alert.alert('Error', 'Failed to delete conversation. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }, [user?.user_id, conversations]);

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

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return conversations.filter((conversation) => {
      const isSupport = conversation.conversation_type === 'support';
      const vendor = conversation.vendor as any;
      const order = conversation.order;
      
      // Search in vendor name
      if (!isSupport && vendor?.shop_name) {
        if (vendor.shop_name.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      // Search in order ID/number for support conversations
      if (isSupport && order?.id) {
        if (order.id.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      // Search in last message text
      if (conversation.last_message_text) {
        if (conversation.last_message_text.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      // Search in order status for support conversations
      if (isSupport && order?.status) {
        if (order.status.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      return false;
    });
  }, [conversations, searchQuery]);

  const handleConversationPress = (conversation: Conversation) => {
    if (conversation.conversation_type === 'support' && conversation.order_id) {
      // Navigate to order support screen
      router.push(`/order-support/${conversation.order_id}`);
    } else if (conversation.vendor_id) {
      // Navigate to vendor chat screen
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
          onPress={() => safeGoBack(router, '/(tabs)')}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        {!showSearch ? (
          <>
            <Text style={styles.headerTitle}>Messages</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setShowSearch(true)}
                activeOpacity={0.8}
              >
                <MagnifyingGlass size={24} color={Colors.textPrimary} weight="regular" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => setShowHelpModal(true)}
                activeOpacity={0.8}
              >
                <Question size={24} color={Colors.secondary} weight="fill" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.searchBarContainer}>
              <MagnifyingGlass size={20} color={Colors.textMuted} weight="regular" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={18} color={Colors.textMuted} weight="bold" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.cancelSearchButton}
              onPress={() => {
                setSearchQuery('');
                setShowSearch(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelSearchText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Conversations List */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {filteredConversations.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            {searchQuery.trim() ? (
              <>
                <MagnifyingGlass size={64} color={Colors.textMuted} weight="duotone" />
                <Text style={styles.emptyTitle}>No conversations found</Text>
                <Text style={styles.emptyText}>
                  No conversations match "{searchQuery}". Try a different search term.
                </Text>
              </>
            ) : (
              <>
                <ChatCircleDots size={64} color={Colors.textMuted} weight="duotone" />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptyText}>
                  Start a conversation with a vendor or get help with an order to see your messages here
                </Text>
              </>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item: conversation }) => {
              const isSupport = conversation.conversation_type === 'support';
              const vendor = conversation.vendor as any;
              const order = conversation.order;
              
              // Determine display name and avatar
              let displayName = 'Support';
              let logoUrl = '';
              let avatarIcon = null;
              
              if (isSupport) {
                displayName = 'Order Support';
                if (order?.id) {
                  displayName = `Order ${order.id.slice(0, 8)}`;
                }
                avatarIcon = <Headset size={22} color={Colors.primary} weight="duotone" />;
              } else {
                displayName = vendor?.shop_name || 'Vendor';
                logoUrl = vendor?.logo_url || '';
              }
              
              const unread = conversation.unread_count_user || 0;
              const isDeleting = deletingId === conversation.id;

              return (
                <TouchableOpacity
                  style={[styles.conversationCard, isDeleting && styles.conversationCardDeleting]}
                  onPress={() => handleConversationPress(conversation)}
                  onLongPress={() => handleDeleteConversation(conversation.id)}
                  activeOpacity={0.8}
                  disabled={isDeleting}
                >
                  {isSupport ? (
                    <View style={styles.supportAvatarContainer}>
                      <View style={styles.supportAvatar}>
                        {avatarIcon}
                      </View>
                      {order?.status && (
                        <View style={[styles.orderStatusBadge, { backgroundColor: `${getOrderStatusColor(order.status)}20` }]}>
                          <Text style={[styles.orderStatusText, { color: getOrderStatusColor(order.status) }]} numberOfLines={1}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <LazyAvatar
                      source={logoUrl || ImageUrlBuilders.dicebearAvatar(displayName)}
                      name={displayName}
                      size={44}
                      style={styles.avatar}
                    />
                  )}
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <View style={styles.conversationTitleRow}>
                        {isSupport && <Package size={14} color={Colors.textMuted} weight="duotone" style={styles.supportIcon} />}
                        <Text style={styles.vendorName} numberOfLines={1}>
                          {displayName}
                        </Text>
                      </View>
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
                  {isDeleting && (
                    <View style={styles.deletingOverlay}>
                      <ActivityIndicator size="small" color={Colors.textPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
            onEndReached={searchQuery.trim() ? undefined : loadMoreConversations}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore && hasMore ? (
                <View style={styles.loadingFooter}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingFooterText}>Loading more...</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : null
            }
          />
        )}
      </Animated.View>

      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalIconContainer, { backgroundColor: Colors.secondary15 }]}>
                  <Question size={24} color={Colors.secondary} weight="fill" />
                </View>
                <Text style={styles.modalTitle}>Messages Help</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowHelpModal(false)}
                activeOpacity={0.8}
              >
                <X size={24} color={Colors.textPrimary} weight="bold" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {/* Delete Section */}
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <View style={[styles.helpIconContainer, { backgroundColor: Colors.error + '20' }]}>
                    <Trash size={20} color={Colors.error} weight="fill" />
                  </View>
                  <Text style={styles.helpSectionTitle}>Deleting Conversations</Text>
                </View>
                <View style={styles.helpSectionContent}>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.primary15 }]}>
                      <Hand size={16} color={Colors.primary} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      <Text style={styles.helpTextBold}>Long press</Text> on any conversation to delete it
                    </Text>
                  </View>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.info + '20' }]}>
                      <CheckCircle size={16} color={Colors.info} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      You'll be asked to confirm before deleting
                    </Text>
                  </View>
                </View>
              </View>

              {/* Messaging Details Section */}
              <View style={styles.helpSection}>
                <View style={styles.helpSectionHeader}>
                  <View style={[styles.helpIconContainer, { backgroundColor: Colors.secondary15 }]}>
                    <ChatCircleText size={20} color={Colors.secondary} weight="fill" />
                  </View>
                  <Text style={styles.helpSectionTitle}>Messaging Details</Text>
                </View>
                <View style={styles.helpSectionContent}>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.success + '20' }]}>
                      <ChatCircle size={16} color={Colors.success} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      Tap any conversation to open and chat with the vendor
                    </Text>
                  </View>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.info + '20' }]}>
                      <CheckCircle size={16} color={Colors.info} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      Messages update in real-time as you chat
                    </Text>
                  </View>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.secondary15 }]}>
                      <ChatCircleDots size={16} color={Colors.secondary} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      Unread message counts are shown with a badge
                    </Text>
                  </View>
                  <View style={styles.helpItem}>
                    <View style={[styles.helpBulletIcon, { backgroundColor: Colors.primary15 }]}>
                      <Hand size={16} color={Colors.primary} weight="fill" />
                    </View>
                    <Text style={styles.helpText}>
                      Pull down to refresh your conversations
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    height: 40,
    marginRight: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  cancelSearchButton: {
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
  },
  cancelSearchText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden', // Prevent badge from extending beyond card
  },
  conversationCardDeleting: {
    opacity: 0.5,
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundDark + '80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  loadingFooter: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  loadingFooterText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  // Help Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  modalContent: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white10,
  },
  modalScrollView: {
    flex: 1,
  },
  helpSection: {
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  helpSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  helpIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpSectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  helpSectionContent: {
    gap: Spacing.md,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  helpBulletIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  helpText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  helpTextBold: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
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
  conversationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  supportIcon: {
    marginRight: 2,
  },
  vendorName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  supportAvatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
    width: 44,
    alignItems: 'center',
    marginBottom: Spacing.xs, // Add space at bottom for badge
  },
  supportAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  orderStatusBadge: {
    marginTop: Spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 36,
    maxWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderStatusText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    textAlign: 'center',
    lineHeight: 10,
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
