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

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: string;
    senderName?: string;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        text: 'Hello! I see you have a question about your recent order. How can I help you today?',
        sender: 'bot',
        timestamp: '10:23 AM',
        senderName: 'Zora Support',
    },
    {
        id: '2',
        text: "My package says delivered but I don't see it on my porch.",
        sender: 'user',
        timestamp: '10:25 AM',
    },
    {
        id: '3',
        text: "I'm sorry to hear that. Sometimes carriers mark packages as delivered a few hours early. Would you like me to open an investigation with the carrier?",
        sender: 'bot',
        timestamp: '10:25 AM',
        senderName: 'Zora Support',
    },
];

export default function OrderSupportScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const orderNumber = id || '29384';

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/orders');
        }
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate bot response
        setTimeout(() => {
            setIsTyping(false);
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for your message. I'm looking into this for you. Is there anything else I can help with?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                senderName: 'Zora Support',
            };
            setMessages(prev => [...prev, botResponse]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 2000);
    };

    const handleQuickReply = (reply: string) => {
        setInputText(reply);
        // Auto-send quick reply
        setTimeout(() => {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: reply,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
            };
            setMessages(prev => [...prev, newMessage]);
            setInputText(''); // Clear input after sending, consistent with handleSend
            setIsTyping(true);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);

            // Bot response
            setTimeout(() => {
                setIsTyping(false);
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "I understand. Let me help you with that right away.",
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }),
                    senderName: 'Zora Support',
                };
                setMessages(prev => [...prev, botResponse]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }, 1500);
        }, 300);
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
                    <Text style={styles.headerSubtitle}>Order #{orderNumber}</Text>
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
                    {/* Timestamp */}
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>Today, 10:23 AM</Text>
                    </View>

                    {/* Messages */}
                    {messages.map((message, index) => renderMessage(message, index))}

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
});
