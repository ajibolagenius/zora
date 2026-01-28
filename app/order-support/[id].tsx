import React, { useState, useRef, useEffect } from 'react';
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
    Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    PaperPlaneRight,
    Paperclip,
    Robot,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { QuickReplies, Placeholders, AnimationDuration, AnimationEasing } from '../../constants';
import { messagingService } from '../../services/messagingService';
import { realtimeService } from '../../services/realtimeService';
import { orderService } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Order } from '../../types';
import { Package } from 'phosphor-react-native';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: string;
    senderName?: string;
}

export default function OrderSupportScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuthStore();
    const orderNumber = id || '29384';

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<Order | null>(null);
    const [orderLoading, setOrderLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
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
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Fetch order data
    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) {
                setOrderLoading(false);
                return;
            }

            try {
                setOrderLoading(true);
                const orderData = await orderService.getById(id);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setOrderLoading(false);
            }
        };

        fetchOrder();

        // Subscribe to real-time order updates
        if (isSupabaseConfigured() && id) {
            let isMounted = true;
            const unsubscribers: (() => void)[] = [];

            realtimeService.subscribeToTable(
                'orders',
                '*',
                async (payload) => {
                    if (!isMounted) return;
                    
                    if (payload.new?.id === id || payload.old?.id === id) {
                        // Order was updated, refresh the order data
                        try {
                            const orderData = await orderService.getById(id);
                            if (orderData) {
                                setOrder(orderData);
                            }
                        } catch (error) {
                            console.error('Error refreshing order:', error);
                        }
                    }
                },
                `id=eq.${id}`
            ).then((unsub) => {
                if (isMounted && unsub) unsubscribers.push(unsub);
            }).catch((error) => {
                console.error('Error setting up order subscription:', error);
            });

            return () => {
                isMounted = false;
                unsubscribers.forEach((unsub) => {
                    if (typeof unsub === 'function') {
                        unsub();
                    }
                });
            };
        }
    }, [id]);

    // Fetch messages and set up real-time subscription
    useEffect(() => {
        const fetchMessages = async () => {
            if (!isSupabaseConfigured() || !user?.user_id || !id) {
                setMessages([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Get or create support conversation for this order
                const conversation = await messagingService.getOrCreateSupportConversation(user.user_id, id);
                
                if (conversation) {
                    // Fetch messages for this conversation
                    const conversationMessages = await messagingService.getMessages(conversation.id);
                    
                    // Mark messages as read when opening the support screen
                    await messagingService.markAsRead(conversation.id, user.user_id, 'user');
                    
                    const formattedMessages: Message[] = conversationMessages.map((msg: any) => ({
                        id: msg.id,
                        text: msg.text || msg.content || '',
                        sender: msg.sender_type === 'user' ? 'user' : (msg.sender_type === 'support' ? 'bot' : 'bot'),
                        timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        }),
                        senderName: msg.sender_type === 'user' ? undefined : (msg.sender_name || 'Zora Support'),
                    }));
                    
                    setMessages(formattedMessages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Set up real-time subscription for new messages
        if (isSupabaseConfigured() && user?.user_id && id) {
            let isMounted = true;
            const unsubscribers: (() => void)[] = [];

            // First, get the conversation ID
            messagingService.getOrCreateSupportConversation(user.user_id, id).then((conversation) => {
                if (!conversation || !isMounted) return;

                // Subscribe to INSERT events for new messages
                realtimeService.subscribeToTable(
                    'messages',
                    'INSERT',
                    async (payload) => {
                        if (!isMounted) return;
                        
                        // Handle new messages in real-time
                        if (payload.new && payload.new.conversation_id === conversation.id) {
                            // Check if message already exists to avoid duplicates
                            setMessages(prev => {
                                const exists = prev.some(msg => msg.id === payload.new.id);
                                if (exists) return prev;
                                
                                const newMessage: Message = {
                                    id: payload.new.id,
                                    text: payload.new.text || payload.new.content || '',
                                    sender: payload.new.sender_type === 'user' ? 'user' : (payload.new.sender_type === 'support' ? 'bot' : 'bot'),
                                    timestamp: new Date(payload.new.created_at).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }),
                                    senderName: payload.new.sender_type === 'user' ? undefined : (payload.new.sender_name || 'Zora Support'),
                                };
                                
                                return [...prev, newMessage];
                            });
                            
                            setTimeout(() => {
                                scrollViewRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                            
                            // Mark as read if it's a support message
                            if (payload.new.sender_type !== 'user' && user?.user_id) {
                                messagingService.markAsRead(conversation.id, user.user_id, 'user').catch(err => {
                                    console.error('Error marking message as read:', err);
                                });
                            }
                        }
                    },
                    `conversation_id=eq.${conversation.id}`
                ).then((unsub) => {
                    if (isMounted && unsub) unsubscribers.push(unsub);
                }).catch((error) => {
                    console.error('Error setting up message subscription:', error);
                });
            });

            return () => {
                isMounted = false;
                unsubscribers.forEach((unsub) => {
                    if (typeof unsub === 'function') {
                        unsub();
                    }
                });
            };
        }
    }, [id, user?.user_id]);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/orders');
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !user?.user_id) return;

        const messageText = inputText.trim();
        setInputText('');
        setIsTyping(true);

        // Optimistically add user message
        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
        };

        setMessages(prev => [...prev, newMessage]);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Send message to database
        if (isSupabaseConfigured() && user?.user_id) {
            try {
                // Get or create support conversation for this order
                const conversation = await messagingService.getOrCreateSupportConversation(user.user_id, id);
                
                if (conversation) {
                    const savedMessage = await messagingService.sendMessage(
                        conversation.id,
                        user.user_id,
                        'user',
                        messageText
                    );
                    
                    if (savedMessage) {
                        // Replace optimistic message with saved message from database
                        setMessages(prev => {
                            const filtered = prev.filter(msg => msg.id !== newMessage.id);
                            return [...filtered, {
                                id: savedMessage.id,
                                text: savedMessage.text,
                                sender: 'user',
                                timestamp: new Date(savedMessage.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }),
                            }];
                        });
                    }
                } else {
                    console.error('Failed to get or create support conversation');
                    // Remove optimistic message if conversation creation failed
                    setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
                }
            } catch (error) {
                console.error('Error sending message:', error);
                // Remove optimistic message on error
                setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
            } finally {
                setIsTyping(false);
            }
        } else {
            setIsTyping(false);
        }
    };

    const handleQuickReply = async (reply: string) => {
        if (!user?.user_id) return;

        const messageText = reply.trim();
        setInputText('');

        // Optimistically add user message
        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
        };
        setMessages(prev => [...prev, newMessage]);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        setIsTyping(true);

        // Send message to database
        if (isSupabaseConfigured() && user?.user_id) {
            try {
                const conversation = await messagingService.getOrCreateSupportConversation(user.user_id, id);
                
                if (conversation) {
                    const savedMessage = await messagingService.sendMessage(
                        conversation.id,
                        user.user_id,
                        'user',
                        messageText
                    );
                    
                    if (savedMessage) {
                        // Replace optimistic message with saved message from database
                        setMessages(prev => {
                            const filtered = prev.filter(msg => msg.id !== newMessage.id);
                            return [...filtered, {
                                id: savedMessage.id,
                                text: savedMessage.text,
                                sender: 'user',
                                timestamp: new Date(savedMessage.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }),
                            }];
                        });
                    }
                } else {
                    // Remove optimistic message if conversation creation failed
                    setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
                }
            } catch (error) {
                console.error('Error sending quick reply:', error);
                // Remove optimistic message on error
                setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
            } finally {
                setIsTyping(false);
            }
        } else {
            setIsTyping(false);
        }
    };

    const renderMessage = (message: Message, index: number) => {
        const isUser = message.sender === 'user';

        return (
            <Animated.View
                key={message.id}
                style={[
                    styles.messageContainer,
                    isUser ? styles.messageContainerUser : styles.messageContainerBot,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Bot Avatar */}
                {!isUser && (
                    <View style={styles.botAvatar}>
                        <Robot size={20} color={Colors.primary} weight="duotone" />
                    </View>
                )}

                <View style={[
                    styles.messageContent,
                    isUser && styles.messageContentUser,
                ]}>
                    {/* Message Bubble */}
                    <View style={[
                        styles.messageBubble,
                        isUser ? styles.messageBubbleUser : styles.messageBubbleBot,
                    ]}>
                        <Text style={styles.messageText}>{message.text}</Text>
                    </View>

                    {/* Timestamp */}
                    <Text style={[
                        styles.messageTimestamp,
                        isUser && styles.messageTimestampUser,
                    ]}>
                        {!isUser && message.senderName && `${message.senderName} • `}{message.timestamp}
                    </Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Order Support</Text>
                    <Text style={styles.headerSubtitle}>
                        {order?.order_number ? `Order #${order.order_number}` : order?.id ? `Order ${order.id.slice(0, 8)}` : `Order #${orderNumber}`}
                    </Text>
                    {order && (
                        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                            <Text style={[styles.statusBadgeText, { color: getStatusColor(order.status) }]}>
                                {order.status.replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
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
                    {/* Order Info Card */}
                    {order && (
                        <View style={styles.orderInfoCard}>
                            <View style={styles.orderInfoHeader}>
                                <Package size={20} color={Colors.primary} weight="duotone" />
                                <Text style={styles.orderInfoTitle}>Order Details</Text>
                            </View>
                            <View style={styles.orderInfoRow}>
                                <Text style={styles.orderInfoLabel}>Status:</Text>
                                <View style={[styles.statusBadgeInline, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                                    <Text style={[styles.statusBadgeTextInline, { color: getStatusColor(order.status) }]}>
                                        {order.status.replace('_', ' ').toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.orderInfoRow}>
                                <Text style={styles.orderInfoLabel}>Items:</Text>
                                <Text style={styles.orderInfoValue}>
                                    {Array.isArray(order.items) ? order.items.length : (typeof order.items === 'object' && order.items !== null ? Object.keys(order.items).length : 0)} item(s)
                                </Text>
                            </View>
                            <View style={styles.orderInfoRow}>
                                <Text style={styles.orderInfoLabel}>Total:</Text>
                                <Text style={styles.orderInfoValue}>£{(order.total || 0).toFixed(2)}</Text>
                            </View>
                            {order.estimated_delivery && (
                                <View style={styles.orderInfoRow}>
                                    <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
                                    <Text style={styles.orderInfoValue}>
                                        {new Date(order.estimated_delivery).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Timestamp */}
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Text>
                    </View>

                    {/* Messages */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading messages...</Text>
                        </View>
                    ) : messages.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Robot size={48} color={Colors.textMuted} weight="duotone" />
                            <Text style={styles.emptyStateTitle}>No messages yet</Text>
                            <Text style={styles.emptyStateText}>
                                Start a conversation with our support team about your order.
                            </Text>
                        </View>
                    ) : (
                        messages.map((message, index) => renderMessage(message, index))
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <View style={styles.typingContainer}>
                            <View style={styles.typingDots}>
                                <View style={[styles.typingDot, styles.typingDot1]} />
                                <View style={[styles.typingDot, styles.typingDot2]} />
                                <View style={[styles.typingDot, styles.typingDot3]} />
                            </View>
                            <Text style={styles.typingText}>Support Agent is typing...</Text>
                        </View>
                    )}

                    {/* Bottom padding */}
                    <View style={{ height: Spacing.base }} />
                </ScrollView>

                {/* Bottom Section */}
                <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
                    {/* Quick Replies */}
                    {QuickReplies.orderSupport.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.quickRepliesContainer}
                        >
                            {QuickReplies.orderSupport.map((reply, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.quickReplyChip}
                                    onPress={() => handleQuickReply(reply)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.quickReplyText}>{reply}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* Message Input */}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.attachButton}
                            activeOpacity={0.8}
                        >
                            <Paperclip size={22} color={Colors.textMuted} weight="regular" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder={Placeholders.form.message}
                            placeholderTextColor={Colors.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
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
                                size={22}
                                color={Colors.textPrimary}
                                weight={inputText.trim() ? "fill" : "regular"}
                            />
                        </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FontFamily.display,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    headerRight: {
        width: 44,
    },
    keyboardView: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.md,
        gap: Spacing.lg,
    },
    timestampContainer: {
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    timestampText: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.caption,
        color: Colors.textMuted,
        backgroundColor: Colors.cardDark,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.sm,
        maxWidth: '85%',
    },
    messageContainerBot: {
        alignSelf: 'flex-start',
    },
    messageContainerUser: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    botAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.cardDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.sm,
    },
    messageContent: {
        gap: Spacing.xs,
        alignItems: 'flex-start',
    },
    messageContentUser: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        maxWidth: '100%',
        ...Shadows.sm,
    },
    messageBubbleBot: {
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        borderBottomLeftRadius: Spacing.xs,
    },
    messageBubbleUser: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: Spacing.xs,
    },
    messageText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    messageTimestamp: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.tiny,
        color: Colors.textMuted,
        marginLeft: Spacing.xs,
    },
    messageTimestampUser: {
        marginRight: Spacing.xs,
        marginLeft: 0,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginLeft: 48,
    },
    typingDots: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
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
        paddingTop: Spacing.md,
    },
    quickRepliesContainer: {
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    quickReplyChip: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.borderOutline,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    quickReplyText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.sm,
    },
    attachButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.md,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.cardDark,
        borderWidth: 1,
        borderColor: Colors.borderDark,
        ...Shadows.sm,
    },
    loadingContainer: {
        paddingVertical: Spacing.xl,
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
    },
    emptyStateContainer: {
        paddingVertical: Spacing.xl * 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    emptyStateTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginTop: Spacing.md,
    },
    emptyStateText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        marginTop: 4,
    },
    statusBadgeText: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.tiny,
    },
    orderInfoCard: {
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },
    orderInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    orderInfoTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    orderInfoLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.body,
        color: Colors.textMuted,
    },
    orderInfoValue: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
    },
    statusBadgeInline: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    statusBadgeTextInline: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.caption,
    },
});

const getStatusColor = (status: string) => {
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
