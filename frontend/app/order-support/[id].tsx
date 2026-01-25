import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  PaperPlaneRight,
  Paperclip,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_CARD = '#3A2A21';
const SURFACE_DARK = '#342418';
const BOT_BUBBLE = '#342418';
const USER_BUBBLE = '#CC0000';

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
    text: 'Hello! I see you have a question about your recent order of Jollof Rice spices. How can I help you today?',
    sender: 'bot',
    timestamp: '10:23 AM',
    senderName: 'Zora Bot',
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
    senderName: 'Zora Bot',
  },
];

const QUICK_REPLIES = [
  "Where's my order?",
  "Wrong item",
  "Request refund",
  "Speak to human",
];

export default function OrderSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderNumber = id || '29384';
  
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    
    setMessages([...messages, newMessage]);
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
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        senderName: 'Zora Bot',
      };
      setMessages(prev => [...prev, botResponse]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.sender === 'user';
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showTimestamp = !prevMessage || prevMessage.sender !== message.sender;
    
    return (
      <View 
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.messageContainerUser : styles.messageContainerBot,
        ]}
      >
        {/* Bot Avatar */}
        {!isUser && (
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100' }}
            style={styles.botAvatar}
          />
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
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Quick Replies */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesContainer}
          >
            {QUICK_REPLIES.map((reply, index) => (
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

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip size={22} color="rgba(255,255,255,0.5)" weight="regular" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255,255,255,0.3)"
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
            >
              <PaperPlaneRight size={22} color="#FFFFFF" weight="fill" />
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
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  
  // Keyboard View
  keyboardView: {
    flex: 1,
  },
  
  // Chat Area
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    gap: 24,
  },
  
  // Timestamp
  timestampContainer: {
    alignItems: 'center',
  },
  timestampText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
    backgroundColor: 'rgba(52, 36, 24, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  
  // Message
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SURFACE_DARK,
  },
  messageContent: {
    gap: 4,
    alignItems: 'flex-start',
  },
  messageContentUser: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '100%',
  },
  messageBubbleBot: {
    backgroundColor: BOT_BUBBLE,
    borderBottomLeftRadius: 4,
  },
  messageBubbleUser: {
    backgroundColor: USER_BUBBLE,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  messageTimestamp: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  messageTimestampUser: {
    marginRight: 4,
    marginLeft: 0,
  },
  
  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 44,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
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
    fontSize: 12,
    color: Colors.textMuted,
  },
  
  // Bottom Section
  bottomSection: {
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  
  // Quick Replies
  quickRepliesContainer: {
    paddingHorizontal: Spacing.base,
    gap: 8,
    marginBottom: 12,
  },
  quickReplyChip: {
    backgroundColor: SURFACE_DARK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  quickReplyText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: Spacing.base,
    paddingBottom: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: SURFACE_DARK,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ZORA_RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(193, 39, 45, 0.3)',
  },
});
