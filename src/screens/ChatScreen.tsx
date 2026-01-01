import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'clinician';
};

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { concern } = useConsult();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<'initial_wait' | 'unlocked' | 'second_wait' | 'complete'>('initial_wait');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initial Load: Show User's concern as their first message
    const initialMessages: Message[] = [
      { id: '1', text: concern, sender: 'user' }
    ];
    setMessages(initialMessages);

    // Start waiting for clinician reply
    setChatState('initial_wait');
    setIsTyping(true);

    const timer = setTimeout(() => {
      const reply: Message = {
        id: '2',
        text: "Hi there. I understand this is stressful. Based on what you've shared, it sounds like typical regression. Have there been any recent changes in the household?",
        sender: 'clinician'
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
      setChatState('unlocked');
    }, 4000); // 4s delay

    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setChatState('second_wait');
    setIsTyping(true);

    // Wait for final reply
    setTimeout(() => {
      const finalReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for sharing that. It does confirm my suspicion. I recommend sticking to a consistent routine for 3 days. If it persists, let's do a video check-in.",
        sender: 'clinician'
      };
      setMessages(prev => [...prev, finalReply]);
      setIsTyping(false);
      setChatState('complete');
    }, 3000); // 3s delay
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.clinicianBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.clinicianText
        ]}>{item.text}</Text>
      </View>
    );
  };

  const handleComplete = (action: 'new' | 'video') => {
    if (action === 'new') {
      navigation.navigate('Completion'); // Or handle reset directly via context in completion
    } else {
      navigation.navigate('Completion'); // Could pass params to pre-select video
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

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.typingText}>Dr. Chen is replying...</Text>
        </View>
      )}

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
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  typingText: {
    color: '#666',
    fontSize: 14,
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
