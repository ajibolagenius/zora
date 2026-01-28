import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing,
    Image,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    PaperPlaneRight,
    Paperclip,
    Storefront,
} from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/spacing';
import { FontSize, FontFamily } from '../../../constants/typography';
import { vendorService as mockVendorService, messageService as mockMessageService, type Vendor as MockVendor, type Message as MockMessage } from '../../../services/mockDataService';
import { vendorService as supabaseVendorService } from '../../../services/supabaseService';
import { messagingService, type Message, type Conversation } from '../../../services/messagingService';
import { realtimeService } from '../../../services/realtimeService';
import type { Vendor } from '../../../types/supabase';
import { isSupabaseConfigured, getSupabaseFrom } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { QuickReplies, Placeholders, AnimationDuration, AnimationEasing } from '../../../constants';
import NotFoundScreen from '../../../components/errors/NotFoundScreen';

export default function VendorChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { user } = useAuthStore();
    const [vendor, setVendor] = useState<Vendor | MockVendor | null>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<(Message | MockMessage)[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Fetch vendor, conversation, and messages
    useEffect(() => {
        if (!id || !user?.user_id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                let vendorData: Vendor | MockVendor | null = null;

                if (isSupabaseConfigured()) {
                    const fetchedVendor = await supabaseVendorService.getById(id);
                    vendorData = fetchedVendor;
                    
                    if (vendorData) {
                        setVendor(vendorData as Vendor | MockVendor);

                        // Get or create conversation
                        const conv = await messagingService.getOrCreateConversation(user.user_id, vendorData.id);
                        if (conv) {
                            setConversation(conv);

                            // Fetch messages
                            const fetchedMessages = await messagingService.getMessages(conv.id);
                            setMessages(fetchedMessages);

                            // Mark messages as read
                            await messagingService.markAsRead(conv.id, user.user_id, 'user');
                        }
                    }
                } else {
                    // Mock mode
                    const mockVendor = mockVendorService.getById(id);
                    vendorData = mockVendor || null;
                    if (vendorData) {
                        setVendor(vendorData);
                        const conversationId = mockMessageService.getConversationId(id, user.user_id);
                        const existingMessages = mockMessageService.getByConversation(conversationId);
                        
                        if (existingMessages.length === 0) {
                            const welcomeMessage = mockMessageService.send({
                                conversation_id: conversationId,
                                sender_id: vendorData.id,
                                sender_type: 'vendor',
                                sender_name: (vendorData as any).shop_name || (vendorData as any).name || 'Vendor',
                                sender_avatar: (vendorData as any).logo_url || (vendorData as any).avatar_url || '',
                                text: `Hello! Welcome to ${(vendorData as any).shop_name || (vendorData as any).name || 'our store'}. How can I help you today?`,
                            });
                            setMessages([welcomeMessage]);
                        } else {
                            // Convert mock messages to Message format
                            const convertedMessages = existingMessages.map((msg: MockMessage) => ({
                                ...msg,
                                read_at: msg.read_at || null,
                            }));
                            setMessages(convertedMessages);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user?.user_id]);

    // Subscribe to real-time message updates
    useEffect(() => {
        if (!isSupabaseConfigured() || !conversation?.id) return;

        let unsubscriber: (() => void) | null = null;
        let isMounted = true;

        realtimeService.subscribeToTable(
            'messages',
            '*',
            async (payload) => {
                if (!isMounted || !conversation) return;

                if (payload.new?.conversation_id === conversation.id) {
                    // New message received
                    const newMessage = payload.new as any;
                    
                    // Enrich with sender info
                    let senderName = 'Unknown';
                    let senderAvatar: string | null = null;

                    if (newMessage.sender_type === 'user') {
                        const fromMethod = await getSupabaseFrom();
                        if (fromMethod) {
                            const { data: profile } = await fromMethod('profiles')
                                .select('full_name, avatar_url')
                                .eq('id', newMessage.sender_id)
                                .maybeSingle();
                            senderName = (profile as any)?.full_name || 'User';
                            senderAvatar = (profile as any)?.avatar_url || null;
                        }
                    } else {
                        const fromMethod = await getSupabaseFrom();
                        if (fromMethod) {
                            const { data: vendorData } = await fromMethod('vendors')
                                .select('shop_name, logo_url')
                                .eq('id', newMessage.sender_id)
                                .maybeSingle();
                            senderName = (vendorData as any)?.shop_name || 'Vendor';
                            senderAvatar = (vendorData as any)?.logo_url || null;
                        }
                    }

                    const enrichedMessage: Message = {
                        ...newMessage,
                        sender_name: senderName,
                        sender_avatar: senderAvatar,
                    };

                    setMessages((prev) => {
                        // Avoid duplicates
                        if (prev.some((m) => m.id === enrichedMessage.id)) {
                            return prev;
                        }
                        return [...prev, enrichedMessage].sort(
                            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        );
                    });

                    // Mark as read if it's from vendor and user is viewing
                    if (newMessage.sender_type === 'vendor' && user?.user_id) {
                        await messagingService.markAsRead(conversation.id, user.user_id, 'user');
                    }

                    // Scroll to bottom
                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            },
            `conversation_id=eq.${conversation.id}`
        ).then((unsub) => {
            if (isMounted && unsub) {
                unsubscriber = unsub;
            }
        }).catch((error) => {
            console.error('Error setting up real-time subscription:', error);
        });

        return () => {
            isMounted = false;
            if (unsubscriber) {
                unsubscriber();
            }
        };
    }, [conversation?.id, user?.user_id]);

    useEffect(() => {
        if (!loading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: AnimationDuration.normal,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: AnimationDuration.normal,
                    easing: AnimationEasing.standard,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [loading]);

    // Scroll to bottom when messages change
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(`/vendor/${id}`);
        }
    };

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !vendor || !user?.user_id) return;
    if (!conversation && isSupabaseConfigured()) return; // Wait for conversation to be created

    const messageText = inputText.trim();
    setInputText('');

    if (isSupabaseConfigured() && conversation) {
      // Real-time messaging
      try {
        const newMessage = await messagingService.sendMessage(
          conversation.id,
          user.user_id,
          'user',
          messageText
        );

        if (newMessage) {
          setMessages((prev) => [...prev, newMessage].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ));
          
          // Scroll to bottom
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          // Simulate vendor response (in real app, vendor would respond via their interface)
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            
            // Generate contextual response
            const userText = messageText.toLowerCase();
            let responseText = '';

            if (userText.includes('delivery') || userText.includes('deliver')) {
              const deliveryMin = (vendor as any).delivery_time_min || 30;
              const deliveryMax = (vendor as any).delivery_time_max || 45;
              const coverage = (vendor as any).coverage_radius_km || 5;
              const fee = (vendor as any).delivery_fee || 2.99;
              responseText = `Our delivery time is typically ${deliveryMin}-${deliveryMax} minutes. We deliver within ${coverage}km of our location. The delivery fee is £${Number(fee).toFixed(2)}.`;
            } else if (userText.includes('stock') || userText.includes('available') || userText.includes('have')) {
              responseText = 'Let me check our current inventory for you. Which product are you interested in?';
            } else if (userText.includes('price') || userText.includes('cost') || userText.includes('how much')) {
              responseText = 'I\'d be happy to help with pricing! Could you let me know which product you\'re asking about?';
            } else if (userText.includes('order') || userText.includes('customize') || userText.includes('special')) {
              responseText = 'We\'re happy to accommodate special requests when possible! Please let me know what you have in mind.';
            } else if (userText.includes('return') || userText.includes('refund') || userText.includes('exchange')) {
              responseText = 'We want you to be completely satisfied with your purchase. Please let me know what the issue is, and I\'ll help you resolve it.';
            } else if (userText.includes('hours') || userText.includes('open') || userText.includes('close')) {
              responseText = 'We\'re here to help! Our store hours may vary. Is there a specific time you\'d like to visit or receive a delivery?';
            } else {
              responseText = 'Thank you for your message! I\'m here to help. How can I assist you today?';
            }

            // Send vendor response (in production, this would come from vendor's interface)
            messagingService.sendMessage(
              conversation.id,
              vendor.id,
              'vendor',
              responseText
            ).then((vendorMsg) => {
              if (vendorMsg) {
                setMessages((prev) => [...prev, vendorMsg].sort(
                  (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                ));
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }
            });
          }, 1500 + Math.random() * 1000);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      // Mock mode
      const conversationId = mockMessageService.getConversationId(id, user.user_id);
      
      const userMessage = mockMessageService.send({
        conversation_id: conversationId,
        sender_id: user.user_id,
        sender_type: 'user',
        sender_name: 'You',
        text: messageText,
      });

      setMessages(prev => [...prev, userMessage as any]);
      setInputText('');
      setIsTyping(true);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate vendor response
      setTimeout(() => {
        setIsTyping(false);
        
        const userText = messageText.toLowerCase();
        let responseText = '';

        if (userText.includes('delivery') || userText.includes('deliver')) {
          const deliveryMin = (vendor as any).delivery_time_min || 30;
          const deliveryMax = (vendor as any).delivery_time_max || 45;
          const coverage = (vendor as any).coverage_radius_km || 5;
          const fee = (vendor as any).delivery_fee || 2.99;
          responseText = `Our delivery time is typically ${deliveryMin}-${deliveryMax} minutes. We deliver within ${coverage}km of our location. The delivery fee is £${Number(fee).toFixed(2)}.`;
        } else if (userText.includes('stock') || userText.includes('available') || userText.includes('have')) {
          responseText = 'Let me check our current inventory for you. Which product are you interested in?';
        } else if (userText.includes('price') || userText.includes('cost') || userText.includes('how much')) {
          responseText = 'I\'d be happy to help with pricing! Could you let me know which product you\'re asking about?';
        } else if (userText.includes('order') || userText.includes('customize') || userText.includes('special')) {
          responseText = 'We\'re happy to accommodate special requests when possible! Please let me know what you have in mind.';
        } else if (userText.includes('return') || userText.includes('refund') || userText.includes('exchange')) {
          responseText = 'We want you to be completely satisfied with your purchase. Please let me know what the issue is, and I\'ll help you resolve it.';
        } else if (userText.includes('hours') || userText.includes('open') || userText.includes('close')) {
          responseText = 'We\'re here to help! Our store hours may vary. Is there a specific time you\'d like to visit or receive a delivery?';
        } else {
          responseText = 'Thank you for your message! I\'m here to help. How can I assist you today?';
        }

        const vendorMessage = mockMessageService.send({
          conversation_id: conversationId,
          sender_id: vendor.id,
          sender_type: 'vendor',
          sender_name: (vendor as any).shop_name || (vendor as any).name || 'Vendor',
          sender_avatar: (vendor as any).logo_url || (vendor as any).avatar_url || '',
          text: responseText,
        });

        setMessages(prev => [...prev, vendorMessage as any]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1500 + Math.random() * 1000);
    }
  }, [inputText, vendor, user?.user_id, conversation]);

    const handleQuickReply = (reply: string) => {
        setInputText(reply);
        // Auto-send after a brief delay
        setTimeout(() => {
            handleSend();
        }, 300);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const formatDateHeader = (timestamp: string, prevTimestamp?: string) => {
        const date = new Date(timestamp);
        const prevDate = prevTimestamp ? new Date(prevTimestamp) : null;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if same day
        if (prevDate &&
            date.getDate() === prevDate.getDate() &&
            date.getMonth() === prevDate.getMonth() &&
            date.getFullYear() === prevDate.getFullYear()) {
            return null;
        }

        // Format date
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'short'
            });
        }
    };

    const renderMessage = (message: Message | MockMessage, index: number) => {
        const isUser = message.sender_type === 'user';
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const dateHeader = formatDateHeader(message.created_at, prevMessage?.created_at);
        const showAvatar = !isUser && (!prevMessage || prevMessage.sender_type === 'user' ||
            new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000); // 5 minutes

        return (
            <React.Fragment key={message.id}>
                {dateHeader && (
                    <View style={styles.timestampContainer}>
                        <View style={styles.timestampLine} />
                        <Text style={styles.timestampText}>{dateHeader}</Text>
                        <View style={styles.timestampLine} />
                    </View>
                )}
                <Animated.View
                    style={[
                        styles.messageContainer,
                        isUser ? styles.messageContainerUser : styles.messageContainerVendor,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Vendor Avatar */}
                    {!isUser && (
                        <View style={[styles.vendorAvatar, !showAvatar && styles.vendorAvatarHidden]}>
                            {showAvatar && (
                                <>
                                    {message.sender_avatar ? (
                                        <Image
                                            source={{ uri: message.sender_avatar }}
                                            style={styles.avatarImage}
                                        />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Storefront size={18} color={Colors.primary} weight="duotone" />
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    )}

                    <View style={[
                        styles.messageContent,
                        isUser && styles.messageContentUser,
                    ]}>
                        {/* Message Bubble */}
                        <View style={[
                            styles.messageBubble,
                            isUser ? styles.messageBubbleUser : styles.messageBubbleVendor,
                        ]}>
                            <Text style={styles.messageText}>{message.text}</Text>
                        </View>

                        {/* Timestamp */}
                        <Text style={[
                            styles.messageTimestamp,
                            isUser && styles.messageTimestampUser,
                        ]}>
                            {formatTime(message.created_at)}
                        </Text>
                    </View>
                </Animated.View>
            </React.Fragment>
        );
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

    if (!vendor) {
        return (
            <NotFoundScreen
                title="Vendor Not Found"
                message="This vendor doesn't exist or may have been removed. It might have been deleted or the link is incorrect."
                onBack={() => router.back()}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerGradient} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerCenter}
                    activeOpacity={0.8}
                >
                    {vendor.logo_url && (
                        <Image
                            source={{ uri: vendor.logo_url }}
                            style={styles.headerLogo}
                        />
                    )}
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{vendor.shop_name}</Text>
                        <View style={styles.headerMetaRow}>
                            {vendor.is_verified && (
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                                </View>
                            )}
                            <Text style={styles.headerSubtitle}>Usually replies within minutes</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Chat Area */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.chatArea}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Messages */}
                    {messages.map((message, index) => {
                        // Normalize message type for renderMessage
                        const normalizedMessage: Message = {
                            ...message,
                            read_at: message.read_at ?? null,
                        };
                        return renderMessage(normalizedMessage, index);
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <View style={styles.typingContainer}>
                            <View style={styles.typingDots}>
                                <View style={[styles.typingDot, styles.typingDot1]} />
                                <View style={[styles.typingDot, styles.typingDot2]} />
                                <View style={[styles.typingDot, styles.typingDot3]} />
                            </View>
                            <Text style={styles.typingText}>{vendor.shop_name} is typing...</Text>
                        </View>
                    )}

                    {/* Bottom padding */}
                    <View style={{ height: Spacing.base }} />
                </ScrollView>

                {/* Bottom Section */}
                <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
                    {/* Quick Replies */}
                    {messages.length <= 3 && (
                        <View style={styles.quickRepliesWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.quickRepliesContainer}
                            >
                                {QuickReplies.vendorChat.map((reply, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.quickReplyChip}
                                        onPress={() => handleQuickReply(reply)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.quickReplyText}>{reply}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Message Input */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                style={styles.attachButton}
                                activeOpacity={0.7}
                            >
                                <Paperclip size={20} color={Colors.textMuted} weight="regular" />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.textInput}
                                placeholder={Placeholders.form.message}
                                placeholderTextColor={Colors.textMuted}
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                                onSubmitEditing={handleSend}
                                onBlur={() => Keyboard.dismiss()}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !inputText.trim() && styles.sendButtonDisabled,
                                ]}
                                onPress={handleSend}
                                disabled={!inputText.trim()}
                                activeOpacity={0.8}
                            >
                                <PaperPlaneRight
                                    size={20}
                                    color={Colors.textPrimary}
                                    weight={inputText.trim() ? "fill" : "regular"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
    errorText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDark,
        position: 'relative',
    },
    headerGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.borderDark,
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
        marginRight: Spacing.sm,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginRight: Spacing.sm,
    },
    headerLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.white10,
        backgroundColor: Colors.cardDark,
    },
    headerTitleContainer: {
        flex: 1,
        gap: 4,
    },
    headerTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    headerMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    verifiedBadge: {
        backgroundColor: Colors.success20,
        paddingHorizontal: Spacing.xs,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    verifiedBadgeText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
        color: Colors.success,
    },
    headerSubtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    headerRight: {
        width: 40,
    },
    keyboardView: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.base,
        gap: Spacing.md,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
        gap: Spacing.sm,
    },
    timestampLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.borderDark,
    },
    timestampText: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        paddingHorizontal: Spacing.sm,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.xs,
        maxWidth: '82%',
        marginBottom: Spacing.xs,
    },
    messageContainerVendor: {
        alignSelf: 'flex-start',
    },
    messageContainerUser: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    vendorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.white10,
        overflow: 'hidden',
        marginBottom: 2,
    },
    vendorAvatarHidden: {
        width: 32,
        opacity: 0,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary20,
    },
    messageContent: {
        gap: 4,
        alignItems: 'flex-start',
        flex: 1,
    },
    messageContentUser: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        paddingHorizontal: Spacing.base + 2,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.lg,
        maxWidth: '100%',
    },
    messageBubbleVendor: {
        backgroundColor: Colors.white10,
        borderBottomLeftRadius: 4,
        borderTopRightRadius: BorderRadius.lg,
        borderTopLeftRadius: BorderRadius.lg,
    },
    messageBubbleUser: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
    },
    messageText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        lineHeight: 20,
        letterSpacing: 0.2,
    },
    messageTimestamp: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.tiny,
        color: Colors.textMuted,
        marginLeft: Spacing.xs,
        paddingHorizontal: 4,
    },
    messageTimestampUser: {
        marginRight: Spacing.xs,
        marginLeft: 0,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginLeft: 44,
        marginTop: Spacing.xs,
    },
    typingDots: {
        flexDirection: 'row',
        gap: 4,
        backgroundColor: Colors.white10,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderBottomLeftRadius: 4,
    },
    typingDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: Colors.textMuted,
    },
    typingDot1: {
        opacity: 0.4,
    },
    typingDot2: {
        opacity: 0.6,
    },
    typingDot3: {
        opacity: 0.8,
    },
    typingText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
    },
    bottomSection: {
        backgroundColor: Colors.backgroundDark,
        borderTopWidth: 1,
        borderTopColor: Colors.borderDark,
    },
    quickRepliesWrapper: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    quickRepliesContainer: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
    },
    quickReplyChip: {
        backgroundColor: Colors.white10,
        borderWidth: 1,
        borderColor: Colors.white15,
        paddingHorizontal: Spacing.base + 2,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    quickReplyText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    inputWrapper: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.backgroundDark,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.sm,
        backgroundColor: Colors.white10,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.xs,
        paddingVertical: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.white15,
    },
    attachButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: 'transparent',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.md,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.white10,
        ...Shadows.sm,
    },
});
