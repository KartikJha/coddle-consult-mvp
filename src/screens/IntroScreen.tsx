import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Platform, UIManager, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Haptics from 'expo-haptics';
import { impactAsync, selectionAsync } from '../utils/haptics';
import { theme, colors } from '../theme/colors';
import MainLayout from '../components/MainLayout';
import { useConsult, ChatSession } from '../context/ConsultContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

// Message type for history rendering (matching ChatSession structure inner type)
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'clinician';
};

export default function IntroScreen() {
  const navigation = useNavigation<IntroScreenNavigationProp>();
  const { history } = useConsult();
  const [showHistory, setShowHistory] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Concern');
  };

  const handleCardPress = () => {
    selectionAsync();
  };

  const renderHistoryItem = ({ item }: { item: ChatSession }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyDate}>{item.date}</Text>
      {item.messages.map((msg) => (
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
      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Previous Chats</Text>
            <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>No previous chats found.</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.historyList}
            />
          )}
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Coddle Consult</Text>
          <Text style={styles.subtitle}>
            Get expert advice for your parenting concerns, from real clinicians.
          </Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setShowHistory(true)}
        >
          <Text style={styles.historyButtonText}>🕒 See previous messages</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Cream
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary, // Navy
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // More rounded
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.systemBubble, // Lavender
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700', // Bolder
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    backgroundColor: colors.primaryAction, // Salmon
    borderRadius: 30, // Pill
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.primaryAction,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  historyButtonText: {
    color: colors.textSecondary,
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
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  clinicianBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.systemBubble,
    borderTopLeftRadius: 4,
  },
  historyText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
