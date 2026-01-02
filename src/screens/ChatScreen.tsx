import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, Animated, LayoutAnimation, UIManager, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync, notificationAsync } from '../utils/haptics';
import { colors } from '../theme/colors';
import MainLayout from '../components/MainLayout';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'clinician';
};

// Animated Message Component
const AnimatedMessage = ({ item }: { item: Message }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const isUser = item.sender === 'user';
  return (
    <View style={styles.messageRow}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
      )}
      <Animated.View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.clinicianBubble,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        {!isUser && <Text style={styles.senderName}>Dr. Chen</Text>}
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.clinicianText
        ]}>{item.text}</Text>
      </Animated.View>
    </View>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  const [dots] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  useEffect(() => {
    const animations = dots.map((dot, index) => {
      return Animated.sequence([
        Animated.delay(index * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
          ])
        )
      ]);
    });
    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>C</Text>
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  )
}

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { concern, setSupportType, addToHistory } = useConsult();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<'initial_wait' | 'unlocked' | 'second_wait' | 'complete'>('initial_wait');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Ref to track if current session is saved to avoid duplicates if re-rendering or multiple completion triggers
  const sessionSaved = useRef(false);

  useEffect(() => {
    // Initial Load
    const initialMessages: Message[] = [
      { id: '1', text: concern, sender: 'user' }
    ];
    setMessages(initialMessages);

    setChatState('initial_wait');
    setIsTyping(true);

    const timer = setTimeout(() => {
      const reply: Message = {
        id: '2',
        text: "Hi there. I understand this is stressful. Based on what you've shared, it sounds like typical regression. Have there been any recent changes in the household?",
        sender: 'clinician'
      };
      notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setChatState('unlocked');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatState('second_wait');
    setIsTyping(true);

    // Wait for final reply
    setTimeout(() => {
      const finalReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for sharing that. It does confirm my suspicion. I recommend sticking to a consistent routine for 3 days. If it persists, let's do a video check-in.",
        sender: 'clinician'
      };
      notificationAsync(Haptics.NotificationFeedbackType.Success);

      const completedMessages = [...messages, newMessage, finalReply];
      setMessages(completedMessages);
      setIsTyping(false);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setChatState('complete');

      // Save to history
      if (!sessionSaved.current) {
        addToHistory({
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          messages: completedMessages
        });
        sessionSaved.current = true;
      }
    }, 3000);
  };

  const renderItem = ({ item }: { item: Message }) => {
    return <AnimatedMessage item={item} />;
  };

  const handleComplete = (action: 'new' | 'video') => {
    impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action === 'new') {
      navigation.navigate('Completion');
    } else {
      // Set support type to video and navigate to Provider (Step 2)
      // The concern (Step 1 input) remains in context
      setSupportType('video');
      navigation.navigate('Provider');
    }
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyDate}>{item.date}</Text>
      {item.messages.map((msg: Message) => (
        <View key={msg.id} style={[
          styles.historyMessageRow,
          msg.sender === 'user' ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
        ]}>
          <View style={[
            styles.historyBubble,
            msg.sender === 'user' ? styles.userBubble : styles.clinicianBubble
          ]}>
            <Text style={styles.historyText}>{msg.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <MainLayout variant="main" showBack={false}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && <TypingIndicator />}

      {chatState === 'complete' ? (
        <View style={styles.actionContainer}>
          <Text style={styles.completeText}>Chat Complete</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleComplete('new')}>
              <Text style={styles.actionButtonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.videoButton]} onPress={() => handleComplete('video')}>
              <Text style={[styles.actionButtonText, styles.videoButtonText]}>Book Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            {chatState === 'initial_wait' || chatState === 'second_wait' ? (
              <View style={styles.lockedInput}>
                <Text style={styles.lockedText}>
                  {chatState === 'initial_wait' ? "Waiting for clinician reply..." : "Message sent. Waiting for final reply..."}
                </Text>
              </View>
            ) : (
              <View style={styles.activeInputRow}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type your follow-up..."
                  placeholderTextColor="#999"
                  multiline
                />
                <TouchableOpacity onPress={handleSend} disabled={!input.trim()}>
                  <View style={[styles.sendButton, !input.trim() && styles.sendDisabled]}>
                    <Text style={styles.sendText}>→</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {chatState !== 'unlocked' && chatState !== 'initial_wait' && chatState !== 'second_wait' && <Text style={styles.limitText}>Message 2 of 2</Text>}
            {chatState === 'unlocked' && <Text style={styles.limitText}>You have 1 follow-up message remaining.</Text>}
          </View>
        </KeyboardAvoidingView>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryAction, // Salmon avatar for brand
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4, // Align top
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble, // Mint
    borderBottomRightRadius: 4,
    marginLeft: 'auto', // Push to right
  },
  clinicianBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.systemBubble, // Lavender
    borderTopLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.textPrimary,
  },
  clinicianText: {
    color: colors.textPrimary,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: colors.systemBubble,
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    alignItems: 'center',
    height: 54,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  lockedInput: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  lockedText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  activeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: '#ccc',
  },
  sendText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },
  limitText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  actionContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  completeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primaryAction,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  videoButton: {
    backgroundColor: colors.primaryAction,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryAction,
  },
  videoButtonText: {
    color: '#fff',
  },
  headerActions: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyButtonText: {
    color: colors.primaryAction,
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.primaryAction,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHistoryText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  historyList: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  historyMessageRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  historyBubble: {
    maxWidth: '85%',
    padding: 10,
    borderRadius: 12,
  },
  historyText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
