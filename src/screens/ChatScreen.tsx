import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, Animated, LayoutAnimation, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync, notificationAsync } from '../utils/haptics';

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
    <Animated.View style={[
      styles.messageBubble,
      isUser ? styles.userBubble : styles.clinicianBubble,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={[
        styles.messageText,
        isUser ? styles.userText : styles.clinicianText
      ]}>{item.text}</Text>
    </Animated.View>
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
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
      <Text style={styles.typingText}>Dr. Chen is replying...</Text>
    </View>
  )
}

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { concern } = useConsult();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<'initial_wait' | 'unlocked' | 'second_wait' | 'complete'>('initial_wait');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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
      setMessages(prev => [...prev, finalReply]);
      setIsTyping(false);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setChatState('complete');
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
      navigation.navigate('Completion');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consult Session</Text>
      </View>

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
                  multiline
                />
                <TouchableOpacity onPress={handleSend} disabled={!input.trim()}>
                  <Text style={[styles.sendText, !input.trim() && styles.sendDisabled]}>Send</Text>
                </TouchableOpacity>
              </View>
            )}
            {chatState !== 'unlocked' && chatState !== 'initial_wait' && chatState !== 'second_wait' && <Text style={styles.limitText}>Message 2 of 2</Text>}
            {chatState === 'unlocked' && <Text style={styles.limitText}>You have 1 follow-up message remaining.</Text>}
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  clinicianBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  clinicianText: {
    color: '#000',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    height: 40,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginHorizontal: 3,
  },
  typingText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  lockedInput: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lockedText: {
    color: '#888',
    fontStyle: 'italic',
  },
  activeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  sendDisabled: {
    color: '#ccc',
  },
  limitText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  actionContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  completeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  videoButtonText: {
    color: '#fff',
  },
});
